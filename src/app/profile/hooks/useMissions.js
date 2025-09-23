"use client";

import * as React from "react";
import { useLocalStorage } from "./useLocalStorage";
import {
    gemColors,
    missionTemplates,
    resolveDescription,
    generateDailyMissionsExactXP,
} from "../utils/missions";
import { uid } from "../utils/uid";
import { applyXpGain } from "../utils/xp";

const STORAGE_KEYS = {
    daily: "volpe_daily",
    completed: "volpe_completed",
};

export function useMissions(profile, setProfile, onboarding, updateOnboarding) {
    // mesmas chaves do código antigo
    const [dailyMissions, setDailyMissions] = useLocalStorage(STORAGE_KEYS.daily, []);
    const [completedMissions, setCompletedMissions] = useLocalStorage(STORAGE_KEYS.completed, []);
    const [missionsFinishedToday, setMissionsFinishedToday] = React.useState(false);

    // carrega flags auxiliares
    React.useEffect(() => {
        if (typeof window === "undefined") return;
        setMissionsFinishedToday(localStorage.getItem("missionsFinishedToday") === "true");
    }, []);

    // espelha em "userdata" (daily)
    React.useEffect(() => {
        if (typeof window === "undefined") return;
        const auth = JSON.parse(localStorage.getItem("auth user") || "null");
        const users = JSON.parse(localStorage.getItem("userdata") || "{}");
        if (auth?.email) {
            const id = String(auth.email).trim().toLowerCase().replace(/[^\w.-]+/g, "_");
            users[id] = { ...(users[id] || {}), dailyMissions };
            localStorage.setItem("userdata", JSON.stringify(users));
        }
    }, [dailyMissions]);

    // espelha em "userdata" (completed)
    React.useEffect(() => {
        if (typeof window === "undefined") return;
        const auth = JSON.parse(localStorage.getItem("auth user") || "null");
        const users = JSON.parse(localStorage.getItem("userdata") || "{}");
        if (auth?.email) {
            const id = String(auth.email).trim().toLowerCase().replace(/[^\w.-]+/g, "_");
            users[id] = { ...(users[id] || {}), completedMissions };
            localStorage.setItem("userdata", JSON.stringify(users));
        }
    }, [completedMissions]);

    const regenerateAllMissions = React.useCallback(() => {
        if (!profile) return;
        const need = Math.max(0, (profile.maxXP ?? 0) - (profile.currentXP ?? 0));
        const list = generateDailyMissionsExactXP(need); // soma exata até o próximo nível
        setDailyMissions(list);
        setMissionsFinishedToday(false);
        if (typeof window !== "undefined") {
            localStorage.setItem("missionsFinishedToday", "false");
        }
    }, [profile, setDailyMissions]);

    const regenerateSpecificMission = (missionId) => {
        if (!profile) return;
        const current = Array.isArray(dailyMissions) ? dailyMissions : [];
        const others = current.filter((m) => m.id !== missionId);
        const need = Math.max(0, (profile.maxXP ?? 0) - (profile.currentXP ?? 0));
        const sumOthers = others.reduce((a, m) => a + (m.xpReward ?? 0), 0);
        const neededForThis = Math.max(0, need - sumOthers);

        const template = missionTemplates[Math.floor(Math.random() * missionTemplates.length)];
        const gemColor = gemColors[Math.floor(Math.random() * gemColors.length)];
        const icon = template.icons[Math.floor(Math.random() * template.icons.length)];

        const newMission = {
            id: uid(),
            title: template.title,
            description: resolveDescription(template),
            xpReward:
                neededForThis > 0
                    ? neededForThis
                    : Math.max(10, current.find((m) => m.id === missionId)?.xpReward ?? 10),
            gemColor,
            icon,
            type: template.type,
            completed: false,
        };

        setDailyMissions((prev) => prev.map((m) => (m.id === missionId ? newMission : m)));
    };

    const completeMission = (missionId) => {
        if (!profile || !setProfile) return;
        const mission = (dailyMissions || []).find((m) => m.id === missionId);
        if (!mission || mission.completed) return;

        const result = applyXpGain(profile, mission.xpReward);

        setProfile({
            ...profile,
            level: result.level,
            currentXP: result.currentXP,
            maxXP: result.maxXP,
            achievementsCount: (profile.achievementsCount ?? 0) + 1,
        });

        const completed = {
            ...mission,
            id: uid(),
            completedAt: "Agora mesmo",
            completed: true,
        };
        setCompletedMissions((prev) => [completed, ...(Array.isArray(prev) ? prev : [])]);

        const remaining = (dailyMissions || []).filter((m) => m.id !== missionId);
        setDailyMissions(remaining);

        if (result.leveled || remaining.length === 0) {
            setDailyMissions([]);
            setMissionsFinishedToday(true);
            if (typeof window !== "undefined") {
                localStorage.setItem("missionsFinishedToday", "true");
                const tomorrow = new Date();
                tomorrow.setHours(0, 0, 0, 0);
                tomorrow.setDate(tomorrow.getDate() + 1);
                localStorage.setItem("nextMissionsAt", tomorrow.toISOString().slice(0, 10));
            }
        }
    };

    // desbloqueia missões quando finalizar o onboarding (igual ao antigo)
    React.useEffect(() => {
        if (!profile || !onboarding) return;
        if (!onboarding.missionsUnlocked && onboarding.profileConfigured && onboarding.firstGamePlayed) {
            regenerateAllMissions();
            updateOnboarding?.({ missionsUnlocked: true });
        }
    }, [profile, onboarding, regenerateAllMissions, updateOnboarding]);

    return {
        dailyMissions: Array.isArray(dailyMissions) ? dailyMissions : [],
        completedMissions: Array.isArray(completedMissions) ? completedMissions : [],
        missionsFinishedToday,
        completeMission,
        regenerateSpecificMission,
        regenerateAllMissions,
    };
}
