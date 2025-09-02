"use client";
import { useState } from "react";
import gamesData from "../../data/games.js";

export default function GameCards() {
  const [selectedGame, setSelectedGame] = useState(null);

  return (
    <div className="relative bg-gradient-to-r from-purple-400 to-purple-600 dark:bg-gradient-to-r dark:from-purple-950">
      <section className="bg-gradient-to-r from-purple-400 to-purple-600 dark:bg-gradient-to-r dark:from-purple-950 py-10 min-h-screen">
        {/* Título centralizado */}
        <h1 className="text-3xl font-bold text-center text-green-400 mb-12 dark:text-green-400">
          Conheça Outros Jogos Brasileiros!
        </h1>

        {/* Grid de cards */}
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
          {gamesData.map((game) => (
            <div
              key={game.id}
              className="relative z-10 bg-white rounded-2xl shadow-md overflow-hidden hover:scale-105 transition transform duration-300 cursor-pointer"
              onClick={() => setSelectedGame(game)}
            >
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {game.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  {game.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedGame && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={() => setSelectedGame(null)}
        >
          <div
            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl max-w-lg w-full relative border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-300 hover:text-white text-xl"
              onClick={() => setSelectedGame(null)}
            >
              ✕
            </button>
            <img
              src={selectedGame.image}
              alt={selectedGame.title}
              className="w-full h-48 object-cover rounded-md"
            />
            <h2 className="text-2xl font-bold mt-4 text-white">
              {selectedGame.title}
            </h2>
            <p className="text-gray-200 mt-2">{selectedGame.description}</p>

            {selectedGame.link && (
              <a
                href={selectedGame.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block w-full text-center bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Jogar Agora
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
