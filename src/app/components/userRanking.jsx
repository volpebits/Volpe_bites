"use client";

export function TopUsersCard() {
  const topUsers = [
    {
      name: "GameMaster2024",
      xp: 15750,
      level: 42,
      badge: "🔥",
    },
    {
      name: "PixelHunter",
      xp: 13290,
      level: 38,
      badge: "⚡",
    },
    {
      name: "RetroGamer",
      xp: 11840,
      level: 35,
      badge: "💎",
    },
    {
      name: "SpeedRunner99",
      xp: 10560,
      level: 32,
      badge: "🚀",
    },
    {
      name: "CasualPro",
      xp: 9875,
      level: 30,
      badge: "⭐",
    },
  ];

  const formatXP = (xp) => {
    if (xp >= 1000) {
      return `${(xp / 1000).toFixed(1)}k`;
    }
    return xp.toString();
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return "text-yellow-300"; // Ouro
      case 1:
        return "text-gray-300"; // Prata
      case 2:
        return "text-amber-600"; // Bronze
      default:
        return "text-white";
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
    <div className="w-full min-w-80 bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700 text-white rounded-2xl shadow-lg p-4">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
        🏆 Top 5 Usuários por XP
      </h2>
      <ul className="space-y-2">
        {topUsers.map((user, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-gray-600/50 p-3 rounded-xl hover:bg-purple-700/40 transition"
          >
            <div className="flex items-center gap-3">
              <span className={`font-bold text-lg ${getRankColor(index)}`}>
                {getRankEmoji(index)}
              </span>
              <div>
                <span className="font-medium block">{user.name}</span>
                <span className="text-purple-200 text-sm">
                  Nível {user.level}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-green-400 font-semibold block">
                  {formatXP(user.xp)} XP
                </span>
              </div>
              <span className="text-lg">{user.badge}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
