'use client';

import { useEffect, useMemo, useState } from 'react';

const LS_KEY = 'avalienos_reviews_v1';

// Avaliações fictícias (semeadas uma única vez)
const SEED_REVIEWS = [
  {
    id: 'seed-1',
    name: 'Camila R.',
    rating: 5,
    comment: 'Atendimento excelente e rápido. Recomendo!',
    createdAt: '2025-07-12T15:10:00.000Z',
  },
  {
    id: 'seed-2',
    name: 'João P.',
    rating: 4,
    comment: 'Gostei bastante, só poderia ter mais opções no menu.',
    createdAt: '2025-06-03T18:45:00.000Z',
  },
  {
    id: 'seed-3',
    name: 'Bárbara M.',
    rating: 5,
    comment: 'Experiência impecável do início ao fim.',
    createdAt: '2025-05-22T12:00:00.000Z',
  },
  {
    id: 'seed-4',
    name: 'Rafael T.',
    rating: 3,
    comment: 'Cumpre o que promete, mas há margem para melhorar.',
    createdAt: '2025-04-10T09:30:00.000Z',
  },
];

function Star({ filled, onClick, onMouseEnter, onMouseLeave, size = 28, title }) {
  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="focus:outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={`transition-transform ${onClick ? 'hover:scale-110 active:scale-95' : ''}`}
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        class="text-yellow-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.75.75 0 0 1 1.04 0l2.59 2.59a.75.75 0 0 0 .423.21l3.61.523a.75.75 0 0 1 .416 1.279l-2.61 2.546a.75.75 0 0 0-.216.664l.616 3.593a.75.75 0 0 1-1.088.791l-3.227-1.697a.75.75 0 0 0-.698 0l-3.227 1.697a.75.75 0 0 1-1.088-.79l.616-3.594a.75.75 0 0 0-.216-.663L4.44 8.601a.75.75 0 0 1 .416-1.28l3.61-.522a.75.75 0 0 0 .423-.21l2.59-2.59Z"
        />
      </svg>
    </button>
  );
}

function StarRatingInput({ value, onChange, size = 28 }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
        <Star
          key={n}
          filled={(hovered ?? value) >= n}
          size={size}
          title={`${n} estrela${n > 1 ? 's' : ''}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(null)}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">{(hovered ?? value)}/5</span>
    </div>
  );
}

function StarRow({ rating }) {
  return (
    <div className="inline-flex items-center">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
        <Star key={n} filled={rating >= n} size={18} />
      ))}
    </div>
  );
}

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

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
      alert('Informe seu nome 🙂');
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
    setName('');
    setComment('');
    setRating(5);
  }

  function clearAll() {
    if (confirm('Tem certeza que deseja apagar todas as avaliações salvas neste navegador?')) {
      setReviews(SEED_REVIEWS);
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(SEED_REVIEWS));
      } catch {}
    }
  }

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
    <main className="mx-auto max-w-3xl px-4 py-10">
      <section className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Avalie-nos</h1>
        <p className="mt-1 text-gray-600">
          Sua opinião nos ajuda a melhorar. Deixe sua nota e um comentário (opcional).
        </p>
      </section>

      <section className="mb-10 grid gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-4xl font-semibold leading-none">{avg.toFixed(1)}</div>
            <div className="mt-1">
              <StarRow rating={Math.round(avg)} />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Média baseada em {reviews.length} avaliação{reviews.length !== 1 ? 'es' : ''}.
            </p>
          </div>
          <button
            onClick={clearAll}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 active:scale-[0.98]"
          >
            Restaurar avaliações fictícias
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Sua nota</span>
            <StarRatingInput value={rating} onChange={setRating} />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Nome</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como podemos te chamar?"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none ring-0 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-gray-900/20"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Comentário (opcional)</span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Conte um pouco sobre sua experiência…"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none ring-0 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-gray-900/20"
            />
          </label>

          <div className="flex items-center justify-end gap-3">
            <button
              type="reset"
              onClick={() => {
                setName('');
                setComment('');
                setRating(5);
              }}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 active:scale-[0.98]"
            >
              Limpar
            </button>
            <button
              type="submit"
              className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white hover:bg-black/90 active:scale-[0.98]"
            >
              Enviar avaliação
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Avaliações recentes</h2>
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium">{r.name}</span>
                    <span className="text-xs text-gray-500">{formatDate(r.createdAt)}</span>
                  </div>
                  <div className="mt-1">
                    <StarRow rating={r.rating} />
                  </div>
                </div>
              </div>
              {r.comment ? <p className="mt-3 whitespace-pre-wrap text-gray-700">{r.comment}</p> : null}
            </li>
          ))}
        </ul>
        {reviews.length === 0 && <p className="text-gray-500">Nenhuma avaliação por aqui ainda.</p>}
      </section>
    </main>
  );
}
