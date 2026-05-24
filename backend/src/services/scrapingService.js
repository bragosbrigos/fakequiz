const puppeteer = require('puppeteer');
const chromium = require('@sparticuz/chromium');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const axios = require('axios');

async function createBrowser() {
  return await puppeteer.launch({
    args: [
      ...chromium.args,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
    ],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
}

const LEAGUES = [
  {
    name: 'LCS',
    url: 'https://oracleselixir.com/stats/players/byTournament/LCS%2F2026%20Season%2FSpring%20Season',
  },
  {
    name: 'LCK',
    url: 'https://oracleselixir.com/stats/players/byTournament/LCK%2F2026%20Season%2FRounds%201-2',
  },
  {
    name: 'LEC',
    url: 'https://oracleselixir.com/stats/players/byTournament/LEC%2F2026%20Season%2FSpring%20Season',
  },
  {
    name: 'LPL',
    url: 'https://oracleselixir.com/stats/players/byTournament/LPL%2F2026%20Season%2FSplit%202',
  },
  {
    name: 'CBLOL',
    urls: [
      'https://oracleselixir.com/stats/players/byTournament/CBLOL%2F2026%20Season%2FSplit%201',
      'https://oracleselixir.com/stats/players/byTournament/CBLOL%2F2026%20Season%2FSplit%201%20Playoffs',
    ],
  },
];

const DOWNLOAD_DIR = path.join(__dirname, '../../downloads');

if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

async function downloadCSV(page, url, filename) {
  await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout: 120000,
  });

  const client = await page.target().createCDPSession();

  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: DOWNLOAD_DIR,
  });

  await page.waitForFunction(
    () => {
      const links = Array.from(document.querySelectorAll('a'));
      return links.find(
        (link) => link.textContent.trim() === 'Download This Table'
      );
    },
    { timeout: 30000 }
  );

  await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));

    const target = links.find(
      (link) => link.textContent.trim() === 'Download This Table'
    );

    if (target) {
      target.click();
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 5000));

  const files = fs
    .readdirSync(DOWNLOAD_DIR)
    .filter((f) => f.endsWith('.csv'))
    .map((f) => ({
      name: f,
      time: fs.statSync(path.join(DOWNLOAD_DIR, f)).mtime,
    }));

  if (!files.length) {
    return null;
  }

  files.sort((a, b) => b.time - a.time);

  const latestFile = files[0].name;

  const oldPath = path.join(DOWNLOAD_DIR, latestFile);
  const newPath = path.join(DOWNLOAD_DIR, filename);

  if (latestFile !== filename) {
    fs.renameSync(oldPath, newPath);
  }

  return newPath;
}

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

async function scrapePlayers() {
  const browser = await createBrowser();

  try {
    const page = await browser.newPage();

    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    const allPlayers = [];

    for (const league of LEAGUES) {
      if (league.urls) {
        const playerStatsMap = new Map();

        for (let i = 0; i < league.urls.length; i++) {
          const url = league.urls[i];

          const filename = `players_${league.name.toLowerCase()}_${i}.csv`;

          const filePath = await downloadCSV(page, url, filename);

          if (filePath && fs.existsSync(filePath)) {
            const players = await parseCSV(filePath);

            players.forEach((p) => {
              p.league = league.name;
            });

            for (const player of players) {
              const playerName =
                player.Player || player.player || 'Unknown';

              if (playerStatsMap.has(playerName)) {
                const existingPlayer = playerStatsMap.get(playerName);

                const gamesKey = Object.keys(player).find(
                  (k) =>
                    k.toLowerCase().includes('games') ||
                    k.toLowerCase() === 'gp'
                );

                const winsKey = Object.keys(player).find(
                  (k) =>
                    k.toLowerCase().includes('win') &&
                    !k.toLowerCase().includes('percentage')
                );

                existingPlayer[gamesKey] = String(
                  (parseInt(existingPlayer[gamesKey]) || 0) +
                    (parseInt(player[gamesKey]) || 0)
                );

                existingPlayer[winsKey] = String(
                  (parseInt(existingPlayer[winsKey]) || 0) +
                    (parseInt(player[winsKey]) || 0)
                );
              } else {
                playerStatsMap.set(playerName, { ...player });
              }
            }
          }
        }

        allPlayers.push(...Array.from(playerStatsMap.values()));
      } else {
        const filename = `players_${league.name.toLowerCase()}.csv`;

        const filePath = await downloadCSV(
          page,
          league.url,
          filename
        );

        if (filePath && fs.existsSync(filePath)) {
          const players = await parseCSV(filePath);

          players.forEach((p) => {
            p.league = league.name;
          });

          allPlayers.push(...players);
        }
      }
    }

    return allPlayers;
  } catch (error) {
    console.error('SCRAPE PLAYERS ERROR:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

module.exports = {
  scrapePlayers,
  scrapeTeams,
  scrapeChampions,
};
