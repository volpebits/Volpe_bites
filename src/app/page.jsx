import FloatingCreatorsCarousel from "./components/creators";
import NoticiasHome from "./components/news_home";
import GamesHome from "./components/games_home";
import { EventCalendar } from "./components/events";
import { TipCard } from "./components/tipcard";
import { TopGamesCard } from "./components/topgames";
export const metadata = { title: "Home" };
export default function Home() {
  return (
    <div className="content">
      {" "}
      <div className="bg-gradient-to-br py-6 space-y-12 from-white via-purple-400 to-purple-950 dark:bg-gradient-to-br dark:from-black dark:via-purple-700 dark:to-purple-950 w-full">
        {" "}
        {/* --- BLOCO DE NOTÍCIAS + SIDEBAR --- */}{" "}
        <div className="content w-11/12 md:w-10/12 lg:w-8/12 mx-auto">
          {" "}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {" "}
            {/* Sidebar - sobe para o topo no mobile */}{" "}
            <aside className="space-y-6 order-1 lg:order-none lg:col-span-1">
              {" "}
              <EventCalendar /> <TipCard />{" "}
            </aside>{" "}
            {/* Conteúdo principal */}{" "}
            <section className="text-center space-y-6 lg:col-span-3">
              {" "}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-500">
                {" "}
                Notícias mais recentes{" "}
              </h2>{" "}
              <p className="text-lg md:text-2xl lg:text-3xl font-bold text-white">
                {" "}
                Veja as principais atualizações sobre o mundo gamer.{" "}
              </p>{" "}
              <NoticiasHome />{" "}
              <div>
                {" "}
                <a
                  href="/news"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-110 hover:shadow-2xl hover:from-green-400 hover:via-green-500 hover:to-green-600 relative overflow-hidden group"
                >
                  {" "}
                  Ver todas as notícias{" "}
                </a>{" "}
              </div>{" "}
            </section>{" "}
          </div>{" "}
          {/* --- BLOCO DE JOGOS --- */}{" "}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mt-12 items-center">
            {" "}
            {/* Conteúdo principal */}{" "}
            <section className="lg:col-span-3 space-y-6">
              {" "}
              <div className="text-center">
                {" "}
                <h2 className="pb-3 text-3xl md:text-4xl lg:text-5xl font-bold text-green-500">
                  {" "}
                  Jogos nacionais{" "}
                </h2>{" "}
                <p className="text-lg md:text-2xl lg:text-3xl font-bold text-white">
                  {" "}
                  Tenha acesso aos principais jogos desenvolvidos no Brasil!{" "}
                </p>{" "}
              </div>{" "}
              <GamesHome />{" "}
              <div className="flex justify-center">
                {" "}
                <a
                  href="/games"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-110 hover:shadow-2xl hover:from-green-400 hover:via-green-500 hover:to-green-600 relative overflow-hidden group"
                >
                  {" "}
                  Ver todos os jogos{" "}
                </a>{" "}
              </div>{" "}
            </section>{" "}
            {/* Sidebar ao lado dos jogos */}{" "}
            <aside className="space-y-6">
              {" "}
              <TopGamesCard />{" "}
            </aside>{" "}
          </div>{" "}
        </div>{" "}
        {/* --- BLOCO DE CRIADORES --- */}{" "}
        <div className="space-y-6 mt-12">
          {" "}
          <div className="text-center">
            {" "}
            <h2 className="pb-3 text-3xl md:text-4xl lg:text-5xl font-bold text-green-500">
              {" "}
              Por trás dos Controles{" "}
            </h2>{" "}
            <p className="text-lg md:text-2xl lg:text-3xl font-bold text-white">
              {" "}
              As mentes brilhantes que estão redefinindo o que significa criar
              jogos no Brasil.{" "}
            </p>{" "}
          </div>{" "}
          <FloatingCreatorsCarousel />{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
