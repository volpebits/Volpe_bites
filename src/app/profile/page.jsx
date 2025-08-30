"use client";

import React from "react";
import {
    User,
    Edit3,
    Trophy,
    Gamepad2,
    Clock,
    Calendar,
    X,
    Loader2,
    Wand2,
    RefreshCw,
    Eye,
    EyeOff,
} from "lucide-react";

/* ===================== *
 * Constantes e utils
 * ===================== */

const gemColors = [
    "from-yellow-400 to-orange-500",
    "from-purple-400 to-pink-500",
    "from-blue-400 to-cyan-500",
    "from-green-400 to-emerald-500",
    "from-red-400 to-rose-500",
    "from-indigo-400 to-purple-500",
];

const missionTemplates = [
    { type: "play", title: "Maratonista", description: "Jogue por {time} consecutivas", icons: ["⏰", "🎮", "⚡"], timeValues: ["1 hora", "2 horas", "3 horas"] },
    { type: "games", title: "Explorador", description: "Complete {count} jogos diferentes", icons: ["🗺️", "🎯", "🌟"], countValues: [2, 3, 4, 5] },
    { type: "genre", title: "Especialista", description: "Jogue 3 jogos de {genre}", icons: ["🎭", "⚔️", "🏎️"], genres: ["RPG", "Aventura", "Corrida", "Estratégia", "Indie"] },
    { type: "social", title: "Avaliador", description: "Avalie {count} jogos", icons: ["⭐", "📝", "👍"], countValues: [2, 3, 4] },
    { type: "social", title: "Compartilhador", description: "Compartilhe {count} jogos com amigos", icons: ["📤", "🤝", "💫"], countValues: [1, 2, 3] },
    { type: "social", title: "Crítico", description: "Escreva uma review de {count} jogos", icons: ["✍️", "📖", "🎬"], countValues: [1, 2] },
    { type: "achievement", title: "Colecionador", description: "Desbloqueie {count} conquistas", icons: ["🏆", "💎", "🎗️"], countValues: [2, 3, 4, 5] },
    { type: "achievement", title: "Perfeccionista", description: "Complete um jogo 100%", icons: ["💯", "👑", "✨"], countValues: [1] },
    { type: "achievement", title: "Speedrunner", description: "Complete um jogo em menos de {time}", icons: ["🏃", "⚡", "🕐"], timeValues: ["1 hora", "30 minutos", "2 horas"] },
    { type: "discovery", title: "Descobridor", description: "Encontre {count} jogos ocultos", icons: ["🔍", "🗝️", "🎁"], countValues: [1, 2, 3] },
    { type: "discovery", title: "Beta Tester", description: "Teste {count} jogos em desenvolvimento", icons: ["🧪", "⚗️", "🔬"], countValues: [1, 2] },
    { type: "special", title: "Nostálgico", description: "Jogue um jogo clássico brasileiro", icons: ["🎖️", "📼", "🕹️"], countValues: [1] },
    { type: "special", title: "Patriota", description: "Complete {count} jogos nacionais", icons: ["🇧🇷", "🎊", "🏆"], countValues: [2, 3, 4] },
    { type: "special", title: "Madrugador", description: "Jogue entre 00:00 e 06:00", icons: ["🌙", "⭐", "🦉"], countValues: [1] },
];

const uid = () =>
(globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`);

const GLOBAL_KEYS = {
    auth: "volpe_auth",        // { email, password } – quem está logado agora
    userDataSeed: "userData",  // opcional: semente do cadastro
};

const toISODateLocal = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};
const todayISO = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return toISODateLocal(d);
};
const tomorrowISO = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 1);
    return toISODateLocal(d);
};
const isTodayOnOrAfter = (iso) => {
    if (!iso) return true;
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    const target = new Date(iso + "T00:00:00");
    return t >= target;
};
const formatDateBR = (iso) => {
    try {
        return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR");
    } catch {
        return iso;
    }
};

const DAILY_TIPS = [
    "Dica: conclua missões curtas primeiro para embalar o progresso.",
    "Dica: combine gêneros parecidos para descobrir novas pérolas.",
    "Dica: revise as missões antes de jogar para otimizar o tempo.",
    "Dica: um jogo curto bem feito vale mais que 3 começados e largados.",
    "Dica: use as conquistas como guia de exploração.",
    "Dica: jogue com amigos para desbloquear missões sociais.",
    "Dica: experimente Indies — XP fácil e experiências únicas!",
];
const tipIndexForDay = (isoDate) =>
    (isoDate || "")
        .split("")
        .reduce((a, c) => a + c.charCodeAt(0), 0) % DAILY_TIPS.length;

const LEVEL_BASE_XP = 100;
const xpForLevel = (lvl) => LEVEL_BASE_XP + (lvl - 1) * 20;

function resolveDescription(template) {
    let description = template.description;
    if (template.countValues && description.includes("{count}")) {
        const count = template.countValues[Math.floor(Math.random() * template.countValues.length)];
        description = description.replace("{count}", count);
    }
    if (template.timeValues && description.includes("{time}")) {
        const time = template.timeValues[Math.floor(Math.random() * template.timeValues.length)];
        description = description.replace("{time}", time);
    }
    if (template.genres && description.includes("{genre}")) {
        const genre = template.genres[Math.floor(Math.random() * template.genres.length)];
        description = description.replace("{genre}", genre);
    }
    return description;
}

function generateDailyMissionsExactXP(neededXP, maxMissions = 5) {
    if (neededXP <= 0) return [];
    const steps = [50, 45, 40, 35, 30, 25, 20, 15, 10];
    const missions = [];
    let remaining = neededXP;

    for (let i = 0; i < maxMissions && remaining > 0; i++) {
        let pick = steps.find((s) => s <= remaining);
        if (!pick) pick = remaining;

        const template = missionTemplates[Math.floor(Math.random() * missionTemplates.length)];
        const gemColor = gemColors[Math.floor(Math.random() * gemColors.length)];
        const icon = template.icons[Math.floor(Math.random() * template.icons.length)];

        missions.push({
            id: uid(),
            title: template.title,
            description: resolveDescription(template),
            xpReward: pick,
            gemColor,
            icon,
            type: template.type,
            completed: false,
        });

        remaining -= pick;
    }

    const sum = missions.reduce((a, m) => a + m.xpReward, 0);
    if (sum !== neededXP && missions.length > 0) {
        const diff = sum - neededXP;
        missions[missions.length - 1].xpReward -= diff;
        if (missions[missions.length - 1].xpReward <= 0) {
            const fallbackIdx = Math.max(0, missions.length - 2);
            missions[fallbackIdx].xpReward += missions[missions.length - 1].xpReward;
            missions.pop();
        }
    }
    return missions;
}

function applyXpGain(profile, gained) {
    let level = profile.level ?? 1;
    let cur = (profile.currentXP ?? 0) + (gained ?? 0);
    let max = profile.maxXP ?? xpForLevel(level);
    let leveled = false;

    while (cur >= max) {
        cur -= max;
        level += 1;
        max = xpForLevel(level);
        leveled = true;
    }
    return { level, currentXP: cur, maxXP: max, leveled };
}

function withDefaults(p) {
    const today = todayISO();
    const completedList = Array.isArray(p?.completedMissions) ? p.completedMissions : [];
    return {
        name: p?.name ?? "",
        about: p?.about ?? "",
        email: p?.email ?? "",
        avatar: p?.avatar ?? null,
        level: p?.level ?? 1,
        currentXP: p?.currentXP ?? 0,
        maxXP: p?.maxXP ?? xpForLevel(p?.level ?? 1),
        gamesCount: p?.gamesCount ?? 0,
        achievementsCount: p?.achievementsCount ?? completedList.length,
        totalPlaytimeHours: p?.totalPlaytimeHours ?? 0,
        memberSince: p?.memberSince ?? today,
        favoriteGenres: Array.isArray(p?.favoriteGenres) ? p.favoriteGenres : [],
        recentGames: Array.isArray(p?.recentGames) ? p.recentGames : [],
        completedMissions: completedList,
    };
}

const computeUserId = (email) =>
    (email ? email.trim().toLowerCase() : "guest").replace(/[^\w.-]+/g, "_");

const keyFor = (userId, type) => `volpe_${userId}_${type}`;

/* ===================== *
 * Componente Principal
 * ===================== */
const UserProfilePage = () => {
    const [mounted, setMounted] = React.useState(false);

    // Usuário atual
    const [userId, setUserId] = React.useState("guest");

    // Estado principal
    const [profileData, setProfileData] = React.useState(null);
    const [dailyMissions, setDailyMissions] = React.useState([]);
    const [missionsAvailableAt, setMissionsAvailableAt] = React.useState(null); // 'YYYY-MM-DD' | null
    const [onboarding, setOnboarding] = React.useState({
        profileConfigured: false,
        firstGamePlayed: false,
        missionsUnlocked: false,
    });

    // UI
    const [activeTab, setActiveTab] = React.useState("overview");
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isGeneratingAI, setIsGeneratingAI] = React.useState(false);
    const [tempProfileData, setTempProfileData] = React.useState({
        name: "",
        about: "",
        email: "",
        avatar: null,
    });
    const [showPwd, setShowPwd] = React.useState(false);
    const [newPwd, setNewPwd] = React.useState("");
    const [confirmPwd, setConfirmPwd] = React.useState("");
    const [newGenre, setNewGenre] = React.useState("");

    /* ===================== *
     * Persist helpers
     * ===================== */
    const readAuth = () => {
        try {
            const raw = localStorage.getItem(GLOBAL_KEYS.auth);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    };
    const writeAuth = (patch) => {
        try {
            const cur = readAuth() || {};
            const next = { ...cur, ...patch };
            localStorage.setItem(GLOBAL_KEYS.auth, JSON.stringify(next));
            return next;
        } catch {
            return patch;
        }
    };

    const readUserScoped = (id, type, fallback) => {
        try {
            const raw = localStorage.getItem(keyFor(id, type));
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    };
    const writeUserScoped = (id, type, value) => {
        try {
            localStorage.setItem(keyFor(id, type), JSON.stringify(value));
        } catch { }
    };
    const removeUserScoped = (id, type) => {
        try {
            localStorage.removeItem(keyFor(id, type));
        } catch { }
    };

    const bootstrapForUser = React.useCallback((id) => {
        const seed = (() => {
            try {
                const raw = localStorage.getItem(GLOBAL_KEYS.userDataSeed);
                return raw ? JSON.parse(raw) : null;
            } catch {
                return null;
            }
        })();

        // PROFILE
        let savedProfile = readUserScoped(id, "profile", null);
        if (!savedProfile) {
            const base = withDefaults({
                name: seed?.name || "",
                email: seed?.email || (id !== "guest" ? id : ""),
            });
            savedProfile = base;
            writeUserScoped(id, "profile", savedProfile);
        } else {
            savedProfile = withDefaults(savedProfile);
            writeUserScoped(id, "profile", savedProfile);
        }

        // ONBOARDING
        let savedOnb = readUserScoped(id, "onboarding", null);
        if (!savedOnb) {
            savedOnb = {
                profileConfigured: !!(savedProfile.name || savedProfile.about || savedProfile.avatar),
                firstGamePlayed: (savedProfile.gamesCount ?? 0) > 0,
                missionsUnlocked: false,
            };
            writeUserScoped(id, "onboarding", savedOnb);
        }

        // META
        let meta = readUserScoped(id, "daily_meta", { availableAt: null });
        const availableAt = meta?.availableAt ?? null;

        // DAILY
        let daily = [];
        if (savedOnb.missionsUnlocked && isTodayOnOrAfter(availableAt)) {
            const savedDaily = readUserScoped(id, "daily", null);
            if (savedDaily) {
                daily = savedDaily;
            } else {
                const need = savedProfile.maxXP - savedProfile.currentXP;
                daily = generateDailyMissionsExactXP(need);
                writeUserScoped(id, "daily", daily);
            }
        }

        setUserId(id);
        setProfileData(savedProfile);
        setOnboarding(savedOnb);
        setMissionsAvailableAt(availableAt);
        setDailyMissions(daily);
    }, []);

    const migrateUserData = (oldId, newId, nextProfile, keepOld = false) => {
        writeUserScoped(newId, "profile", nextProfile);

        const oldDaily = readUserScoped(oldId, "daily", []);
        const oldMeta = readUserScoped(oldId, "daily_meta", { availableAt: null });
        const oldOnb = readUserScoped(oldId, "onboarding", {
            profileConfigured: false,
            firstGamePlayed: false,
            missionsUnlocked: false,
        });

        writeUserScoped(newId, "daily", oldDaily);
        writeUserScoped(newId, "daily_meta", oldMeta);
        writeUserScoped(newId, "onboarding", oldOnb);

        if (!keepOld) {
            removeUserScoped(oldId, "profile");
            removeUserScoped(oldId, "daily");
            removeUserScoped(oldId, "daily_meta");
            removeUserScoped(oldId, "onboarding");
        }

        setUserId(newId);
        setProfileData(nextProfile);
        setDailyMissions(oldDaily);
        setMissionsAvailableAt(oldMeta?.availableAt ?? null);
        setOnboarding(oldOnb);
    };

    /* ===================== *
     * Lifecycle
     * ===================== */

    React.useEffect(() => {
        setMounted(true);

        const auth = readAuth();
        const id = computeUserId(auth?.email);
        bootstrapForUser(id);

        const onStorage = () => {
            const a = readAuth();
            const nid = computeUserId(a?.email);
            bootstrapForUser(nid);
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, [bootstrapForUser]);

    React.useEffect(() => {
        if (!profileData) return;
        writeUserScoped(userId, "profile", profileData);
    }, [userId, profileData]);

    React.useEffect(() => {
        writeUserScoped(userId, "daily", dailyMissions);
    }, [userId, dailyMissions]);

    React.useEffect(() => {
        writeUserScoped(userId, "daily_meta", { availableAt: missionsAvailableAt });
    }, [userId, missionsAvailableAt]);

    React.useEffect(() => {
        writeUserScoped(userId, "onboarding", onboarding);
    }, [userId, onboarding]);

    // Desbloqueio automático de missões após os 2 passos
    React.useEffect(() => {
        if (!profileData) return;
        if (!onboarding.missionsUnlocked && onboarding.profileConfigured && onboarding.firstGamePlayed) {
            const canShow = isTodayOnOrAfter(missionsAvailableAt); // null => hoje
            if (canShow) {
                const need = profileData.maxXP - profileData.currentXP;
                const gen = generateDailyMissionsExactXP(need);
                setDailyMissions(gen);
                writeUserScoped(userId, "daily", gen);
            } else {
                setDailyMissions([]);
            }
            setOnboarding((prev) => ({ ...prev, missionsUnlocked: true }));
        }
    }, [onboarding, missionsAvailableAt, profileData, userId]);

    // Se já desbloqueou, não há missões e chegou o dia: gera
    React.useEffect(() => {
        if (!profileData) return;
        if (onboarding.missionsUnlocked && dailyMissions.length === 0 && isTodayOnOrAfter(missionsAvailableAt)) {
            const need = profileData.maxXP - profileData.currentXP;
            const gen = generateDailyMissionsExactXP(need);
            setDailyMissions(gen);
            writeUserScoped(userId, "daily", gen);
        }
    }, [missionsAvailableAt, onboarding.missionsUnlocked, profileData, userId]);

    /* ===================== *
     * Handlers
     * ===================== */

    const handleEditProfile = () => {
        if (!profileData) return;
        setTempProfileData({
            name: profileData.name ?? "",
            about: profileData.about ?? "",
            email: profileData.email ?? "",
            avatar: profileData.avatar ?? null,
        });
        setIsEditModalOpen(true);
    };

    const handleSaveProfile = () => {
        setProfileData((prev) => {
            const next = withDefaults({
                ...prev,
                name: tempProfileData.name ?? "",
                about: tempProfileData.about ?? "",
                email: tempProfileData.email ?? "",
                avatar: tempProfileData.avatar ?? null,
            });

            // Marca perfil configurado se tiver algo
            if (!onboarding.profileConfigured && (next.name || next.about || next.avatar)) {
                setOnboarding((o) => ({ ...o, profileConfigured: true }));
            }

            // Se e-mail mudou, migra chaves e atualiza auth
            const newId = computeUserId(next.email);
            if (newId !== userId) {
                writeAuth({ email: next.email, ...(newPwd && newPwd === confirmPwd ? { password: newPwd } : {}) });
                migrateUserData(userId, newId, next, false);
            } else {
                if (newPwd && newPwd === confirmPwd) writeAuth({ password: newPwd });
                writeUserScoped(userId, "profile", next);
            }

            return next;
        });

        setNewPwd("");
        setConfirmPwd("");
        setIsEditModalOpen(false);
    };

    const handleCancelEdit = () => {
        setIsEditModalOpen(false);
        setNewPwd("");
        setConfirmPwd("");
    };

    const generateAIAvatar = async () => {
        setIsGeneratingAI(true);
        setTimeout(() => {
            const aiAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`;
            setTempProfileData((prev) => ({ ...prev, avatar: aiAvatarUrl }));
            setIsGeneratingAI(false);
        }, 900);
    };

    const completeMission = (missionId) => {
        if (!profileData) return;
        const mission = dailyMissions.find((m) => m.id === missionId);
        if (!mission || mission.completed) return;

        const result = applyXpGain(profileData, mission.xpReward);

        const completedMission = {
            ...mission,
            id: uid(),
            completedAt: "Agora mesmo",
            completed: true,
        };

        setProfileData((prev) => {
            const newCompleted = [completedMission, ...(prev.completedMissions || [])];
            const next = withDefaults({
                ...prev,
                level: result.level,
                currentXP: result.currentXP,
                maxXP: result.maxXP,
                achievementsCount: newCompleted.length,
                completedMissions: newCompleted,
            });
            writeUserScoped(userId, "profile", next);
            return next;
        });

        const remaining = dailyMissions.filter((m) => m.id !== missionId);
        setDailyMissions(remaining);
        writeUserScoped(userId, "daily", remaining);

        // Se upou (ou zerou a lista), novas missões só amanhã
        if (result.leveled || remaining.length === 0) {
            const nextDay = tomorrowISO();
            setMissionsAvailableAt(nextDay);
            writeUserScoped(userId, "daily_meta", { availableAt: nextDay });
            setDailyMissions([]);
            writeUserScoped(userId, "daily", []);
        }
    };

    const regenerateSpecificMission = (missionId) => {
        if (!profileData || dailyMissions.length === 0) return;
        const need = profileData.maxXP - profileData.currentXP;
        const others = dailyMissions.filter((m) => m.id !== missionId);
        const currentSumOthers = others.reduce((a, m) => a + m.xpReward, 0);
        const neededForThis = Math.max(0, need - currentSumOthers);
        const xpForNew =
            neededForThis > 0
                ? neededForThis
                : Math.max(10, dailyMissions.find((m) => m.id === missionId)?.xpReward ?? 10);

        const template = missionTemplates[Math.floor(Math.random() * missionTemplates.length)];
        const gemColor = gemColors[Math.floor(Math.random() * gemColors.length)];
        const icon = template.icons[Math.floor(Math.random() * template.icons.length)];

        const newMission = {
            id: uid(),
            title: template.title,
            description: resolveDescription(template),
            xpReward: xpForNew,
            gemColor,
            icon,
            type: template.type,
            completed: false,
        };

        const next = dailyMissions.map((m) => (m.id === missionId ? newMission : m));
        setDailyMissions(next);
        writeUserScoped(userId, "daily", next);
    };

    const regenerateAllMissions = () => {
        if (!profileData || dailyMissions.length === 0) return;
        const need = profileData.maxXP - profileData.currentXP;
        const nextDaily = generateDailyMissionsExactXP(need);
        setDailyMissions(nextDaily);
        writeUserScoped(userId, "daily", nextDaily);
    };

    const addFavoriteGenre = () => {
        const g = (newGenre || "").trim();
        if (!g) return;
        setProfileData((prev) => {
            const list = Array.isArray(prev.favoriteGenres) ? [...prev.favoriteGenres] : [];
            if (list.find((x) => x.toLowerCase() === g.toLowerCase())) return prev;
            list.push(g);
            const next = { ...prev, favoriteGenres: list.slice(0, 8) };
            writeUserScoped(userId, "profile", next);
            return next;
        });
        setNewGenre("");
    };
    const removeFavoriteGenre = (idx) => {
        setProfileData((prev) => {
            const list = Array.isArray(prev.favoriteGenres) ? [...prev.favoriteGenres] : [];
            list.splice(idx, 1);
            const next = { ...prev, favoriteGenres: list };
            writeUserScoped(userId, "profile", next);
            return next;
        });
    };

    /* ===================== *
     * Render
     * ===================== */

    if (!mounted || !profileData) {
        return (
            <div className="min-h-screen p-4 bg-gradient-to-br from-white via-purple-400 to-purple-950 dark:bg-gradient-to-br dark:from-black dark:via-purple-700 dark:to-purple-950">
                <div className="max-w-7xl mx-auto animate-pulse text-white/70">Carregando…</div>
            </div>
        );
    }

    const achievementsCount =
        (Array.isArray(profileData.completedMissions) ? profileData.completedMissions.length : 0) ??
        profileData.achievementsCount ??
        0;

    const missionsLocked =
        onboarding.missionsUnlocked &&
        dailyMissions.length === 0 &&
        missionsAvailableAt &&
        !isTodayOnOrAfter(missionsAvailableAt);

    return (
        <div className="min-h-screen p-4 bg-gradient-to-br from-white via-purple-400 to-purple-950 dark:bg-gradient-to-br dark:from-black dark:via-purple-700 dark:to-purple-950">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-start gap-8 mb-8">
                    <div className="flex items-start gap-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-600 dark:border-gray-300 bg-gray-700 dark:bg-gray-200 mb-4">
                                {profileData.avatar ? (
                                    <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="w-16 h-16 text-gray-400" aria-hidden />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-black dark:text-white mb-1">
                                {profileData.name || "Usuário"}
                            </h1>

                            <div className="text-sm text-black/80 dark:text-white/80 mb-3">
                                {profileData.email ? (
                                    <span>
                                        E-mail: <span className="font-semibold">{profileData.email}</span>
                                    </span>
                                ) : (
                                    <span className="italic">E-mail não definido</span>
                                )}
                            </div>

                            <p className="text-gray-900 dark:text-white text-lg mb-4">
                                {profileData.about || "Adicione uma bio para contar um pouco sobre você!"}
                            </p>

                            <div className="flex items-center gap-6 text-gray-400 text-sm">
                                <span className="flex items-center gap-1">
                                    <Calendar className="text-black dark:text-white w-4 h-4" aria-hidden />
                                    <span className="text-black dark:text-white" suppressHydrationWarning>
                                        Membro desde {new Date(profileData.memberSince + "T00:00:00").toLocaleDateString("pt-BR")}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 ml-auto">
                        <button
                            onClick={handleEditProfile}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
                        >
                            <Edit3 className="w-4 h-4" aria-hidden />
                            Editar Perfil
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className="text-black dark:text-gray-100 hover:text-white font-bold px-4 py-3"
                        >
                            Voltar
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80">
                        <div className="text-3xl font-bold text-green-400 mb-1">Nível {profileData.level}</div>
                        <div className="text-black dark:text-white font-bold mb-3">
                            XP: {profileData.currentXP}/{profileData.maxXP}
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                            <div
                                className="bg-green-500 h-3 rounded-full"
                                style={{ width: `${(profileData.currentXP / profileData.maxXP) * 100}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-300 mt-1">
                            {profileData.currentXP}/{profileData.maxXP} XP
                        </div>
                    </div>

                    <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80 text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">
                            {achievementsCount}
                        </div>
                        <div className="text-black dark:text-white font-bold mb-2">Conquistas</div>
                        <Trophy className="w-8 h-8 text-yellow-500 mx-auto" aria-hidden />
                    </div>

                    <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80 text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">
                            {profileData.gamesCount}
                        </div>
                        <div className="text-black dark:text-white font-bold mb-2">Jogos</div>
                        <Gamepad2 className="w-8 h-8 text-purple-900 dark:text-purple-500 font-bold mx-auto" aria-hidden />
                    </div>

                    <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80 text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">
                            {profileData.totalPlaytimeHours}h
                        </div>
                        <div className="text-black dark:text-white font-bold mb-2">Tempo de Jogo</div>
                        <Clock className="w-8 h-8 text-green-500 font-bold mx-auto" aria-hidden />
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Lado Esquerdo - Tabs e Conteúdo */}
                    <div className="flex-1">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-900 mb-6">
                            {[
                                { id: "overview", label: "Visão Geral" },
                                { id: "games", label: "Jogos" },
                                { id: "achievements", label: "Conquistas" },
                                { id: "stats", label: "Estatísticas" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-3 font-medium transition-colors ${activeTab === tab.id
                                            ? "text-green-400 border-b-2 border-green-400"
                                            : "text-black dark:text-white hover:text-white"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Visão Geral */}
                        {activeTab === "overview" && (
                            <div className="space-y-6">
                                {!onboarding.missionsUnlocked ? (
                                    <div>
                                        <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Bem-vindo!</h3>
                                        <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80">
                                            <p className="text-black dark:text-white text-lg mb-4">
                                                Esta é sua nova conta! Comece sua jornada gamer:
                                            </p>
                                            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                                                <li>• Complete seu perfil adicionando uma bio</li>
                                                <li>• Jogue seu primeiro jogo para ganhar XP</li>
                                                <li>• Desbloqueie suas primeiras conquistas</li>
                                                <li>• Explore diferentes gêneros de jogos</li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            {/* Objetivo do nível */}
                                            <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80">
                                                <h4 className="text-black dark:text-white font-semibold mb-3">Objetivo do nível</h4>
                                                <p className="text-sm text-white/80 mb-2">
                                                    Faltam{" "}
                                                    <span className="font-bold text-green-300">
                                                        {Math.max(0, profileData.maxXP - profileData.currentXP)} XP
                                                    </span>{" "}
                                                    para alcançar o nível {profileData.level + 1}.
                                                </p>
                                                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                                                    <div
                                                        className="bg-green-500 h-3 rounded-full"
                                                        style={{ width: `${(profileData.currentXP / profileData.maxXP) * 100}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-300">
                                                    {profileData.currentXP}/{profileData.maxXP} XP
                                                </p>
                                                <div className="mt-4 text-sm">
                                                    {dailyMissions.length > 0 ? (
                                                        <p className="text-white/80">
                                                            Você tem <span className="font-semibold text-green-300">{dailyMissions.length}</span>{" "}
                                                            missão(ões) ativas hoje.
                                                        </p>
                                                    ) : missionsAvailableAt && !isTodayOnOrAfter(missionsAvailableAt) ? (
                                                        <p className="text-white/80">
                                                            Novas missões em <span className="font-semibold">{formatDateBR(missionsAvailableAt)}</span>.
                                                        </p>
                                                    ) : (
                                                        <p className="text-white/80">Missões concluídas — ótimo trabalho! 🎉</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Atividade recente */}
                                            <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80">
                                                <h4 className="text-black dark:text-white font-semibold mb-3">Atividade recente</h4>
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-sm text-white/70 mb-1">Jogos</p>
                                                        {profileData.recentGames?.length ? (
                                                            <ul className="text-sm text-white/90 list-disc list-inside space-y-1">
                                                                {profileData.recentGames.slice(0, 3).map((g, i) => (
                                                                    <li key={i}>
                                                                        <span className="font-semibold">{g.name}</span>{" "}
                                                                        <span className="text-white/60">— {g.playedAt}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-sm text-white/60">Sem jogos ainda.</p>
                                                        )}
                                                    </div>

                                                    <div className="pt-2 border-t border-white/10">
                                                        <p className="text-sm text-white/70 mb-1">Conquistas</p>
                                                        {profileData.completedMissions?.length ? (
                                                            <ul className="text-sm text-white/90 list-disc list-inside space-y-1">
                                                                {profileData.completedMissions.slice(0, 3).map((m) => (
                                                                    <li key={m.id}>
                                                                        <span className="font-semibold">{m.title}</span>{" "}
                                                                        <span className="text-white/60">— +{m.xpReward} XP</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-sm text-white/60">Ainda sem conquistas. Bora nessas missões!</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Dica do dia */}
                                            <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80">
                                                <h4 className="text-black dark:text-white font-semibold mb-3">Dica do dia</h4>
                                                <p className="text-white/90">
                                                    {DAILY_TIPS[tipIndexForDay(todayISO())]}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Gêneros favoritos */}
                                        <div>
                                            <h3 className="text-2xl font-bold text-black dark:text-white mt-2 mb-3">
                                                Gêneros favoritos
                                            </h3>

                                            {profileData.favoriteGenres?.length ? (
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {profileData.favoriteGenres.map((genre, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="group inline-flex items-center gap-2 bg-purple-600 text-white px-3 py-1.5 rounded-full text-sm"
                                                        >
                                                            {genre}
                                                            <button
                                                                onClick={() => removeFavoriteGenre(idx)}
                                                                className="opacity-70 group-hover:opacity-100 hover:text-rose-200 transition"
                                                                aria-label={`Remover ${genre}`}
                                                                title="Remover"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-white/70 mb-3">
                                                    Nenhum gênero adicionado ainda. Comece adicionando os que você mais curte!
                                                </p>
                                            )}

                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newGenre ?? ""}
                                                    onChange={(e) => setNewGenre(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && addFavoriteGenre()}
                                                    className="w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
                                                    placeholder="Ex.: RPG, Aventura…"
                                                />
                                                <button
                                                    onClick={addFavoriteGenre}
                                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                                >
                                                    Adicionar
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Jogos */}
                        {activeTab === "games" && (
                            <div>
                                <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Seus Jogos</h3>
                                {profileData.recentGames?.length === 0 ? (
                                    <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-8 border border-purple-900/80 text-center">
                                        <Gamepad2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h4 className="text-black dark:text-white font-semibold text-xl mb-2">
                                            Nenhum jogo ainda
                                        </h4>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Comece jogando para ver seus jogos aqui!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {profileData.recentGames.map((game, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-4 bg-purple-800/20 rounded-lg p-4 border border-purple-900/80"
                                            >
                                                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                                                    <span className="text-white font-bold text-xs">
                                                        {game.name.substring(0, 3)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="text-black dark:text-white font-semibold text-lg">
                                                        {game.name}
                                                    </h4>
                                                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                                                        {game.playedAt}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Conquistas */}
                        {activeTab === "achievements" && (
                            <div>
                                <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Conquistas</h3>
                                {!Array.isArray(profileData.completedMissions) || profileData.completedMissions.length === 0 ? (
                                    <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-8 border border-purple-900/80 text-center">
                                        <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h4 className="text-black dark:text-white font-semibold text-xl mb-2">
                                            Nenhuma conquista ainda
                                        </h4>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Jogue e complete missões para desbloquear conquistas!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {profileData.completedMissions.map((achievement) => (
                                            <div
                                                key={achievement.id}
                                                className="flex items-center gap-4 bg-green-500/20 border border-green-500/50 rounded-lg p-4"
                                            >
                                                <div className="text-3xl" aria-hidden>
                                                    {achievement.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-black dark:text-white font-semibold">
                                                        {achievement.title}
                                                    </h4>
                                                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                                                        {achievement.description}
                                                    </p>
                                                    <p className="text-green-400 text-xs">
                                                        Concluída {achievement.completedAt}
                                                    </p>
                                                </div>
                                                <div className="text-green-400 font-bold">+{achievement.xpReward} XP</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Estatísticas */}
                        {activeTab === "stats" && (
                            <div>
                                <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Estatísticas</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-purple-800/20 rounded-lg p-6 border border-purple-900/80">
                                        <h4 className="text-black dark:text-white font-semibold mb-4">
                                            Progresso do Nível
                                        </h4>
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-green-400 mb-2">
                                                {profileData.level}
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                                                <div
                                                    className="bg-green-500 h-3 rounded-full"
                                                    style={{ width: `${(profileData.currentXP / profileData.maxXP) * 100}%` }}
                                                />
                                            </div>
                                            <p className="text-black dark:text-white text-sm">
                                                {profileData.currentXP}/{profileData.maxXP} XP para o próximo nível
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-purple-800/20 rounded-lg p-6 border border-purple-900/80">
                                        <h4 className="text-black dark:text-white font-semibold mb-4">
                                            Resumo da Conta
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-black dark:text-white">Nível atual:</span>
                                                <span className="text-black dark:text-white font-semibold">
                                                    {profileData.level}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-black dark:text-white">Jogos:</span>
                                                <span className="text-black dark:text-white font-semibold">
                                                    {profileData.gamesCount}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-black dark:text-white">Conquistas:</span>
                                                <span className="text-black dark:text-white font-semibold">
                                                    {achievementsCount}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-black dark:text-white">Tempo Total:</span>
                                                <span className="text-black dark:text-white font-semibold">
                                                    {profileData.totalPlaytimeHours}h
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Lado Direito - Onboarding OU Missões */}
                    <div className="w-80">
                        {!onboarding.missionsUnlocked ? (
                            <>
                                <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
                                    Comece sua jornada
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                                        <h4 className="text-white font-semibold mb-2">Configure seu perfil</h4>
                                        <p className="text-blue-300 text-sm mb-4">
                                            Adicione uma foto e uma bio para personalizar seu perfil
                                        </p>
                                        <button
                                            onClick={handleEditProfile}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium w-full transition-colors"
                                        >
                                            Editar Perfil
                                        </button>
                                        {onboarding.profileConfigured && (
                                            <p className="text-xs text-emerald-300 mt-2">✓ Perfil configurado</p>
                                        )}
                                    </div>

                                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                                        <h4 className="text-white font-semibold mb-2">Primeiro jogo</h4>
                                        <p className="text-green-300 text-sm mb-4">
                                            Jogue seu primeiro jogo para ganhar XP e começar sua jornada
                                        </p>
                                        <button
                                            onClick={() => {
                                                setProfileData((prev) => {
                                                    const next = withDefaults({
                                                        ...prev,
                                                        gamesCount: (prev.gamesCount ?? 0) + 1,
                                                        totalPlaytimeHours: (prev.totalPlaytimeHours ?? 0) + 1,
                                                        recentGames: [
                                                            { name: "Jogo Demo", playedAt: new Date().toLocaleString("pt-BR") },
                                                            ...(prev.recentGames || []),
                                                        ].slice(0, 5),
                                                    });
                                                    writeUserScoped(userId, "profile", next);
                                                    return next;
                                                });
                                                setOnboarding((o) => ({ ...o, firstGamePlayed: true }));
                                            }}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium w-full transition-colors"
                                        >
                                            Explorar Jogos
                                        </button>
                                        {onboarding.firstGamePlayed && (
                                            <p className="text-xs text-emerald-300 mt-2">✓ Primeiro jogo jogado</p>
                                        )}
                                    </div>

                                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
                                        <h4 className="text-white font-semibold mb-2">Primeira conquista</h4>
                                        <p className="text-yellow-300 text-sm mb-4">
                                            Assim que as missões forem desbloqueadas, conclua uma para sua 1ª conquista
                                        </p>
                                        <button
                                            disabled
                                            className="bg-yellow-600/60 text-white/80 px-4 py-2 rounded text-sm font-medium w-full transition-colors cursor-not-allowed"
                                        >
                                            Ver Missões
                                        </button>
                                    </div>

                                    <p className="text-xs text-white/70">
                                        As missões desbloqueiam automaticamente quando concluir os 2 passos acima.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-black dark:text-white">Missões diárias</h3>
                                    {dailyMissions.length > 0 && (
                                        <button
                                            onClick={regenerateAllMissions}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                            title="Trocar todas as missões (mantendo o XP necessário)"
                                        >
                                            <RefreshCw className="w-4 h-4" aria-hidden />
                                            Trocar Todas
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {dailyMissions.map((mission) => (
                                        <div
                                            key={mission.id}
                                            className="bg-green-500/20 border border-green-500/50 rounded-lg p-4"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-white font-semibold">{mission.title}</h4>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => regenerateSpecificMission(mission.id)}
                                                        className="bg-gray-600 hover:bg-gray-700 text-white p-1 rounded text-xs transition-colors"
                                                        title="Trocar esta missão (ajustando o XP)"
                                                        aria-label="Trocar esta missão"
                                                    >
                                                        <RefreshCw className="w-3 h-3" aria-hidden />
                                                    </button>
                                                    <div
                                                        className={`w-8 h-8 bg-gradient-to-br ${mission.gemColor} rounded-full flex items-center justify-center shadow-lg`}
                                                    >
                                                        <span className="text-white text-xs font-bold" aria-hidden>
                                                            💎
                                                        </span>
                                                    </div>
                                                    <span className="text-green-400 font-bold text-sm">
                                                        +{mission.xpReward} XP
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-green-300 text-sm mb-4">{mission.description}</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => completeMission(mission.id)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium flex-1 transition-colors"
                                                >
                                                    Concluir
                                                </button>
                                                <button
                                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium"
                                                    onClick={() => setActiveTab("games")}
                                                >
                                                    Ver Jogos
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {dailyMissions.length === 0 && (
                                        missionsLocked ? (
                                            <div className="text-center py-8">
                                                <div className="text-4xl mb-4" aria-hidden>⏳</div>
                                                <h4 className="text-black dark:text-white font-semibold mb-2">
                                                    Novas missões amanhã
                                                </h4>
                                                <p className="text-gray-200 text-sm">
                                                    Disponíveis em {formatDateBR(missionsAvailableAt)}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="text-4xl mb-4" aria-hidden>🎉</div>
                                                <h4 className="text-black dark:text-white font-semibold mb-2">
                                                    Todas as missões concluídas!
                                                </h4>
                                                <p className="text-gray-200 text-sm">Novas missões chegam já já…</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Modal de Edição */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50">
                        <div className="absolute inset-0 bg-black/60" onClick={handleCancelEdit} />
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="edit-profile-title"
                            className="relative mx-auto mt-16 w-full max-w-md rounded-lg bg-white dark:bg-zinc-800 p-6 shadow-xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 id="edit-profile-title" className="text-2xl font-bold text-black dark:text-white">
                                    Editar Perfil
                                </h2>
                                <button
                                    onClick={handleCancelEdit}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    aria-label="Fechar modal"
                                >
                                    <X className="w-6 h-6" aria-hidden />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Avatar */}
                                <div className="flex flex-col items-center mb-6">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 mb-4">
                                        {tempProfileData.avatar ? (
                                            <img src={tempProfileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User className="w-12 h-12 text-gray-400" aria-hidden />
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const readyPlayerUrl = "https://demo.readyplayer.me/avatar?frameApi";
                                                const popup = window.open(readyPlayerUrl, "readyplayerme", "width=400,height=600");
                                                const handleMessage = (event) => {
                                                    if (event.origin !== "https://demo.readyplayer.me") return;
                                                    if (event.data?.eventName === "v1.avatar.exported") {
                                                        setTempProfileData((prev) => ({ ...prev, avatar: event.data.url }));
                                                        popup?.close();
                                                        window.removeEventListener("message", handleMessage);
                                                    }
                                                };
                                                window.addEventListener("message", handleMessage);
                                                const iv = setInterval(() => {
                                                    if (popup && popup.closed) {
                                                        window.removeEventListener("message", handleMessage);
                                                        clearInterval(iv);
                                                    }
                                                }, 1000);
                                            }}
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-lg text-sm transition-colors"
                                        >
                                            <User size={16} aria-hidden />
                                            3D Avatar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={generateAIAvatar}
                                            disabled={isGeneratingAI}
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white rounded-lg text-sm transition-colors"
                                        >
                                            {isGeneratingAI ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Wand2 size={16} aria-hidden />}
                                            IA Random
                                        </button>
                                    </div>
                                </div>

                                {/* Nome */}
                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                        Nome de usuário
                                    </label>
                                    <input
                                        type="text"
                                        value={tempProfileData.name ?? ""}
                                        onChange={(e) => setTempProfileData((prev) => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
                                        placeholder="Seu nome"
                                    />
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                        Sobre
                                    </label>
                                    <textarea
                                        value={tempProfileData.about ?? ""}
                                        onChange={(e) => setTempProfileData((prev) => ({ ...prev, about: e.target.value }))}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white resize-none"
                                        placeholder="Bio (opcional)"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={tempProfileData.email ?? ""}
                                        onChange={(e) => setTempProfileData((prev) => ({ ...prev, email: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
                                        placeholder="voce@exemplo.com"
                                    />
                                </div>

                                {/* Senha (DEMO local) */}
                                <div className="mt-2">
                                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                        Alterar senha
                                    </label>
                                    <div className="relative mb-2">
                                        <input
                                            type={showPwd ? "text" : "password"}
                                            value={newPwd ?? ""}
                                            onChange={(e) => setNewPwd(e.target.value)}
                                            className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
                                            placeholder="Nova senha (opcional)"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPwd((s) => !s)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
                                        >
                                            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <input
                                        type={showPwd ? "text" : "password"}
                                        value={confirmPwd ?? ""}
                                        onChange={(e) => setConfirmPwd(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
                                        placeholder="Confirmar nova senha"
                                    />
                                    {newPwd && confirmPwd && newPwd !== confirmPwd && (
                                        <p className="text-xs mt-1 text-rose-400">As senhas não coincidem.</p>
                                    )}
                                </div>
                            </div>

                            {/* Botões */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={!!newPwd && newPwd !== confirmPwd}
                                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-4 py-2 rounded-lg font-medium"
                                >
                                    Salvar
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg font-medium"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfilePage;
