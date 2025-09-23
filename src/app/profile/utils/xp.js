// src/app/profile/utils/xp.js

export const LEVEL_BASE_XP = 100;

export function xpForLevel(lvl) {
    return LEVEL_BASE_XP + (lvl - 1) * 20;
}

export function applyXpGain(profile, gained) {
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

export function createDefaultProfile() {
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
        favoriteGenres: [],
    };
}
