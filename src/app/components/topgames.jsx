"use client";

export function TopGamesCard() {
  const topGames = [
    "Horizon Chase Turbo",
    "Minoria",
    "Enigma do Medo",
    "Pipistrello and the Cursed Yoyo",
    "Chroma Squad",
  ];

  return (
    <div className="w-full bg-purple-900/40 text-white rounded-2xl shadow-lg p-4">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
        🏆 Top 5 Jogos da Semana
      </h2>
      <ul className="space-y-2">
        {topGames.map((game, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-purple-800/50 p-2 rounded-xl hover:bg-purple-700/40 transition"
          >
            <span className="font-medium">
              {index + 1}. {game}
            </span>
            <span className="text-green-400 font-semibold">🔥</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
