// src/app/profile/utils/storage.js
export const STORAGE_KEYS = {
    profile: "volpe_profile",
    daily: "volpe_daily",
    completed: "volpe_completed",
    onboarding: "volpe_onboarding",
};

// pega auth e users (sempre tolerante)
export function getAuthUser() {
    try { return JSON.parse(localStorage.getItem("auth user") || "null"); } catch { return null; }
}
export function getUsersMap() {
    try { return JSON.parse(localStorage.getItem("userdata") || "{}"); } catch { return {}; }
}
export function setUsersMap(map) {
    localStorage.setItem("userdata", JSON.stringify(map || {}));
}

// id do usuário espelho no `userdata`
export function userIdFromAuth(auth) {
    return String(auth?.email || "")
        .trim()
        .toLowerCase()
        .replace(/[^\w.-]+/g, "_");
}

/** PROFILE **/
export function readProfile() {
    try {
        const auth = getAuthUser();
        const id = userIdFromAuth(auth);
        const users = getUsersMap();
        if (id && users[id]?.profile) return users[id].profile;

        const raw = localStorage.getItem(STORAGE_KEYS.profile);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function writeProfile(profileObj) {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profileObj));
    const auth = getAuthUser();
    const id = userIdFromAuth(auth);
    if (id) {
        const users = getUsersMap();
        users[id] = { ...(users[id] || {}), profile: profileObj };
        setUsersMap(users);
    }
}

/** DAILY MISSIONS **/
export function readDaily() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.daily) || "[]"); } catch { return []; }
}
export function writeDaily(dailyMissions) {
    localStorage.setItem(STORAGE_KEYS.daily, JSON.stringify(dailyMissions || []));
    const auth = getAuthUser();
    const id = userIdFromAuth(auth);
    if (id) {
        const users = getUsersMap();
        users[id] = { ...(users[id] || {}), dailyMissions };
        setUsersMap(users);
    }
}

/** COMPLETED **/
export function readCompleted() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.completed) || "[]"); } catch { return []; }
}
export function writeCompleted(completedMissions) {
    localStorage.setItem(STORAGE_KEYS.completed, JSON.stringify(completedMissions || []));
    const auth = getAuthUser();
    const id = userIdFromAuth(auth);
    if (id) {
        const users = getUsersMap();
        users[id] = { ...(users[id] || {}), completedMissions };
        setUsersMap(users);
    }
}

/** ONBOARDING **/
export function readOnboarding() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.onboarding) || "null"); } catch { return null; }
}
export function writeOnboarding(obj) {
    localStorage.setItem(STORAGE_KEYS.onboarding, JSON.stringify(obj || {}));
}

/** Flags das missões do dia (mesmas do seu código) **/
export function readMissionsFlags() {
    return {
        missionsFinishedToday: localStorage.getItem("missionsFinishedToday") === "true",
        nextMissionsAt: localStorage.getItem("nextMissionsAt") || null,
    };
}
export function writeMissionsFlags({ missionsFinishedToday, nextMissionsAt }) {
    if (missionsFinishedToday != null)
        localStorage.setItem("missionsFinishedToday", missionsFinishedToday ? "true" : "false");
    if (nextMissionsAt != null)
        localStorage.setItem("nextMissionsAt", nextMissionsAt);
}

/** (Opcional) Migração de chaves antigas p/ volpe_* */
export function migrateOldKeysToVolpe() {
    try {
        const pairs = [
            ["profile", "volpe_profile"],
            ["dailyMissions", "volpe_daily"],
            ["completedMissions", "volpe_completed"],
            ["onboarding", "volpe_onboarding"],
        ];
        for (const [oldK, newK] of pairs) {
            const v = localStorage.getItem(oldK);
            if (v && !localStorage.getItem(newK)) {
                localStorage.setItem(newK, v);
                localStorage.removeItem(oldK);
            }
        }
    } catch { }
}
