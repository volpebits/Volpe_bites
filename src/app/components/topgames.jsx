"use client";

export function TopGamesCard() {
  const topGames = [
    {
      name: "Horizon Chase Turbo",
      trend: "🔥",
      color: "text-red-400",
    },
    {
      name: "Minoria",
      trend: "⚡",
      color: "text-yellow-400",
    },
    {
      name: "Enigma do Medo",
      trend: "💎",
      color: "text-blue-400",
    },
    {
      name: "Pipistrello ...",
      trend: "🚀",
      color: "text-green-400",
    },
    {
      name: "Chroma Squad",
      trend: "⭐",
      color: "text-purple-400",
    },
  ];

  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return "text-yellow-300 bg-yellow-300/20"; // Ouro
      case 1:
        return "text-gray-300 bg-gray-300/20"; // Prata
      case 2:
        return "text-amber-600 bg-amber-600/20"; // Bronze
      default:
        return "text-white bg-white/10";
    }
  };

  const getRankEmoji = (index) => {
    switch (index) {
      case 0:
        return "👑";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `${index + 1}.`;
    }
  };

  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700 text-white rounded-2xl shadow-lg p-4">
      {/* Efeito de brilho sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>

      {/* Partícula decorativa pequena */}
      <div className="absolute -top-2 -right-2 w-16 h-16 bg-purple-400/20 rounded-full blur-xl animate-pulse"></div>

      <div className="relative z-10">
        {/* Título melhorado */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl animate-bounce">🏆</span>
            <h2 className="text-lg font-black bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Top 5 Jogos da Semana
            </h2>
          </div>
          <div className="w-16 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent rounded-full"></div>
        </div>

        {/* Lista melhorada */}
        <ul className="space-y-2">
          {topGames.map((game, index) => (
            <li
              key={index}
              className="group flex items-center justify-between bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-xl hover:bg-purple-700/30 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-[1.02]"
            >
              {/* Lado esquerdo - Rank e Nome */}
              <div className="flex items-center gap-3">
                <span
                  className={`font-bold text-sm px-2 py-1 rounded-lg ${getRankColor(
                    index
                  )}`}
                >
                  {getRankEmoji(index)}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm leading-tight block truncate group-hover:text-purple-100 transition-colors">
                    {game.name}
                  </span>
                </div>
              </div>

              {/* Lado direito - Trend */}
              <div className="flex items-center gap-1">
                <span
                  className={`text-lg ${game.color} group-hover:scale-110 transition-transform`}
                >
                  {game.trend}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* Footer com info extra */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-xs text-purple-200 text-center">
            📅 Atualizado hoje •{" "}
            <span className="text-green-300">+3 novos</span>
          </p>
        </div>
      </div>
    </div>
  );
}
