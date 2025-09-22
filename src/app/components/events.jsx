"use client";
import { useEffect, useState } from "react";

export function EventCalendar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Ativa animação de entrada ao montar o componente
    setVisible(true);
  }, []);

  const events = [
    {
      date: "10/09",
      name: "Lançamento Starfield",
      location: "PC / Xbox",
      type: "launch",
      icon: "🚀",
    },
    {
      date: "15/09",
      name: "Campeonato LoL BR",
      location: "Online",
      type: "tournament",
      icon: "🏆",
    },
    {
      date: "20/09",
      name: "BGS 2025",
      location: "São Paulo - Expo Center Norte",
      type: "event",
      icon: "🎪",
    },
    {
      date: "25/09",
      name: "Lançamento Fifa 26",
      location: "PC / PS5 / Xbox",
      type: "launch",
      icon: "⚽",
    },
    {
      date: "30/09",
      name: "Torneio CS:GO Amador",
      location: "Online",
      type: "tournament",
      icon: "🎯",
    },
    {
      date: "05/10",
      name: "TGA Watch Party",
      location: "YouTube / Twitch",
      type: "stream",
      icon: "📺",
    },
  ];

  const getEventTypeColor = (type) => {
    switch (type) {
      case "launch":
        return "border-l-green-400 bg-green-400/10";
      case "tournament":
        return "border-l-yellow-400 bg-yellow-400/10";
      case "event":
        return "border-l-purple-400 bg-purple-400/10";
      case "stream":
        return "border-l-blue-400 bg-blue-400/10";
      default:
        return "border-l-gray-400 bg-gray-400/10";
    }
  };

  const isUpcoming = (dateStr) => {
    // Simples verificação se o evento está próximo (primeiros 3 da lista)
    const eventIndex = events.findIndex((e) => e.date === dateStr);
    return eventIndex < 3;
  };

  return (
    <div
      className={`transition-all duration-700 ease-out transform ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"
      } w-full relative overflow-hidden bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700 text-white rounded-2xl shadow-lg p-4`}
    >
      {/* Efeito de brilho sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>

      {/* Partícula decorativa pequena */}
      <div className="absolute -top-2 -left-2 w-16 h-16 bg-purple-400/20 rounded-full blur-xl animate-pulse"></div>

      <div className="relative z-10">
        {/* Título melhorado */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl animate-bounce">📅</span>
            <h2 className="text-lg font-black bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Próximos Eventos
            </h2>
          </div>
          <div className="w-16 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent rounded-full"></div>
        </div>

        {/* Contador de eventos */}
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
            <span className="text-xs text-purple-200">📊</span>
            <span className="text-sm font-semibold">
              {events.length} eventos programados
            </span>
          </div>
        </div>

        {/* Área com scroll melhorada */}
        <div className="max-h-64 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-purple-700/50 scrollbar-track-transparent">
          {events.map((event, index) => (
            <div
              key={index}
              className={`group relative flex items-start gap-3 p-3 rounded-xl transition-all duration-300 hover:transform hover:scale-[1.02] border-l-4 ${getEventTypeColor(
                event.type
              )} bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-purple-700/30 hover:border-white/20`}
            >
              {/* Ícone do evento */}
              <div className="flex-shrink-0 mt-1">
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {event.icon}
                </span>
              </div>

              {/* Conteúdo do evento */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-bold text-purple-200 bg-purple-200/10 px-2 py-0.5 rounded-md">
                    {event.date}
                  </span>
                  {isUpcoming(event.date) && (
                    <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full animate-pulse">
                      Em breve!
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-white group-hover:text-purple-100 transition-colors leading-tight mb-1">
                  {event.name}
                </h3>

                <div className="flex items-center gap-1">
                  <span className="text-xs text-purple-300">📍</span>
                  <span className="text-sm text-purple-200">
                    {event.location}
                  </span>
                </div>
              </div>

              {/* Indicador de hover */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/20 transition-colors pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Footer com ação */}
        <div className="mt-4 pt-3 border-t border-white/10 text-center">
          <button className="text-xs text-purple-200 hover:text-white transition-colors font-medium">
            📢 Ver todos os eventos →
          </button>
        </div>
      </div>
    </div>
  );
}
