export function CommunityCard() {
  return (
    <div className="w-full flex justify-center items-center relative overflow-hidden bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700 rounded-3xl shadow-2xl p-8 text-white transform transition-all duration-500 hover:scale-[1.02] hover:shadow-purple-500/25 hover:shadow-2xl group">
      {/* Efeito de brilho/gloss */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60"></div>

      {/* Partículas decorativas */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-400/15 rounded-full blur-2xl group-hover:animate-pulse"></div>

      {/* Conteúdo principal */}
      <div className="relative z-10">
        {/* Título com gradiente */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-2">
            <span className="text-4xl animate-bounce">🎮</span>
            <div className="w-12 h-0.5 bg-gradient-to-r from-purple-300 to-transparent"></div>
            <span className="text-2xl">✨</span>
          </div>
          <h3 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent mb-2">
            Participe da Comunidade Volpe!
          </h3>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full mx-auto"></div>
        </div>

        {/* Descrição melhorada */}
        <p className="text-lg lg:text-xl text-purple-100 max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
          Conheça outros jogadores, compartilhe suas experiências e fique por
          dentro de{" "}
          <span className="text-yellow-300 font-semibold">
            tudo que acontece
          </span>{" "}
          no cenário de jogos brasileiros.
        </p>

        {/* Stats rápidas */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-300">500+</div>
            <div className="text-sm text-purple-200">Membros</div>
          </div>
          <div className="w-px h-12 bg-purple-400/50"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-300">24/7</div>
            <div className="text-sm text-purple-200">Ativo</div>
          </div>
          <div className="w-px h-12 bg-purple-400/50"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-300">BR</div>
            <div className="text-sm text-purple-200">Comunidade</div>
          </div>
        </div>

        {/* Botões redesenhados */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://discord.gg/DaH48GMWKV"
            className="group/btn relative px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center gap-2">
              <span className="text-xl">💬</span>
              <span>Entrar no Discord</span>
            </div>
          </a>

          <a
            href="/"
            className="group/btn relative px-8 py-4 bg-white text-purple-700 font-bold rounded-2xl shadow-lg hover:bg-gray-100 transition-all duration-300 active:scale-95"
          >
            <div className="relative flex items-center justify-center gap-2">
              <span className="text-xl">🚀</span>
              <span>Cadastrar-se</span>
            </div>
          </a>
        </div>

        {/* Badge de destaque */}
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg transform rotate-12">
          🔥 Novo!
        </div>
      </div>
    </div>
  );
}
