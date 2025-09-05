"use client";

import { useEffect, useState } from "react";

export function TipCard() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div
      className={`transition-all duration-700 ease-out transform ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
      } w-full bg-purple-900/40 text-white rounded-2xl shadow-lg p-4`}
    >
      <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
        💡 Dica do Dia
      </h2>

      <p className="text-gray-200 mb-4">
        Aproveite a promoção de hoje na Steam! Vários jogos com até 80% de
        desconto até meia-noite.
      </p>

      <button className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-md transition active:scale-95">
        Ver Promoções
      </button>
    </div>
  );
}
