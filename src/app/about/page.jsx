import Image from "next/image";

export const metadata = {
  title: "Sobre - Volpe Games",
};

export default function About() {
  const developers = [
    {
      name: "Giullia",
      age: 20,
      location: "São Paulo - SP",
      avatar: "/avatars/Giullia.png",
      role: "Frontend Developer",
      speciality: "Front-end developer",
    },
    {
      name: "Fabio",
      age: 24,
      location: "Juiz de Fora - MG",
      avatar: "/avatars/Fabio.png",
      role: "Full Stack Developer",
      speciality: "FullStack developer",
    },
    {
      name: "Isabella",
      age: 20,
      location: "Cajuru - SP",
      avatar: "/avatars/Isabela.png",
      role: "Frontend Developer",
      speciality: "React & Next.js",
    },
    {
      name: "Zilton",
      age: 18,
      location: "Montes Claros - MG",
      avatar: "/avatars/Zilton.png",
      role: "Game Developer",
      speciality: "Front-end developer",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br bg-white dark:bg-gradient-to-br dark:from-black dark:via-purple-700 dark:to-purple-950 px-4 py-10">
      {/* Partículas decorativas de fundo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div
          className="absolute top-1/3 right-16 w-24 h-24 bg-green-400/15 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute bottom-32 right-10 w-28 h-28 bg-indigo-400/15 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "6s" }}
        ></div>
      </div>

      <div className="max-w-screen-xl w-full mx-auto flex flex-col items-center space-y-12 text-center relative z-10">
        {/* Seção Hero Melhorada */}
        <div className="relative">
          {/* Efeito de brilho atrás do título */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/20 to-transparent blur-3xl"></div>

          <div className="relative">
            {/* Badge decorativo */}
            <div className="inline-flex items-center gap-2 bg-purple-900/30 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-400/20 mb-6">
              <span className="text-2xl animate-bounce">🚀</span>
              <span className="text-purple-200 font-semibold">
                Projeto Nacional
              </span>
              <span className="text-xl animate-pulse">✨</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-800 dark:text-green-500 bg-clip-text mb-4 leading-tight">
              Um projeto independente e nacional
            </h1>

            {/* Linha decorativa */}
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 via-green-400 to-purple-400 rounded-full mx-auto mb-8"></div>
          </div>
        </div>

        {/* Seção de Descrição Melhorada */}
        <div className="relative max-w-5xl">
          {/* Card de fundo com glassmorphism */}
          <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-3xl border border-white/20"></div>

          <div className="relative p-8 md:p-12">
            {/* Ícone decorativo */}
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="text-3xl">🎮</span>
              <div className="w-16 h-0.5 bg-gradient-to-r from-purple-400 to-transparent"></div>
              <span className="text-2xl">🇧🇷</span>
            </div>

            <p className="text-lg sm:text-xl md:text-2xl font-medium text-black dark:text-white text-justify leading-relaxed mb-8">
              Somos mais do que uma plataforma de jogos — somos um{" "}
              <span className="font-bold text-purple-600 dark:text-green-400">
                movimento
              </span>
              . Nosso projeto nasceu da paixão pelos games e do desejo de
              fortalecer a cena gamer nacional, oferecendo um palco exclusivo
              para jogos desenvolvidos por{" "}
              <span className="font-bold text-purple-600 dark:text-green-400">
                talentos brasileiros
              </span>
              .
              <br />
              <br />
              Acreditamos que o Brasil é um berço de{" "}
              <span className="font-bold text-purple-600 dark:text-green-400">
                criatividade
              </span>
              , onde cada jogo carrega não apenas códigos e gráficos, mas também
              histórias, culturas e sonhos. Aqui, criadores independentes ganham
              voz, e jogadores têm a oportunidade de explorar mundos inéditos,
              repletos de identidade e inovação.
              <br />
              <br />
              Queremos conectar quem cria com quem joga, construindo uma ponte
              sólida para um mercado nacional cada vez mais forte e reconhecido.
              A cada clique, a cada novo lançamento, estamos{" "}
              <span className="font-bold text-purple-600 dark:text-green-400">
                impulsionando o futuro dos games no Brasil
              </span>{" "}
              e você faz parte disso.
            </p>

            {/* Call to action destacado */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-green-500 rounded-2xl blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-r from-purple-700 to-green-600 text-white px-8 py-4 rounded-2xl font-black text-xl md:text-2xl">
                🏆 Jogue nacional. Apoie local. Cresça global. 🏆
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl font-bold text-purple-600 dark:text-green-400">
              100%
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Jogos Brasileiros
            </div>
          </div>
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl font-bold text-purple-600 dark:text-green-400">
              2024
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Fundado
            </div>
          </div>
          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl font-bold text-purple-600 dark:text-green-400">
              4
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Desenvolvedores
            </div>
          </div>
        </div>

        {/* Seção Desenvolvedores Melhorada */}
        <div className="w-full">
          {/* Título da seção */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="text-3xl animate-bounce">👨‍💻</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-950 via-purple-700 to-purple-950 dark:from-white dark:via-green-400 dark:to-green-500 bg-clip-text text-transparent">
                Nossa Equipe
              </h2>
              <span className="text-2xl animate-pulse">⚡</span>
            </div>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-green-400 rounded-full mx-auto"></div>
          </div>

          {/* Grid de desenvolvedores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {developers.map((dev, index) => (
              <div key={index} className="group relative">
                {/* Card de fundo */}
                <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-3xl border border-white/20 group-hover:border-purple-400/40 group-hover:bg-white/20 dark:group-hover:bg-black/30 transition-all duration-500"></div>

                {/* Partícula decorativa do card */}
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500"></div>

                <div className="relative p-6 text-center">
                  {/* Avatar com efeito melhorado */}
                  <div className="relative mb-4 mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-green-400 rounded-full animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-white dark:bg-gray-900 rounded-full p-1">
                      <Image
                        src={dev.avatar}
                        alt={dev.name}
                        width="80"
                        height="80"
                        className="rounded-full transition-all duration-300 group-hover:scale-110"
                      />
                    </div>

                    {/* Badge de especialidade */}
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {dev.speciality}
                    </div>
                  </div>

                  {/* Informações do desenvolvedor */}
                  <div className="space-y-2">
                    <h3 className="font-black text-xl text-purple-950 dark:text-green-400 group-hover:scale-105 transition-transform duration-300">
                      {dev.name}
                    </h3>
                    <p className="text-sm font-semibold text-purple-700 dark:text-green-300">
                      {dev.role}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {dev.age} anos
                    </p>
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <span>📍</span>
                      <span>{dev.location}</span>
                    </div>
                  </div>

                  {/* Indicador de interação */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-purple-400/30 dark:group-hover:border-green-400/30 transition-colors duration-300 pointer-events-none"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer da página */}
        <div className="mt-16 p-6 bg-white/5 dark:bg-black/20 backdrop-blur-sm rounded-2xl border border-white/20 max-w-2xl">
          <p className="text-gray-700 dark:text-gray-300 text-center">
            <span className="text-2xl mb-2 block">🤝</span>
            Quer fazer parte do nosso time ou tem uma ideia incrível?
            <br />
            <a
              href="https://www.instagram.com/volp.ebits/"
              className="text-purple-600 dark:text-green-400 font-semibold hover:underline"
            >
              Entre em contato conosco!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
