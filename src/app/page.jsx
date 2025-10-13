import FloatingCreatorsCarousel from "./components/creators";
import NoticiasHome from "./components/news_home";
import GamesHome from "./components/games_home";
import { EventCalendar } from "./components/events";
import { TipCard } from "./components/tipcard";
import { TopGamesCard } from "./components/topgames";
import { CommunityCard } from "./components/CommunityCard";
import { AboutProjectCard } from "./components/aboutProjectCard";
import { TopUsersCard } from "./components/userRanking";

export const metadata = { title: "Home" };

export default function Home() {
  return (
    <div className="content">
      <div className="bg-gradient-to-br pt-6 space-y-12 bg-white dark:bg-gradient-to-br dark:from-black dark:via-purple-700 dark:to-purple-950 w-full">
        {/* --- BLOCO DE NOTÍCIAS + SIDEBAR --- */}
        <div className="content w-11/12 md:w-10/12 lg:w-8/12 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Sidebar - sobe para o topo no mobile */}
            <aside className="space-y-6 order-1 lg:order-none lg:col-span-1">
              <EventCalendar />
              <TipCard />
            </aside>

            {/* Conteúdo principal */}
            <section className="text-center flex flex-col justify-between lg:col-span-3">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-800 dark:text-green-500">
                  Notícias mais recentes
                </h2>
                <p className="text-lg md:text-2xl lg:text-3xl font-bold text-black dark:text-white">
                  Veja as principais atualizações sobre o mundo gamer.
                </p>
              </div>
              <NoticiasHome />
              <div className="flex justify-center">
                <a
                  href="/news"
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-md transition active:scale-95"
                >
                  Ver todas as notícias
                </a>
              </div>
            </section>
          </div>

          {/* --- CARD EXTRA ENTRE AS SEÇÕES --- */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-4">
            <CommunityCard />
            <TopUsersCard />
          </div>

          {/* --- BLOCO DE JOGOS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mt-12 items-center">
            {/* Conteúdo principal */}
            <section className="lg:col-span-3 space-y-6">
              <div className="text-center">
                <h2 className="pb-3 text-3xl md:text-4xl lg:text-5xl font-bold text-purple-800 dark:text-green-500">
                  Jogos nacionais
                </h2>
                <p className="text-lg md:text-2xl lg:text-3xl font-bold text-black dark:text-white">
                  Tenha acesso aos principais jogos desenvolvidos no Brasil!
                </p>
              </div>
              <GamesHome />
              <div className="flex justify-center">
                <a
                  href="/games"
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-md transition active:scale-95"
                >
                  Ver todos os jogos
                </a>
              </div>
            </section>

            {/* Sidebar ao lado dos jogos */}
            <aside className="space-y-6">
              <TopGamesCard />
            </aside>
          </div>
        </div>

        {/* --- CARD SOBRE O PROJETO + AVALIAÇÃO --- */}
        <div className="w-8/12 mx-auto">
          <AboutProjectCard />
        </div>

        {/* --- BLOCO DE CRIADORES --- */}
        <div className="space-y-6 mt-12">
          <div className="text-center">
            <h2 className="pb-3 text-3xl md:text-4xl lg:text-5xl font-bold text-purple-800 dark:text-green-500">
              Por trás dos Controles
            </h2>
            <p className="text-lg md:text-2xl lg:text-3xl font-bold text-black dark:text-white">
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
