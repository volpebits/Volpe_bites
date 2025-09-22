"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import noticias from "../../data/news.js";
import NEWS_COMMENTS from "../../data/new_comments.js";

// Componente de estrelas padronizado
const StarRow = ({ rating, size = 18 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <span
          key={i}
          className="text-yellow-400"
          style={{ fontSize: `${size}px` }}
        >
          ⭐
        </span>
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <span
          key={i}
          className="text-yellow-400"
          style={{ fontSize: `${size}px` }}
        >
          ⭐
        </span>
      );
    } else {
      stars.push(
        <span
          key={i}
          className="text-gray-400"
          style={{ fontSize: `${size}px` }}
        >
          ☆
        </span>
      );
    }
  }
  return <div className="inline-flex items-center gap-0.5">{stars}</div>;
};

// Input de avaliação com estrelas padronizadas
function StarRatingInput({ value, onChange }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(null)}
          className="focus:outline-none transition-transform hover:scale-110 active:scale-95 text-2xl"
        >
          <span
            className={
              (hovered ?? value) >= n ? "text-yellow-400" : "text-gray-400"
            }
          >
            {(hovered ?? value) >= n ? "⭐" : "☆"}
          </span>
        </button>
      ))}
    </div>
  );
}

// Funções para gerenciar o localStorage
const getReviewsFromStorage = (newsId) => {
  try {
    const key = `avalienos_reviews_${newsId}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Erro ao carregar avaliações do localStorage:", error);
    return [];
  }
};

const saveReviewsToStorage = (newsId, newReviews) => {
  try {
    const key = `avalienos_reviews_${newsId}`;
    localStorage.setItem(key, JSON.stringify(newReviews));
  } catch (error) {
    console.error("Erro ao salvar avaliações no localStorage:", error);
  }
};

export default function NewsDetailClient({ noticia }) {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const savedReviews = getReviewsFromStorage(noticia.id);
    const initialReviews =
      savedReviews.length > 0 ? savedReviews : NEWS_COMMENTS[noticia.id] || [];
    setReviews(initialReviews);
  }, [noticia.id]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return noticia.rating || 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews, noticia.rating]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Por favor, informe seu nome.");
      return;
    }

    const newReview = {
      id: Date.now(),
      name: name.trim(),
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    saveReviewsToStorage(noticia.id, updatedReviews);

    setName("");
    setComment("");
    setRating(5);
  };

  return (
    <main className="bg-gradient-to-br dark:bg-gradient-to-br dark:from-black dark:via-purple-700 dark:to-purple-950 text-black dark:text-white p-4">
      <div className="max-w-7xl mx-auto py-8">
        <Link
          href="/news"
          className="flex items-center gap-2 mb-6 text-purple-950 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <FaArrowLeft />
          <span>Voltar para as notícias</span>
        </Link>

        {/* Adicionamos 'items-start' aqui para que as colunas não se estiquem */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:items-start">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <img
              src={noticia.imagem}
              alt={noticia.titulo}
              className="w-full h-80 object-cover"
            />
            <div className="p-8">
              <h1 className="text-4xl font-extrabold mb-4 text-purple-950 dark:text-white leading-tight">
                {noticia.titulo}
              </h1>
              <div className="flex items-center gap-2 mb-6">
                <StarRow rating={parseFloat(averageRating)} size={20} />
                <span className="text-sm text-gray-500">
                  {averageRating} / 5 ({reviews.length} avaliações)
                </span>
              </div>
              {noticia.texto.split("\n").map((par, i, arr) => (
                <p
                  key={i}
                  className={`text-lg text-gray-700 dark:text-gray-300 leading-relaxed ${
                    i !== arr.length - 1 ? "mb-6" : "mb-0"
                  }`}
                >
                  {par}
                </p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-purple-950 dark:text-white">
                Deixe sua avaliação
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <label className="block">
                  <span className="text-sm font-medium text-black dark:text-white">
                    Sua nota
                  </span>
                  <div className="mt-2">
                    <StarRatingInput value={rating} onChange={setRating} />
                  </div>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-black dark:text-white">
                    Seu nome
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Como podemos te chamar?"
                    className="w-full p-3 mt-1 rounded-lg border border-gray-300 text-black focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-black dark:text-white">
                    Comentário
                  </span>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Conte um pouco sobre sua experiência..."
                    className="w-full p-3 mt-1 rounded-lg border border-gray-300 text-black"
                    rows="4"
                  />
                </label>
                <button
                  type="submit"
                  className="bg-green-600 text-white font-bold px-6 py-3 rounded-full hover:bg-green-700 transition-colors shadow-lg"
                >
                  Enviar Avaliação
                </button>
              </form>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-purple-950 dark:text-white">
                Comentários ({reviews.length})
              </h3>
              {reviews.length > 0 ? (
                <ul className="space-y-6">
                  {reviews.map((review) => (
                    <li
                      key={review.id}
                      className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-lg">{review.name}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        <StarRow rating={review.rating} size={18} />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {review.comment}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  Ninguém avaliou esta notícia ainda. Seja o primeiro!
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
