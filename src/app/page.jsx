import Image from 'next/image'
import Carousel from './components/carousel'
import FloatingCreatorsCarousel from './components/creators'

export const metadata = {
    title: 'Home',
}

export default function Home() {
    const carouselImages = [
        '/images/MARS 2120.webp',
        '/images/minoria.webp',
        '/images/hazel.webp',
    ]

    return (
        <div className="content">
            <div className="bg-gradient-to-br from-white via-purple-400 to-purple-950 dark:bg-gradient-to-br dark:from-black dark:via-purple-700 dark:to-purple-950 w-full">
                <div className="first_container flex flex-col md:flex-row items-center justify-center md:justify-start md:space-x-12 max-w-80 md:max-w-7xl mx-auto py-2">
                    <div className="text space-y-6 md:space-y-10">
                        <h1 className="text-7xl font-bold text-purple-950 dark:text-green-500">O Futuro dos jogos nacionais está aqui</h1>
                        <p className="text-3xl font-bold text-black dark:text-white">Explore, apoie e jogue os melhores games desenvolvidos no Brasil.</p>
                        <button className="bg-purple-950 dark:bg-green-500 dark:text-black rounded-xl transition-all duration-300 hover:scale-105 text-white px-3 py-2 text-lg font-bold">Saiba mais!</button>
                    </div>
                    <div className="image flex justify-center md:justify-start">
                        <Image
                            src="/images/imagehome.webp"
                            alt="Logo"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-full h-auto">
                        </Image>
                    </div>
                </div>
            </div>
            <div className="recomendation_img w-full">
                <div className="relative w-full aspect-video">
                    <Image
                        src="/images/HellClock2.png"
                        alt="Descrição"
                        fill
                        className="bg-white dark:bg-black"
                    />
                </div>
            </div>
            <div className="w-full bg-white dark:bg-black py-6 md:py-10 space-y-6 md:space-y-10">
                <div className="text max-w-7xl px-4 p-4 md:p-8 lg:p-10 mx-auto bg-purple-300 dark:bg-purple-950 rounded-2xl md:rounded-3xl space-y-3 md:space-y-5">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-purple-950 dark:text-green-500">Explore o Brasil Gamer</h2>
                    <p className="text-lg md:text-2xl lg:text-3xl font-bold text-black dark:text-white">Dos clássicos aclamados aos lançamentos promissores — descubra o poder criativo da cena gamer nacional.</p>
                </div>
                <div className="content px-4">
                    <div className="carousel max-w-7xl mx-auto overflow-hidden">
                        <Carousel
                            images={carouselImages}
                            autoPlay={true}
                            interval={4000}
                        />
                    </div>
                </div>
            </div>
            <div className="creator bg-purple-950">
                {/* criadores */}
                <FloatingCreatorsCarousel />
            </div>
        </div>
    )
}