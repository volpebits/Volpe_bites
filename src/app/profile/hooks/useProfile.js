"use client";

import * as React from "react";
import { useLocalStorage } from "./useLocalStorage";
import { createDefaultProfile } from "../utils/xp";

const STORAGE_KEYS = {
    profile: "volpe_profile",
    onboarding: "volpe_onboarding",
};

const DEFAULT_ONBOARDING = {
    profileConfigured: false,
    firstGamePlayed: false,
    missionsUnlocked: false,
};

export function useProfile() {
    // usa as mesmas chaves do código antigo
    const [profile, setProfile] = useLocalStorage(STORAGE_KEYS.profile, createDefaultProfile);
    const [onboarding, setOnboarding] = useLocalStorage(STORAGE_KEYS.onboarding, DEFAULT_ONBOARDING);

    const updateProfile = (patch) => setProfile((prev) => ({ ...prev, ...patch }));
    const updateOnboarding = (patch) => setOnboarding((prev) => ({ ...prev, ...patch }));

    // (opcional) migra chaves antigas genéricas -> volpe_* se existirem
    React.useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            const legacyProfile = localStorage.getItem("profile");
            const legacyOnb = localStorage.getItem("onboarding");
            if (legacyProfile && !localStorage.getItem(STORAGE_KEYS.profile)) {
                localStorage.setItem(STORAGE_KEYS.profile, legacyProfile);
                localStorage.removeItem("profile");
            }
            if (legacyOnb && !localStorage.getItem(STORAGE_KEYS.onboarding)) {
                localStorage.setItem(STORAGE_KEYS.onboarding, legacyOnb);
                localStorage.removeItem("onboarding");
            }
        } catch { }
    }, []);

    // espelha em "userdata" (igual você fazia)
    React.useEffect(() => {
        if (!profile || typeof window === "undefined") return;
        const auth = JSON.parse(localStorage.getItem("auth user") || "null");
        const users = JSON.parse(localStorage.getItem("userdata") || "{}");
        if (auth?.email) {
            const id = String(auth.email).trim().toLowerCase().replace(/[^\w.-]+/g, "_");
            users[id] = { ...(users[id] || {}), profile };
            localStorage.setItem("userdata", JSON.stringify(users));
        }
    }, [profile]);

    return { profile, updateProfile, onboarding, updateOnboarding };
}
