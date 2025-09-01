'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Autoplay, Navigation } from 'swiper/modules'

export default function Carousel() {
  const slides = [
    {
      img: '/images-news/nitendo.webp',
      texto: 'Nintendo segue marcando presença entre os brasileiros'
    },
    {
      img: '/images-news/female-playing.webp',
      texto: 'Mulheres estão cada vez mais presentes no universo gamer'
    },
    {
      img: '/images-news/universo-gamer.webp',
      texto: 'O Brasil mergulha de cabeça no universo dos games'
    }
  ]

  return (
    <div className="w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-lg mt-8 mb-10 relative">
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[400px]">
              <img
                src={slide.img}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <p className="text-white text-2xl font-semibold text-center px-6 drop-shadow-lg">
                  {slide.texto}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
        {/* Botões personalizados */}
        <div className="swiper-button-prev text-white text-3xl absolute top-1/2 left-4 -translate-y-1/2 z-10 cursor-pointer select-none">&#10094;</div>
        <div className="swiper-button-next text-white text-3xl absolute top-1/2 right-4 -translate-y-1/2 z-10 cursor-pointer select-none">&#10095;</div>
      </Swiper>
    </div>
  )
}
