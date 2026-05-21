import { Link } from 'react-router-dom';

export function TeamCard({ team, league }) {
  const playerCount = team.players?.length || 0;
  
  return (
    <Link
      to={`/team/${team.id}/${league}`}
      className="bg-dark-100 border border-gray-700/30 rounded-2xl p-6 hover:bg-dark-200/50 hover:border-gold-600/30 transition-all cursor-pointer block group"
    >
      <div className="flex flex-col items-center text-center">
        {/* Logo do Time - Maior e sem borda */}
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gold-400/10 to-gold-600/10 flex items-center justify-center text-5xl mb-4 group-hover:scale-105 transition-transform">
          {team.logo}
        </div>
        
        {/* Nome do Time - Destacado */}
        <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-gold-400 transition-colors">
          {team.name}
        </h3>
        
        {/* Região/Liga */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-600/10 border border-gold-600/20 mb-3">
          <span className="text-xs font-semibold text-gold-400">{league}</span>
        </div>
        
        {/* Informações do Time */}
        <div className="w-full pt-4 border-t border-gray-700/30">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Jogadores</span>
            <span className="text-white font-semibold">{playerCount}</span>
          </div>
          <div className="flex justify-between items-center text-sm mt-2">
            <span className="text-gray-500">Região</span>
            <span className="text-white font-semibold">{team.region}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
