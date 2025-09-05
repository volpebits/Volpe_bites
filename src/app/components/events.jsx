"use client";

import { useEffect, useState } from "react";

export function EventCalendar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Ativa animação de entrada ao montar o componente
    setVisible(true);
  }, []);

  const events = [
    { date: "10/09", name: "Lançamento Starfield", location: "PC / Xbox" },
    { date: "15/09", name: "Campeonato LoL BR", location: "Online" },
    {
      date: "20/09",
      name: "BGS 2025",
      location: "São Paulo - Expo Center Norte",
    },
    { date: "25/09", name: "Lançamento Fifa 26", location: "PC / PS5 / Xbox" },
    { date: "30/09", name: "Torneio CS:GO Amador", location: "Online" },
    { date: "05/10", name: "TGA Watch Party", location: "YouTube / Twitch" },
  ];

  return (
    <div
      className={`transition-all duration-700 ease-out transform ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5"
      } w-full bg-purple-900/40 text-white rounded-2xl shadow-lg p-4`}
    >
      <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
        📅 Próximos Eventos
      </h2>

      {/* Área com scroll para listas grandes */}
      <div className="max-h-64 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-purple-900">
        {events.map((event, index) => (
          <div
            key={index}
            className="flex flex-col bg-purple-800/50 p-3 rounded-xl hover:bg-purple-700/40 transition"
          >
            <span className="text-green-400 font-semibold">{event.date}</span>
            <span className="font-medium">{event.name}</span>
            <span className="text-sm text-gray-300">{event.location}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
