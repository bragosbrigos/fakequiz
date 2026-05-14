import { useState } from 'react';
import { getScheduledMatches } from '../../data/mockData';

export function ScheduledMatchesCalendar() {
  const [filterLeague, setFilterLeague] = useState('all');
  const scheduledMatches = getScheduledMatches();

  const leagues = ['all', 'CBLOL', 'LCK', 'LEC', 'LCS', 'LPL'];
  
  const filteredMatches = filterLeague === 'all' 
    ? scheduledMatches 
    : scheduledMatches.filter(m => m.league === filterLeague);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getLeagueColor = (league) => {
    const colors = {
      CBLOL: 'from-green-500 to-emerald-600',
      LCK: 'from-blue-500 to-indigo-600',
      LEC: 'from-purple-500 to-pink-600',
      LCS: 'from-orange-500 to-red-600',
      LPL: 'from-red-500 to-rose-600',
    };
    return colors[league] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-white mb-4">
          <span className="text-gradient bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
            Calendário de Partidas
          </span>
        </h1>
        <p className="text-gray-400">Acompanhe as próximas partidas competitivas de todas as ligas</p>
      </div>

      {/* League Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {leagues.map(league => (
          <button
            key={league}
            onClick={() => setFilterLeague(league)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterLeague === league
                ? 'bg-gold-600/20 text-gold-400 border border-gold-600/40'
                : 'bg-dark-100 text-gray-400 border border-gray-700/30 hover:border-gold-600/40'
            }`}
          >
            {league === 'all' ? 'Todas' : league}
          </button>
        ))}
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {filteredMatches.map((match) => (
          <div
            key={match.id}
            className="bg-gradient-to-r from-dark-100 to-dark-200 rounded-xl p-6 border border-gray-700/30 hover:border-gold-600/40 transition-all group"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Date & Stage */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className={`w-1 h-12 rounded-full bg-gradient-to-b ${getLeagueColor(match.league)}`} />
                <div>
                  <div className="text-gold-400 font-bold text-lg">{formatDate(match.date)}</div>
                  <div className="text-gray-400 text-sm">{match.time}</div>
                  <div className="text-xs text-gray-500 mt-1">{match.stage} • Bo{match.bestOf}</div>
                </div>
              </div>

              {/* Teams */}
              <div className="flex-1 flex items-center justify-center gap-6">
                <div className="text-right flex-1">
                  <div className="text-white font-bold text-lg">{match.team1}</div>
                  <div className="text-2xl">{match.team1Logo}</div>
                </div>
                <div className="text-gray-500 font-display font-bold text-xl">VS</div>
                <div className="text-left flex-1">
                  <div className="text-white font-bold text-lg">{match.team2}</div>
                  <div className="text-2xl">{match.team2Logo}</div>
                </div>
              </div>

              {/* League Badge */}
              <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${getLeagueColor(match.league)} bg-opacity-20`}>
                <span className="text-white font-bold text-sm">{match.league}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMatches.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhuma partida agendada encontrada
        </div>
      )}
    </div>
  );
}
