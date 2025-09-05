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
} from "lucide-react";

/**
 * =====================
 * Constantes e utils
 * =====================
 */

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
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const STORAGE_KEYS = {
    profile: "volpe_profile",
    daily: "volpe_daily",
    completed: "volpe_completed",
    onboarding: "volpe_onboarding",
};

const LEVEL_BASE_XP = 100;
const xpForLevel = (lvl) => LEVEL_BASE_XP + (lvl - 1) * 20; // curva simples

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

// ✅ Cria um perfil default sempre que precisar
function createDefaultProfile() {
    const today = new Date();
    return {
        name: "",
        about: "",
        email: "",
        avatar: null,
        level: 1,
        currentXP: 0,
        maxXP: xpForLevel(1),
        achievementsCount: 0,
        gamesCount: 0,
        totalPlaytimeHours: 0,
        memberSince: today.toISOString().slice(0, 10),
        recentGames: [],
    };
}

/**
 * Gera missões que somam exatamente o XP necessário
 */
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
    let level = profile.level;
    let cur = profile.currentXP + gained;
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

/**
 * =====================
 * Componente Principal
 * =====================
 */
const UserProfilePage = () => {
    const [mounted, setMounted] = React.useState(false);
    const [profileData, setProfileData] = React.useState(null);
    const [completedMissions, setCompletedMissions] = React.useState([]);
    const [dailyMissions, setDailyMissions] = React.useState([]);
    const [onboarding, setOnboarding] = React.useState({
        profileConfigured: false,
        firstGamePlayed: false,
        missionsUnlocked: false,
    });

    const [activeTab, setActiveTab] = React.useState("overview");
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isGeneratingAI, setIsGeneratingAI] = React.useState(false);
    const [tempProfileData, setTempProfileData] = React.useState(createDefaultProfile());

    const updateOnboarding = (patch) => {
        setOnboarding((prev) => {
            const next = { ...prev, ...patch };
            localStorage.setItem(STORAGE_KEYS.onboarding, JSON.stringify(next));
            return next;
        });
    };

    React.useEffect(() => {
        setMounted(true);

        try {
            const auth = JSON.parse(localStorage.getItem("auth user") || "null");
            const users = JSON.parse(localStorage.getItem("userdata") || "{}");
            const savedDaily = localStorage.getItem(STORAGE_KEYS.daily);
            const savedCompleted = localStorage.getItem(STORAGE_KEYS.completed);
            const savedOnboarding = localStorage.getItem(STORAGE_KEYS.onboarding);

            let bootProfile = null;

            if (auth?.email) {
                const id = String(auth.email).trim().toLowerCase().replace(/[^\w.-]+/g, "_");
                const userRecord = users[id];
                if (userRecord?.profile) bootProfile = { ...userRecord.profile };
            }

            if (!bootProfile) {
                bootProfile = createDefaultProfile();
                localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(bootProfile));
            }

            setProfileData(bootProfile);

            let bootOnb = savedOnboarding ? JSON.parse(savedOnboarding) : null;
            if (!bootOnb) {
                bootOnb = {
                    profileConfigured: !!(bootProfile.name || bootProfile.about || bootProfile.avatar),
                    firstGamePlayed: (bootProfile.gamesCount ?? 0) > 0,
                    missionsUnlocked: false,
                };
                localStorage.setItem(STORAGE_KEYS.onboarding, JSON.stringify(bootOnb));
            }
            setOnboarding(bootOnb);

            if (bootOnb.missionsUnlocked) {
                if (savedDaily) setDailyMissions(JSON.parse(savedDaily));
                else {
                    const need = bootProfile.maxXP - bootProfile.currentXP;
                    const gen = generateDailyMissionsExactXP(need);
                    setDailyMissions(gen);
                    localStorage.setItem(STORAGE_KEYS.daily, JSON.stringify(gen));
                }
            } else {
                setDailyMissions([]);
            }

            if (savedCompleted) setCompletedMissions(JSON.parse(savedCompleted));
        } catch {
            const base = createDefaultProfile();
            setProfileData(base);
            setCompletedMissions([]);
            setOnboarding({ profileConfigured: false, firstGamePlayed: false, missionsUnlocked: false });
            setDailyMissions([]);
        }
    }, []);

    React.useEffect(() => {
        if (profileData) {
            localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profileData));

            const auth = JSON.parse(localStorage.getItem("auth user") || "null");
            const users = JSON.parse(localStorage.getItem("userdata") || "{}");

            if (auth?.email) {
                const id = String(auth.email).trim().toLowerCase().replace(/[^\w.-]+/g, "_");
                users[id] = { ...(users[id] || {}), profile: profileData };
                localStorage.setItem("userdata", JSON.stringify(users));
            }
        }
    }, [profileData]);

    React.useEffect(() => {
        if (mounted) {
            localStorage.setItem(STORAGE_KEYS.daily, JSON.stringify(dailyMissions));

            const auth = JSON.parse(localStorage.getItem("auth user") || "null");
            const users = JSON.parse(localStorage.getItem("userdata") || "{}");
            if (auth?.email) {
                const id = String(auth.email).trim().toLowerCase().replace(/[^\w.-]+/g, "_");
                users[id] = { ...(users[id] || {}), dailyMissions };
                localStorage.setItem("userdata", JSON.stringify(users));
            }
        }
    }, [dailyMissions, mounted]);

    React.useEffect(() => {
        if (mounted) {
            localStorage.setItem(STORAGE_KEYS.completed, JSON.stringify(completedMissions));

            const auth = JSON.parse(localStorage.getItem("auth user") || "null");
            const users = JSON.parse(localStorage.getItem("userdata") || "{}");
            if (auth?.email) {
                const id = String(auth.email).trim().toLowerCase().replace(/[^\w.-]+/g, "_");
                users[id] = { ...(users[id] || {}), completedMissions };
                localStorage.setItem("userdata", JSON.stringify(users));
            }
        }
    }, [completedMissions, mounted]);



    // Desbloqueia missões quando concluir os 2 passos do onboarding
    React.useEffect(() => {
        if (!profileData) return;
        if (!onboarding.missionsUnlocked && onboarding.profileConfigured && onboarding.firstGamePlayed) {
            const need = profileData.maxXP - profileData.currentXP;
            const gen = generateDailyMissionsExactXP(need);
            setDailyMissions(gen);
            updateOnboarding({ missionsUnlocked: true });
        }
    }, [onboarding, profileData]);

    /**
     * Handlers
     */
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
            const next = {
                ...prev,
                name: tempProfileData.name,
                about: tempProfileData.about,
                email: tempProfileData.email,
                avatar: tempProfileData.avatar,
            };
            // marca perfil configurado se preencheu algo
            if (!onboarding.profileConfigured && (next.name || next.about || next.avatar)) {
                updateOnboarding({ profileConfigured: true });
            }
            return next;
        });
        setIsEditModalOpen(false);
    };

    const handleCancelEdit = () => setIsEditModalOpen(false);

    // Avatar (demo)
    const generateAIAvatar = async () => {
        setIsGeneratingAI(true);
        setTimeout(() => {
            const aiAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`;
            setTempProfileData((prev) => ({ ...prev, avatar: aiAvatarUrl }));
            setIsGeneratingAI(false);
        }, 900);
    };

    const openReadyPlayerMe = () => {
        const readyPlayerUrl = "https://demo.readyplayer.me/avatar?frameApi";
        const popup = window.open(readyPlayerUrl, "readyplayerme", "width=400,height=600");

        const handleMessage = (event) => {
            if (event.origin !== "https://demo.readyplayer.me") return;
            if (event.data?.eventName === "v1.avatar.exported") {
                const avatarUrl = event.data.url;
                setTempProfileData((prev) => ({ ...prev, avatar: avatarUrl }));
                popup?.close();
                window.removeEventListener("message", handleMessage);
            }
        };

        window.addEventListener("message", handleMessage);
        const checkClosed = setInterval(() => {
            if (popup && popup.closed) {
                window.removeEventListener("message", handleMessage);
                clearInterval(checkClosed);
            }
        }, 1000);
    };

    // Missões
    const [missionsFinishedToday, setMissionsFinishedToday] = React.useState(false);

    const completeMission = (missionId) => {
        if (!profileData) return;
        const mission = dailyMissions.find((m) => m.id === missionId);
        if (!mission || mission.completed) return;

        const result = applyXpGain(profileData, mission.xpReward);
        setProfileData((prev) => ({
            ...prev,
            level: result.level,
            currentXP: result.currentXP,
            maxXP: result.maxXP,
            achievementsCount: (prev.achievementsCount ?? 0) + 1,
        }));

        const completedMission = {
            ...mission,
            id: uid(),
            completedAt: "Agora mesmo",
            completed: true,
        };
        setCompletedMissions((prev) => [completedMission, ...prev]);

        const remaining = dailyMissions.filter((m) => m.id !== missionId);
        setDailyMissions(remaining);

        if (result.leveled || remaining.length === 0) {
            // Zera missões do dia
            setDailyMissions([]);
            setMissionsFinishedToday(true);

            // Armazena no localStorage também
            localStorage.setItem("missionsFinishedToday", "true");

            // Marca o próximo dia para liberar novas missões
            const tomorrow = new Date();
            tomorrow.setHours(0, 0, 0, 0);
            tomorrow.setDate(tomorrow.getDate() + 1);
            localStorage.setItem("nextMissionsAt", tomorrow.toISOString().slice(0, 10));
        }
    };


    const regenerateSpecificMission = (missionId) => {
        if (!profileData) return;
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

        setDailyMissions((prev) => prev.map((m) => (m.id === missionId ? newMission : m)));
    };

    const regenerateAllMissions = () => {
        if (!profileData) return;
        const need = profileData.maxXP - profileData.currentXP;
        const nextDaily = generateDailyMissionsExactXP(need);
        setDailyMissions(nextDaily);
    };

    // SSR-safe skeleton
    if (!mounted || !profileData) {
        return (
            <div className="min-h-screen p-4 bg-gradient-to-br from-white via-purple-400 to-purple-950 dark:bg-gradient-to-br dark:from-black dark:via-purple-700 dark:to-purple-950">
                <div className="max-w-7xl mx-auto animate-pulse text-white/70">Carregando…</div>
            </div>
        );
    }

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

                            {/* E-mail em destaque + acesso rápido para editar */}
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
                                        Membro desde {new Date(profileData.memberSince).toLocaleDateString("pt-BR")}
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
                            {profileData.achievementsCount}
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
                    {/* Tabs e Conteúdo */}
                    <div className="flex-1">
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
                                {/* Objetivo do nível */}
                                <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80">
                                    <h4 className="text-black dark:text-white font-semibold mb-3">
                                        Objetivo do nível
                                    </h4>
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
                                            style={{
                                                width: `${(profileData.currentXP / profileData.maxXP) * 100}%`,
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-300">
                                        {profileData.currentXP}/{profileData.maxXP} XP
                                    </p>
                                </div>

                                {/* Atividade recente */}
                                <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80">
                                    <h4 className="text-black dark:text-white font-semibold mb-3">
                                        Atividade Recente
                                    </h4>
                                    <div className="space-y-3">
                                        {/* Jogos */}
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

                                        {/* Conquistas */}
                                        <div className="pt-2 border-t border-white/10">
                                            <p className="text-sm text-white/70 mb-1">Conquistas</p>
                                            {completedMissions?.length ? (
                                                <ul className="text-sm text-white/90 list-disc list-inside space-y-1">
                                                    {completedMissions.slice(0, 3).map((m) => (
                                                        <li key={m.id}>
                                                            <span className="font-semibold">{m.title}</span>{" "}
                                                            <span className="text-white/60">— +{m.xpReward} XP</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-white/60">
                                                    Ainda sem conquistas. Bora nessas missões!
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Gêneros favoritos com edição */}
                                <div>
                                    <h3 className="text-2xl font-bold text-black dark:text-white mt-2 mb-3">
                                        Gêneros Favoritos
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
                                                        onClick={() =>
                                                            setProfileData((prev) => {
                                                                const list = [...prev.favoriteGenres];
                                                                list.splice(idx, 1);
                                                                return { ...prev, favoriteGenres: list };
                                                            })
                                                        }
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
                                            value={tempProfileData.newGenre || ""}
                                            onChange={(e) =>
                                                setTempProfileData((prev) => ({ ...prev, newGenre: e.target.value }))
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && tempProfileData.newGenre?.trim()) {
                                                    setProfileData((prev) => ({
                                                        ...prev,
                                                        favoriteGenres: [
                                                            ...(prev.favoriteGenres || []),
                                                            tempProfileData.newGenre.trim(),
                                                        ].slice(0, 8),
                                                    }));
                                                    setTempProfileData((prev) => ({ ...prev, newGenre: "" }));
                                                }
                                            }}
                                            className="w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
                                            placeholder="Ex.: RPG, Aventura…"
                                        />
                                        <button
                                            onClick={() => {
                                                if (tempProfileData.newGenre?.trim()) {
                                                    setProfileData((prev) => ({
                                                        ...prev,
                                                        favoriteGenres: [
                                                            ...(prev.favoriteGenres || []),
                                                            tempProfileData.newGenre.trim(),
                                                        ].slice(0, 8),
                                                    }));
                                                    setTempProfileData((prev) => ({ ...prev, newGenre: "" }));
                                                }
                                            }}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                        >
                                            Adicionar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* Jogos */}
                        {activeTab === "games" && (
                            <div>
                                <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
                                    Seus Jogos
                                </h3>
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
                                <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
                                    Conquistas
                                </h3>
                                {!Array.isArray(completedMissions) || completedMissions.length === 0 ? (
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
                                        {completedMissions.map((achievement) => (
                                            <div
                                                key={achievement.id}
                                                className="flex items-center gap-4 bg-green-500/20 border border-green-500/50 rounded-lg p-4"
                                            >
                                                <div className="text-3xl">{achievement.icon}</div>
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
                                                <div className="text-green-400 font-bold">
                                                    +{achievement.xpReward} XP
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Estatísticas */}
                        {activeTab === "stats" && (
                            <div>
                                <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
                                    Estatísticas Detalhadas
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                    style={{
                                                        width: `${(profileData.currentXP / profileData.maxXP) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                            <p className="text-black dark:text-white text-sm">
                                                {profileData.currentXP}/{profileData.maxXP} XP para o próximo nível
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-purple-800/20 rounded-lg p-6 border border-purple-900/80">
                                        <h4 className="text-black dark:text-white font-semibold mb-4">Resumo</h4>
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
                                                    {completedMissions.length}
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
                                                // DEMO: marca 1° jogo (em produção isso vem da tela de jogos)
                                                setProfileData((prev) => ({
                                                    ...prev,
                                                    gamesCount: (prev.gamesCount ?? 0) + 1,
                                                    totalPlaytimeHours: (prev.totalPlaytimeHours ?? 0) + 1,
                                                    recentGames: [
                                                        { name: "Jogo Demo", playedAt: new Date().toLocaleString("pt-BR") },
                                                        ...(prev.recentGames || []),
                                                    ].slice(0, 5),
                                                }));
                                                updateOnboarding({ firstGamePlayed: true });
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
                                                    onClick={() => {
                                                        completeMission(mission.id);
                                                    }}
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
                                        missionsFinishedToday ? (
                                            <div className="text-center py-8">
                                                <div className="text-4xl mb-4" aria-hidden>
                                                    🎉
                                                </div>
                                                <h4 className="text-black dark:text-white font-semibold mb-2">
                                                    Todas as missões concluídas!
                                                </h4>
                                                <p className="text-gray-200 text-sm">Novas missões chegam já já…</p>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="text-4xl mb-4" aria-hidden>
                                                    ⏳
                                                </div>
                                                <h4 className="text-black dark:text-white font-semibold mb-2">
                                                    Novas missões amanhã
                                                </h4>
                                                <p className="text-gray-200 text-sm">
                                                    Volte amanhã para continuar sua jornada!
                                                </p>
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
                                            onClick={openReadyPlayerMe}
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
                                        value={tempProfileData.name}
                                        onChange={(e) => setTempProfileData({ ...tempProfileData, name: e.target.value })}
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
                                        value={tempProfileData.about}
                                        onChange={(e) => setTempProfileData({ ...tempProfileData, about: e.target.value })}
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
                                        value={tempProfileData.email}
                                        onChange={(e) => setTempProfileData({ ...tempProfileData, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
                                        placeholder="voce@exemplo.com"
                                    />
                                </div>

                                <p className="text-xs text-black/60 dark:text-white/60">
                                    Dica: senha deve ser tratada no backend; não a salve em localStorage.
                                </p>
                            </div>

                            {/* Botões */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleSaveProfile}
                                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium"
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
