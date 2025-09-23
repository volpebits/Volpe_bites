// src/app/profile/utils/missions.js
import { uid } from "./uid";

// Paletas para o badge da missão
export const gemColors = [
    "from-purple-600 to-indigo-600",
    "from-emerald-500 to-green-600",
    "from-pink-500 to-rose-600",
    "from-blue-500 to-cyan-600",
    "from-amber-500 to-orange-600",
];

// Modelos simples de missões
export const missionTemplates = [
    {
        type: "play",
        title: "Jogue uma partida",
        descriptions: [
            "Jogue {n} partida(s) em qualquer jogo.",
            "Entre em um jogo e conclua {n} partida(s).",
        ],
        icons: ["🎮", "⚡", "🚀"],
    },
    {
        type: "try",
        title: "Experimente um jogo novo",
        descriptions: [
            "Experimente um jogo que você ainda não jogou.",
            "Teste um jogo novo hoje.",
        ],
        icons: ["🧪", "✨", "🆕"],
    },
    {
        type: "time",
        title: "Acumule tempo de jogo",
        descriptions: [
            "Jogue por pelo menos {t} minutos.",
            "Some {t} minutos de tempo de jogo hoje.",
        ],
        icons: ["⏱️", "⌛", "🏆"],
    },
];

// Monta uma descrição aleatória substituindo placeholders
export function resolveDescription(template) {
    const pick =
        template.descriptions[
        Math.floor(Math.random() * template.descriptions.length)
        ];

    // pequenos valores para placeholders
    const n = 1 + Math.floor(Math.random() * 2); // 1..2
    const t = 15 + Math.floor(Math.random() * 16); // 15..30

    return pick
        .replace("{n}", String(n))
        .replace("{t}", String(t));
}

// Gera 3 missões cuja soma do XP seja ≈ needXP (mínimo 10 cada)
export function generateDailyMissionsExactXP(needXP = 100) {
    const min = 10;
    const target = Math.max(needXP, min * 3);

    // reparte em 3 pedaços (aprox 40/30/30)
    let a = Math.max(min, Math.round(target * 0.4));
    let b = Math.max(min, Math.round(target * 0.3));
    let c = Math.max(min, target - a - b);

    // se passar do alvo por arredondamento, ajusta
    const diff = a + b + c - target;
    if (diff > 0) {
        c = Math.max(min, c - diff);
    }

    const parts = [a, b, c];

    return parts.map((xp) => {
        const t = missionTemplates[Math.floor(Math.random() * missionTemplates.length)];
        const icon = t.icons[Math.floor(Math.random() * t.icons.length)];
        const gem = gemColors[Math.floor(Math.random() * gemColors.length)];

        return {
            id: uid(),
            type: t.type,
            title: t.title,
            description: resolveDescription(t),
            icon,
            gemColor: gem,
            xpReward: xp,
            completed: false,
            completedAt: null,
        };
    });
}
