// components/CommunityCard.jsx
export function CommunityCard() {
  return (
    <div className="relative bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700 rounded-2xl shadow-xl p-8 text-center text-white transform transition duration-300 hover:scale-[1.02] hover:shadow-2xl">
      <h3 className="text-3xl font-bold mb-3">
        🎮 Participe da Comunidade Volpe!
      </h3>
      <p className="text-lg max-w-2xl mx-auto mb-6">
        Conheça outros jogadores, compartilhe suas experiências e fique por
        dentro de tudo que acontece no cenário de jogos brasileiros.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="https://discord.gg/DaH48GMWKV"
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-md transition active:scale-95"
        >
          Acessar Comunidade
        </a>
        <a
          href="/ranking"
          className="px-6 py-3 bg-white text-purple-700 font-bold rounded-xl shadow-md hover:bg-gray-100 transition active:scale-95"
        >
          Cadastrar-se
        </a>
      </div>
    </div>
  );
}
