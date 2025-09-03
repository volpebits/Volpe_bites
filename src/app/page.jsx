import Image from "next/image";
import Carousel from "./components/carousel";
import FloatingCreatorsCarousel from "./components/creators";
import NoticiasHome from "./components/news_home";
import GamesHome from "./components/games_home";
export const metadata = {
  title: "Home",
};

export default function Home() {
  const carouselImages = [
    "/images/MARS 2120.webp",
    "/images/minoria.webp",
    "/images/hazel.webp",
  ];

  return (
    <div className="content">
      <div className="bg-gradient-to-br py-6 space-y-6 from-white via-purple-400 to-purple-950 dark:bg-gradient-to-br dark:from-black dark:via-purple-700 dark:to-purple-950 w-full">
        <div className="content mx-auto space-y-6 text-center">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="pb-3 text-3xl md:text-4xl lg:text-5xl font-bold text-green-500">
                Noticias mais recentes
              </h2>
              <p className="text-lg md:text-2xl lg:text-3xl font-bold text-white">
                Veja as principais atualizações sobre o mundo gamer.
              </p>
            </div>
            <NoticiasHome />
            <div className="">
              <a
                href="/news"
                className="px-6 py-3 bg-gradient-to-r from-green-500 via-green-600 to-green-700 
               text-white font-bold rounded-xl shadow-lg transition 
               transform hover:scale-110 hover:shadow-2xl 
               hover:from-green-400 hover:via-green-500 hover:to-green-600
               relative overflow-hidden group"
              >
                Ver todas as noticias
              </a>
            </div>
          </div>
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="pb-3 text-3xl md:text-4xl lg:text-5xl font-bold text-green-500">
                Jogos mais famosos
              </h2>
              <p className="text-lg md:text-2xl lg:text-3xl font-bold text-white">
                Tenha acesso aos principais jogos desenvolvidos no Brasil!
              </p>
            </div>
            <GamesHome />
            <div className="">
              <a
                href="/games"
                className="px-6 py-3 bg-gradient-to-r from-green-500 via-green-600 to-green-700 
               text-white font-bold rounded-xl shadow-lg transition 
               transform hover:scale-110 hover:shadow-2xl 
               hover:from-green-400 hover:via-green-500 hover:to-green-600
               relative overflow-hidden group"
              >
                Ver todos os jogos
              </a>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="pb-3 text-3xl md:text-4xl lg:text-5xl font-bold text-green-500">
              Por trás dos Controles
            </h2>
            <p className="text-lg md:text-2xl lg:text-3xl font-bold text-white">
              As mentes brilhantes que estão redefinindo o que significa criar
              jogos no Brasil.
            </p>
          </div>
          <FloatingCreatorsCarousel />
        </div>
      </div>
    </div>
  );
}
