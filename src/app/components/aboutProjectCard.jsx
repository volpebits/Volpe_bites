"use client";
import { useState, useEffect } from "react";

export function AboutProjectCard() {
  const [rating, setRating] = useState(0);
  const [saved, setSaved] = useState(false);
  const [isHovering, setIsHovering] = useState(0);

  useEffect(() => {
    const storedRating = localStorage.getItem("volpe_user_rating");
    if (storedRating) {
      setRating(Number(storedRating));
      setSaved(true);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("volpe_user_rating", rating);
    setSaved(true);
  };

  const getStarIcon = (starNumber) => {
    const currentRating = isHovering > 0 ? isHovering : rating;
    if (starNumber <= currentRating) {
      return "⭐"; // Estrela preenchida
    }
    return "☆"; // Estrela vazia
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700 rounded-3xl shadow-2xl p-6 text-center text-white transform transition-all duration-500 hover:scale-[1.02] hover:shadow-purple-500/25 hover:shadow-2xl group">
      {/* Efeito de brilho/gloss */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60"></div>

      {/* Partículas decorativas menores */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-indigo-400/15 rounded-full blur-2xl group-hover:animate-pulse"></div>

      {/* Conteúdo principal */}
      <div className="relative z-10">
        {/* Título compacto */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="text-2xl animate-bounce">🚀</span>
            <h3 className="text-2xl font-black bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">
              Sobre o Projeto Volpe
            </h3>
            <span className="text-xl">✨</span>
          </div>
          <div className="w-16 h-0.5 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full mx-auto"></div>
        </div>

        {/* Descrição mais compacta */}
        <p className="text-base text-purple-100 max-w-2xl mx-auto mb-5 leading-relaxed font-medium">
          O{" "}
          <span className="font-bold text-green-400 bg-green-400/10 px-1 py-0.5 rounded">
            Volpe
          </span>{" "}
          é uma plataforma dedicada a destacar jogos brasileiros e
          <span className="text-yellow-300 font-semibold">
            {" "}
            fortalecer a indústria
          </span>{" "}
          nacional.
        </p>

        {/* Sistema de avaliação compacto */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <h4 className="text-lg font-bold mb-3 bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
            Avalie a plataforma
          </h4>

          {/* Estrelas compactas */}
          <div className="flex justify-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => {
                  setRating(star);
                  setSaved(false);
                }}
                onMouseEnter={() => setIsHovering(star)}
                onMouseLeave={() => setIsHovering(0)}
                className={`text-2xl transition-all duration-200 transform hover:scale-110 ${
                  star <= (isHovering > 0 ? isHovering : rating)
                    ? "text-yellow-400 drop-shadow-lg"
                    : "text-gray-500 hover:text-gray-400"
                }`}
              >
                {getStarIcon(star)}
              </button>
            ))}
          </div>

          {/* Feedback compacto */}
          {rating > 0 && (
            <div className="mb-3">
              <p className="text-sm font-semibold">
                {rating === 5 && "🤩 Incrível!"}
                {rating === 4 && "😊 Muito bom!"}
                {rating === 3 && "👍 Legal!"}
                {rating === 2 && "😐 Pode melhorar"}
                {rating === 1 && "😔 Precisa melhorar"}
              </p>
            </div>
          )}

          {/* Botões compactos */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={handleSave}
              disabled={rating === 0}
              className={`px-4 py-2 text-sm font-bold rounded-xl shadow-md transition-all duration-300 active:scale-95 ${
                rating === 0
                  ? "bg-gray-500 cursor-not-allowed opacity-50"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {saved ? "✅ Salva!" : "💾 Salvar"}
            </button>

            <a
              href="/avalienos"
              className="px-4 py-2 text-sm bg-white text-purple-700 font-bold rounded-xl shadow-md hover:bg-gray-100 transition-all duration-300 active:scale-95"
            >
              ✍️ Feedback Completo
            </a>
          </div>

          {/* Confirmação compacta */}
          {saved && (
            <div className="mt-2 p-2 bg-green-500/20 border border-green-400/30 rounded-lg">
              <p className="text-green-300 text-sm font-semibold flex items-center justify-center gap-1">
                <span>💜</span>
                Obrigado!
              </p>
            </div>
          )}
        </div>

        {/* Stats compactas */}
        <div className="flex justify-center gap-4 mt-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-300">100%</div>
            <div className="text-xs text-purple-200">BR</div>
          </div>
          <div className="w-px h-8 bg-purple-400/50"></div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-300">2024</div>
            <div className="text-xs text-purple-200">Fundado</div>
          </div>
          <div className="w-px h-8 bg-purple-400/50"></div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-300">Nacional</div>
            <div className="text-xs text-purple-200">Foco</div>
          </div>
        </div>
      </div>
    </div>
  );
}
