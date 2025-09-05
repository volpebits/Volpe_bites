"use client";
import { useState, useEffect } from "react";

export function AboutProjectCard() {
  const [rating, setRating] = useState(0);
  const [saved, setSaved] = useState(false);

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

  return (
    <div className="bg-purple-900/50 backdrop-blur-lg border border-purple-700 rounded-2xl shadow-xl p-8 text-white text-center">
      <h3 className="text-3xl font-bold mb-4">🚀 Sobre o Projeto Volpe</h3>
      <p className="text-lg max-w-3xl mx-auto mb-6">
        O <span className="font-bold text-green-400">Volpe</span> é uma
        plataforma dedicada a destacar jogos brasileiros, criadores de conteúdo
        e notícias do cenário gamer nacional. Nosso objetivo é fortalecer a
        indústria e conectar apaixonados por games em um só lugar.
      </p>

      {/* Sistema de avaliação */}
      <div className="mt-6">
        <h4 className="text-xl font-semibold mb-3">
          O que você está achando da plataforma?
        </h4>

        {/* Estrelas */}
        <div className="flex justify-center gap-3 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => {
                setRating(star);
                setSaved(false);
              }}
              className={`text-4xl transition transform hover:scale-125 ${
                star <= rating ? "text-yellow-400" : "text-gray-500"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          {/* Salvar avaliação */}
          <button
            onClick={handleSave}
            disabled={rating === 0}
            className={`px-6 py-3 font-bold rounded-xl shadow-md transition active:scale-95
              ${
                rating === 0
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
          >
            {saved ? "✅ Avaliação Salva!" : "💾 Salvar Avaliação"}
          </button>

          {/* Ir para página de feedback */}
          <a
            href="/avalienos"
            className="px-6 py-3 bg-white text-purple-700 font-bold rounded-xl shadow-md hover:bg-gray-100 transition active:scale-95"
          >
            ✍️ Avalie-nos Detalhadamente
          </a>
        </div>

        {/* Mensagem de confirmação */}
        {saved && (
          <p className="mt-3 text-sm text-green-300">
            Obrigado pelo seu feedback! 💜
          </p>
        )}
      </div>
    </div>
  );
}
