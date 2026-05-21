import { useState } from 'react';
import { TeamCard } from '../components/teams/TeamCard';
import { TEAMS } from '../data/mockData';

export function Teams() {
  const [selectedLeague, setSelectedLeague] = useState('ALL');
  
  const leagues = ['ALL', 'CBLOL', 'LCK', 'LEC', 'LCS', 'LPL'];
  
  // Transform TEAMS object into array format for easier mapping
  const allTeams = Object.entries(TEAMS).flatMap(([league, teams]) =>
    teams.map(team => ({ ...team, league }))
  );
  
  const filteredTeams = selectedLeague === 'ALL' 
    ? allTeams 
    : allTeams.filter(team => team.league === selectedLeague);

  return (
    <div className="pt-24 pb-12 min-h-screen animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-bold text-3xl text-white mb-8">
          <span className="text-gradient bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
            Times
          </span>
        </h1>

        {/* Filtros de Liga */}
        <div className="mb-8 flex flex-wrap gap-2">
          {leagues.map(league => (
            <button
              key={league}
              onClick={() => setSelectedLeague(league)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedLeague === league
                  ? 'bg-gold-600 text-dark-300'
                  : 'bg-dark-100 text-gray-300 hover:text-gold-400 hover:bg-gold-600/10 border border-gray-700/30'
              }`}
            >
              {league === 'ALL' ? 'Todas as Ligas' : league}
            </button>
          ))}
        </div>

        {/* Grid de Times */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeams.map(team => (
            <TeamCard key={`${team.id}-${team.league}`} team={team} league={team.league} />
          ))}
        </div>

        {!filteredTeams.length && (
          <div className="text-center py-12 text-gray-500">
            Nenhum time encontrado para esta liga
          </div>
        )}
      </div>
    </div>
  );
}
