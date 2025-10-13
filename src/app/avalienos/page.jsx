"use client";

import { useEffect, useMemo, useState } from "react";

const LS_KEY = "avalienos_reviews_v1";
const REVIEWS_PER_CLICK = 5; // Define quantas avaliações carregar por vez

// Avaliações fictícias (semeadas uma única vez)
const SEED_REVIEWS = [
  // Avaliações existentes
  {
    id: "seed-1",
    name: "Camila R.",
    rating: 5,
    comment: "Atendimento excelente e rápido. Recomendo!",
    createdAt: "2025-07-12T15:10:00.000Z",
  },
  {
    id: "seed-2",
    name: "João P.",
    rating: 4,
    comment: "Gostei bastante, só poderia ter mais opções no menu.",
    createdAt: "2025-06-03T18:45:00.000Z",
  },
  {
    id: "seed-3",
    name: "Bárbara M.",
    rating: 5,
    comment: "Experiência impecável do início ao fim.",
    createdAt: "2025-05-22T12:00:00.000Z",
  },
  {
    id: "seed-4",
    name: "Rafael T.",
    rating: 3,
    comment: "Cumpre o que promete, mas há margem para melhorar.",
    createdAt: "2025-04-10T09:30:00.000Z",
  },
  {
    id: "seed-5",
    name: "Fernanda D.",
    rating: 5,
    comment: "O design do site é lindo e muito intuitivo!",
    createdAt: "2025-08-20T10:00:00.000Z",
  },
  {
    id: "seed-6",
    name: "Gustavo S.",
    rating: 4,
    comment: "O carregamento poderia ser mais rápido, mas o conteúdo é ótimo.",
    createdAt: "2025-08-18T14:20:00.000Z",
  },
  {
    id: "seed-7",
    name: "Ana L.",
    rating: 5,
    comment: "Adorei as recomendações, todas as avaliações são muito úteis.",
    createdAt: "2025-08-15T16:55:00.000Z",
  },
  {
    id: "seed-8",
    name: "Carlos F.",
    rating: 2,
    comment: "Algumas funcionalidades não estão funcionando no celular.",
    createdAt: "2025-08-14T09:10:00.000Z",
  },
  {
    id: "seed-9",
    name: "Letícia P.",
    rating: 5,
    comment: "Fiquei impressionada com a qualidade das informações!",
    createdAt: "2025-08-12T11:40:00.000Z",
  },
  {
    id: "seed-10",
    name: "Pedro M.",
    rating: 4,
    comment:
      "Ótimo site para pesquisar, mas a navegação entre as páginas pode ser confusa.",
    createdAt: "2025-08-11T19:00:00.000Z",
  },
  {
    id: "seed-11",
    name: "Mariana G.",
    rating: 5,
    comment: "Não tive nenhum problema. Experiência 10/10.",
    createdAt: "2025-08-10T08:30:00.000Z",
  },
  {
    id: "seed-12",
    name: "Lucas B.",
    rating: 3,
    comment: "A interface é boa, mas o site travou algumas vezes.",
    createdAt: "2025-08-08T13:25:00.000Z",
  },
  {
    id: "seed-13",
    name: "Sofia A.",
    rating: 5,
    comment: "Exatamente o que eu estava procurando. Muito útil!",
    createdAt: "2025-08-05T17:40:00.000Z",
  },
  {
    id: "seed-14",
    name: "Diego C.",
    rating: 4,
    comment:
      "O site é muito completo, só senti falta de uma seção de perguntas frequentes.",
    createdAt: "2025-08-04T10:50:00.000Z",
  },
  {
    id: "seed-15",
    name: "Renata L.",
    rating: 5,
    comment: "Adorei o design e a facilidade de uso.",
    createdAt: "2025-08-03T14:15:00.000Z",
  },
  {
    id: "seed-16",
    name: "Bruno G.",
    rating: 2,
    comment: "O suporte demorou a responder, o que foi um ponto negativo.",
    createdAt: "2025-08-02T16:00:00.000Z",
  },
  {
    id: "seed-17",
    name: "Natália P.",
    rating: 5,
    comment: "Simples e eficiente. Perfeito.",
    createdAt: "2025-07-31T11:20:00.000Z",
  },
  {
    id: "seed-18",
    name: "Eduardo F.",
    rating: 4,
    comment: "Fácil de usar, mas os anúncios são um pouco intrusivos.",
    createdAt: "2025-07-29T19:30:00.000Z",
  },
  {
    id: "seed-19",
    name: "Juliana C.",
    rating: 5,
    comment: "Interface intuitiva e limpa, adorei.",
    createdAt: "2025-07-28T09:45:00.000Z",
  },
  {
    id: "seed-20",
    name: "Felipe V.",
    rating: 3,
    comment: "As informações são boas, mas a busca poderia ser mais precisa.",
    createdAt: "2025-07-26T15:00:00.000Z",
  },
  {
    id: "seed-21",
    name: "Gabriela S.",
    rating: 5,
    comment: "Melhor site da categoria, sem dúvidas!",
    createdAt: "2025-07-24T12:00:00.000Z",
  },
  {
    id: "seed-22",
    name: "Henrique L.",
    rating: 4,
    comment: "Poderia ter mais conteúdos aprofundados.",
    createdAt: "2025-07-23T18:10:00.000Z",
  },
  {
    id: "seed-23",
    name: "Clara A.",
    rating: 5,
    comment: "Fantástico! Navegação super fluida.",
    createdAt: "2025-07-22T10:30:00.000Z",
  },
  {
    id: "seed-24",
    name: "Thiago B.",
    rating: 3,
    comment: "O site é bom, mas a experiência mobile precisa de ajustes.",
    createdAt: "2025-07-20T14:45:00.000Z",
  },
  {
    id: "seed-25",
    name: "Beatriz F.",
    rating: 5,
    comment: "Amei a simplicidade e a eficiência.",
    createdAt: "2025-07-19T11:00:00.000Z",
  },
  {
    id: "seed-26",
    name: "André P.",
    rating: 4,
    comment: "Ótimo começo, mas há espaço para mais funcionalidades.",
    createdAt: "2025-07-18T15:50:00.000Z",
  },
  {
    id: "seed-27",
    name: "Larissa R.",
    rating: 5,
    comment: "O melhor site que já usei na categoria. Parabéns!",
    createdAt: "2025-07-17T09:20:00.000Z",
  },
  {
    id: "seed-28",
    name: "Rodrigo M.",
    rating: 3,
    comment: "Achei o layout um pouco confuso no início.",
    createdAt: "2025-07-16T13:00:00.000Z",
  },
  {
    id: "seed-29",
    name: "Isabela C.",
    rating: 5,
    comment: "Tudo funciona perfeitamente. Adorei!",
    createdAt: "2025-07-15T18:40:00.000Z",
  },
  {
    id: "seed-30",
    name: "Vinicius G.",
    rating: 4,
    comment: "Muito útil, só gostaria de ver mais categorias de conteúdo.",
    createdAt: "2025-07-14T08:00:00.000Z",
  },
  {
    id: "seed-31",
    name: "Amanda B.",
    rating: 5,
    comment: "O site é super rápido e fácil de navegar.",
    createdAt: "2025-07-13T10:25:00.000Z",
  },
  {
    id: "seed-32",
    name: "Lucas T.",
    rating: 4,
    comment:
      "O design é moderno, mas algumas páginas levam tempo para carregar.",
    createdAt: "2025-07-11T14:50:00.000Z",
  },
  {
    id: "seed-33",
    name: "Vanessa P.",
    rating: 5,
    comment: "Tive uma experiência fantástica. Recomendo a todos.",
    createdAt: "2025-07-10T17:15:00.000Z",
  },
  {
    id: "seed-34",
    name: "Leonardo S.",
    rating: 3,
    comment: "Achei o site funcional, mas o visual poderia ser mais vibrante.",
    createdAt: "2025-07-09T11:30:00.000Z",
  },
  {
    id: "seed-35",
    name: "Mariana P.",
    rating: 5,
    comment: "O site é perfeito para o que eu preciso.",
    createdAt: "2025-07-08T15:40:00.000Z",
  },
  {
    id: "seed-36",
    name: "José C.",
    rating: 4,
    comment: "Ótima usabilidade, só falta um chat de suporte em tempo real.",
    createdAt: "2025-07-07T19:00:00.000Z",
  },
  {
    id: "seed-37",
    name: "Aline R.",
    rating: 5,
    comment: "Não tenho do que reclamar. Tudo funcionou perfeitamente!",
    createdAt: "2025-07-06T09:55:00.000Z",
  },
  {
    id: "seed-38",
    name: "Rafaela B.",
    rating: 3,
    comment: "O site atende, mas a falta de conteúdo novo é perceptível.",
    createdAt: "2025-07-05T13:20:00.000Z",
  },
];

// Componente de estrelas padronizado
function StarRatingInput({ value, onChange, size = 28 }) {
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
          className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
          style={{ fontSize: `${size}px` }}
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
      <span className="ml-2 text-sm text-gray-600">{hovered ?? value}/5</span>
    </div>
  );
}

function StarRow({ rating }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <span key={i} className="text-yellow-400 text-lg">
          ⭐
        </span>
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <span key={i} className="text-yellow-400 text-lg">
          ⭐
        </span>
      );
    } else {
      stars.push(
        <span key={i} className="text-gray-400 text-lg">
          ☆
        </span>
      );
    }
  }
  return <div className="inline-flex items-center gap-0.5">{stars}</div>;
}

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [visibleReviews, setVisibleReviews] = useState(REVIEWS_PER_CLICK); // 1. Estado para controlar a quantidade

  // montar & carregar do localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) {
        localStorage.setItem(LS_KEY, JSON.stringify(SEED_REVIEWS));
        setReviews(SEED_REVIEWS);
      } else {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setReviews(parsed);
        } else {
          localStorage.setItem(LS_KEY, JSON.stringify(SEED_REVIEWS));
          setReviews(SEED_REVIEWS);
        }
      }
    } catch {
      setReviews(SEED_REVIEWS);
    }
  }, []);

  // salvar em localStorage quando reviews mudar
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(reviews));
    } catch {}
  }, [reviews, mounted]);

  const avg = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10; // 1 casa
  }, [reviews]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      alert("Informe seu nome 🙂");
      return;
    }
    const newReview = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      rating,
      comment: comment.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    setReviews((curr) => [newReview, ...curr]); // adiciona no topo
    setName("");
    setComment("");
    setRating(5);
  }

  function clearAll() {
    if (
      confirm(
        "Tem certeza que deseja apagar todas as avaliações salvas neste navegador?"
      )
    ) {
      setReviews(SEED_REVIEWS);
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(SEED_REVIEWS));
      } catch {}
    }
  }

  // 2. Função para carregar mais avaliações
  const handleShowMore = () => {
    setVisibleReviews((prevCount) => prevCount + REVIEWS_PER_CLICK);
  };

  const reviewsToDisplay = reviews.slice(0, visibleReviews); // 3. Apenas as avaliações visíveis

  if (!mounted) {
    // evita hydration mismatch
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/2 rounded bg-gray-200" />
          <div className="h-6 w-1/3 rounded bg-gray-200" />
          <div className="h-24 w-full rounded bg-gray-200" />
        </div>
      </main>
    );
  }

  return (
    <div className="bg-gradient-to-br dark:bg-gradient-to-br dark:from-black dark:via-purple-700 dark:to-purple-950 w-full">
      <main className="mx-auto max-w-3xl px-4 py-10">
        <section className="mb-8">
          <h1 className="text-3xl pb-4 md:text-4xl lg:text-5xl font-bold text-purple-800 dark:text-green-500">
            Avalie-nos
          </h1>
          <p className="mt-1 font-bold text-black dark:text-white">
            Sua opinião nos ajuda a melhorar. <br /> Deixe sua nota e um
            comentário (opcional).
          </p>
        </section>

        <section className="mb-10 grid gap-6 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-800/10 dark:bg-white p-6 shadow-sm">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-4xl font-semibold leading-none text-black">
                {avg.toFixed(1)}
              </div>
              <div className="mt-1 ">
                <StarRow rating={Math.round(avg)} />
              </div>
              <p className="mt-1 text-sm font-medium text-gray-700">
                Média baseada em {reviews.length} avaliação
                {reviews.length !== 1 ? "es" : ""}.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-black">Sua nota</span>
              <StarRatingInput value={rating} onChange={setRating} />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-black">Nome</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como podemos te chamar?"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-black outline-none ring-0 placeholder:text-gray-400 placeholder:font-medium focus:border-transparent focus:ring-2 focus:ring-gray-900/20"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-black">
                Comentário (opcional)
              </span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Conte um pouco sobre sua experiência…"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-black outline-none ring-0 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-gray-900/20"
              />
            </label>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleSubmit}
                className="rounded-md px-5 py-2 text-sm font-medium text-white bg-green-500 active:scale-[0.98]"
              >
                Enviar avaliação
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">Avaliações recentes</h2>
          <ul className="space-y-4">
            {reviewsToDisplay.map(
              (
                r // 3. Usa o array com as avaliações visíveis
              ) => (
                <li
                  key={r.id}
                  className="rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-800/10 dark:bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-black">
                        <span className="truncate font-medium">{r.name}</span>
                        <span className="text-xs text-gray-500 font-normal">
                          {formatDate(r.createdAt)}
                        </span>
                      </div>
                      <div className="mt-1">
                        <StarRow rating={r.rating} />
                      </div>
                    </div>
                  </div>
                  {r.comment ? (
                    <p className="mt-3 whitespace-pre-wrap text-gray-700">
                      {r.comment}
                    </p>
                  ) : null}
                </li>
              )
            )}
          </ul>
          {/* 4. Condição para exibir o botão */}
          {reviewsToDisplay.length < reviews.length && (
            <div className="text-center mt-8">
              <button
                onClick={handleShowMore}
                className="rounded-md px-5 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 transition-colors"
              >
                Mostrar mais ({reviews.length - reviewsToDisplay.length})
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
