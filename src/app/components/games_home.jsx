"use client";
import Link from "next/link";
import gamesData from "@/data/games";
import { FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

export default function GamesHome() {
  // Dados processados
  const jogos = gamesData.sort((a, b) => b.rating - a.rating).slice(0, 5);

  return (
    <div className="">
      <div className="container mx-auto">
        {/* SEÇÃO 1: Carrossel das Mais Avaliadas */}
        <section className="">
          <div className="relative">
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
              className="cards-equal-height" // Classe personalizada
            >
              {jogos.map((games) => (
                <SwiperSlide key={games.id} className="h-auto flex">
                  {/* Adicionado: h-auto flex */}
                  <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer flex flex-col w-full">
                    {/* Adicionado: flex flex-col w-full */}
                    <img
                      src={games.image}
                      alt={games.title}
                      className="w-full h-56 object-cover flex-shrink-0"
                      // Adicionado: flex-shrink-0
                    />
                    <div className="p-4 flex flex-col justify-between flex-grow">
                      {/* Adicionado: flex-grow */}
                      <div className="flex-grow">
                        {/* Adicionado: flex-grow */}
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                          {games.title}
                        </h3>
                        <p className="text-sm text-black dark:text-white font-medium line-clamp-3">
                          {/* Adicionado: line-clamp-3 */}
                          {games.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* CSS personalizado para garantir altura igual */}
            <style jsx>{`
              .cards-equal-height .swiper-wrapper {
                align-items: stretch;
              }
              .cards-equal-height .swiper-slide {
                height: auto;
              }
            `}</style>

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
