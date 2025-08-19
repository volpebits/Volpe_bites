'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Carousel({ images, autoPlay = true, interval = 3000 }) {
    const [currentIndex, setCurrentIndex] = useState(0)

    // Auto-play
    useEffect(() => {
        if (!autoPlay) return
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length)
        }, interval)
        return () => clearInterval(timer)
    }, [images.length, autoPlay, interval])

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    return (
        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] overflow-hidden rounded-2xl group">
            {/* Imagens */}
            <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((src, index) => (
                    <div key={index} className="w-full h-full flex-shrink-0 relative">
                        <Image
                            src={src}
                            alt={`Slide ${index + 1}`}
                            fill
                            className="object-contain md:object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                        />
                    </div>
                ))}
            </div>

            {/* Setas - melhor visibilidade no mobile */}
            <button
                onClick={goToPrevious}
                className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 md:p-3 rounded-full opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 text-lg md:text-xl font-bold z-10"
                aria-label="Anterior"
            >
                ←
            </button>

            <button
                onClick={goToNext}
                className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 md:p-3 rounded-full opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 text-lg md:text-xl font-bold z-10"
                aria-label="Próximo"
            >
                →
            </button>

            {/* Pontos de navegação - maiores no mobile */}
            <div className="absolute bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-colors ${index === currentIndex
                                ? 'bg-white'
                                : 'bg-white/50 hover:bg-white/70'
                            }`}
                        aria-label={`Ir para slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}