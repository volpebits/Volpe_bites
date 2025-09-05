"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gamesData from "../../data/games.js";

export default function GamesLayout() {
  const [search, setSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerPage = 3; 
  const totalPages = Math.ceil(gamesData.slice(0, 8).length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const filteredGames = gamesData.filter((game) =>
    game.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-400 via-purple-500 to-purple-500 dark:bg-gradient-to-b dark:from-purple-700 dark:via-purple-800 dark:to-purple-950 text-white">
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {/* Jogos mais populares */}
        <section className="mb-12 relative">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Jogos mais populares
          </h2>
          <div className="flex items-center justify-center">
            {/* Botão esquerda */}
            <button
              onClick={prevSlide}
              className="absolute left-0 bg-purple-900 p-2 rounded-full shadow-lg hover:bg-purple-700"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Área do carrossel */}
            <div className="flex gap-6 overflow-hidden w-full justify-center">
              {gamesData
                .slice(
                  currentIndex * itemsPerPage,
                  currentIndex * itemsPerPage + itemsPerPage
                )
                .map((game) => (
                  <div
                    key={game.id}
                    className="min-w-[200px] bg-white text-black rounded-lg shadow-md overflow-hidden hover:scale-105 transition cursor-pointer"
                    onClick={() => setSelectedGame(game)}
                  >
                    <img
                      src={game.image}
                      alt={game.title}
                      className="h-32 w-full object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-semibold">{game.title}</h3>
                    </div>
                  </div>
                ))}
            </div>

            {/* Botão direita */}
            <button
              onClick={nextSlide}
              className="absolute right-0 bg-purple-900 p-2 rounded-full shadow-lg hover:bg-purple-700"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </section>

        {/* Pesquisa */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Pesquisar jogo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-lg text-black outline-none"
          />
        </div>

        {/* Grid de jogos */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Todos os jogos */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="bg-white text-black rounded-lg shadow-md overflow-hidden hover:scale-105 transition cursor-pointer"
                onClick={() => setSelectedGame(game)}
              >
                <img
                  src={game.image}
                  alt={game.title}
                  className="h-32 w-full object-cover"
                />
                <div className="p-3">
                  <h3 className="font-semibold">{game.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Jogo destaque do mês: Hell Clock */}
          <div className="bg-white text-black rounded-lg shadow-lg p-4 flex flex-col">
            <img
              src="/images/HellClock2.png"
              alt="Hell Clock"
              className="w-full h-48 object-cover rounded-md"
            />
            <h3 className="text-lg font-semibold mt-4">🎯 Jogo Destaque do Mês</h3>
            <h4 className="text-md font-bold mt-2">Hell Clock</h4>
            <p className="text-sm mt-2 flex-1 font-medium">
              No século XIX, um capítulo nefasto da história Brasileira aconteceu
              no sertão. O povoado de Canudos havia se tornado um santuário para
              milhares que buscavam refúgio. Mas quando desafiaram o recém-formado
              Exército Republicano, sua resistência foi enfrentada com força
              desproporcional. 25,000 homens, mulheres e crianças foram massacrados.
              <br />
              Jogue como Pajéu, um guerreiro que conquistou sua liberdade em batalha,
              lutando para resgatar a alma de Conselheiro - seu mentor e líder
              espiritual de Canudos. A cada descida, o tempo volta, e seus poderes
              aumentam ao enfrentar terrores cada vez mais perigosos.
              {" "}
              <a
                href="https://www.youtube.com/watch?v=98qWEGUjFS8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-700 underline hover:text-purple-900"
              >
                Ver o trailer
              </a>
            </p>
            <a
              href="https://store.steampowered.com/app/123456/Hell_Clock/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg text-center hover:bg-purple-800"
            >
              Jogar Agora
            </a>
          </div>
        </section>
      </main>

      {/* Card Valorização dos Jogos Nacionais */}
      <section className="w-full flex justify-center px-6 pb-16">
        <div className="max-w-3xl bg-white text-black rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">
            🎮 Valorização dos Jogos Nacionais
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Apoiar os jogos brasileiros é fundamental para fortalecer nossa
            indústria criativa, incentivar novos talentos e mostrar ao mundo a
            riqueza cultural que temos. Cada jogo produzido aqui carrega em si
            histórias, tradições e inspirações únicas do nosso país.
          </p>
        </div>
      </section>

      {/* MODAL */}
      {selectedGame && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
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
