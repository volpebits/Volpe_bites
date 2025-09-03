"use client";

import Link from "next/link";
import noticias from "@/data/news";
import { FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

export default function NoticiasHome() {
  // Dados processados
  const maisAvaliadas = noticias;

  return (
    <div className="">
      <div className="container mx-auto">
        {/* SEÇÃO 1: Carrossel das Mais Avaliadas */}
        <section className="">
          <div className="relative ">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={20}
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
                  <Link href={`/news/${noticia.id}`} className="block">
                    <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer">
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
                          <p className="text-sm text-black dark:text-white font-medium line-clamp-3">
                            {/* Adicionado: line-clamp-3 */}
                            {noticia.texto}
                          </p>
                        </div>
                        <p className="text-md text-center text-black dark:text-white font-medium">
                          Ler mais
                        </p>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Botões de navegação customizados */}
            <div className="swiper-button-prev-mais-avaliadas absolute z-10 top-1/2 -left-2 md:-left-14 -translate-y-1/2 cursor-pointer p-2 md:p-3 rounded-full hover:bg-black/70 transition-colors flex items-center justify-center text-white text-lg">
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
            <div className="swiper-button-next-mais-avaliadas absolute z-10 top-1/2 -right-2 md:-right-14 -translate-y-1/2 cursor-pointer p-2 md:p-3 rounded-full hover:bg-black/70 transition-colors flex items-center justify-center text-white text-lg">
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
        </section>
      </div>
    </div>
  );
}
