"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import noticias from "@/data/news";
import { FaSearch } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  const maisAvaliadas = noticias
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const maisRecentes = noticias.slice(-5).reverse();

  const noticiasFiltradas = noticias.filter((noticia) =>
    noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const noticiasExibidas = noticiasFiltradas.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 8);
  };

  const hasMore = visibleCount < noticiasFiltradas.length;

  // Função para renderizar estrelas baseada no rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400 text-sm">
            ⭐
          </span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-400 text-sm">
            ⭐
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-400 text-sm">
            ☆
          </span>
        );
      }
    }
    return stars;
  };

  useEffect(() => {
    document.title = "Noticias";
  }, []);

  return (
    <main className="bg-white dark:bg-gradient-to-br dark:from-black dark:via-purple-500 dark:to-purple-950 text-white min-h-screen p-4">
      <div className="max-w-7xl mx-auto pt-8 space-y-8 ">
        <h2 className="text-3xl text-center md:text-4xl lg:text-5xl font-bold text-purple-800 dark:text-green-500">
          Notícias Mais Avaliadas
        </h2>
        <div className="relative mb-16 px-8 md:px-0">
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={2} // Reduzido o espaçamento entre os cards
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: ".swiper-button-next-mais-avaliadas",
              prevEl: ".swiper-button-prev-mais-avaliadas",
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className=""
          >
            {maisAvaliadas.map((noticia) => (
              <SwiperSlide key={noticia.id}>
                <Link href={`/news/${noticia.id}`} className="w-full block">
                  <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg border-2 border-purple-900 dark:border-0 mb-4 ml-4 mt-4 overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer">
                    <img
                      src={noticia.imagem}
                      alt={noticia.titulo}
                      className="w-full h-56 object-cover"
                    />
                    <div
                      className="p-4 flex flex-col justify-between"
                      style={{ minHeight: "140px" }}
                    >
                      <div>
                        <h3 className="text-xl font-semibold mb-2 h-14 line-clamp-2">
                          {noticia.titulo}
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex items-center gap-0.5">
                            {renderStars(noticia.rating)}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            ({noticia.rating.toFixed(1)})
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                        Ler mais
                      </p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Botões de navegação customizados */}
          <div className="swiper-button-prev-mais-avaliadas absolute z-10 top-1/2 -left-2 md:-left-6 -translate-y-1/2 cursor-pointer p-2 md:p-3 transition-colors flex items-center justify-center text-black dark:text-white text-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </div>
          <div className="swiper-button-next-mais-avaliadas absolute z-10 top-1/2 -right-2 md:-right-10 -translate-y-1/2 cursor-pointer p-2 md:p-3 transition-colors flex items-center justify-center text-black dark:text-white text-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl text-center md:text-4xl lg:text-5xl font-bold text-purple-800 dark:text-green-500">
          Todas as Notícias
        </h2>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-grow ">
            <div className="mb-10 w-full flex justify-center">
              <div className="relative w-full ">
                <input
                  type="text"
                  placeholder="Buscar por notícias..."
                  className="w-full p-4 pl-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600 transition-colors shadow-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {noticiasExibidas.map((noticia) => (
                <Link
                  key={noticia.id}
                  href={`/news/${noticia.id}`}
                  className="block"
                >
                  <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer">
                    <img
                      src={noticia.imagem}
                      alt={noticia.titulo}
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 h-12 line-clamp-2">
                        {noticia.titulo}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center gap-0.5">
                          {renderStars(noticia.rating)}
                        </div>
                      </div>
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                        Ler mais
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={handleShowMore}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors duration-300"
                >
                  Mostrar +
                </button>
              </div>
            )}
          </div>
          <aside className="lg:w-1/4 flex-shrink-0">
            <h2 className="text-3xl font-bold mb-6 text-purple-800 dark:text-green-500 lg:text-center">
              Recentes
            </h2>
            <div className="flex flex-col gap-6">
              {maisRecentes.map((noticia) => (
                <Link
                  key={noticia.id}
                  href={`/news/${noticia.id}`}
                  className="block"
                >
                  <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] cursor-pointer flex gap-4 p-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={noticia.imagem}
                        alt={noticia.titulo}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold line-clamp-2">
                        {noticia.titulo}
                      </h3>
                      <div className="flex items-center gap-1 mt-2">
                        <div className="flex items-center gap-0.5">
                          {renderStars(noticia.rating)}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          ({noticia.rating.toFixed(1)})
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
