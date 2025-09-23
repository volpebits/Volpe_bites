"use client";

import * as React from "react";

function safeParse(json, fallback) {
    try {
        return JSON.parse(json);
    } catch {
        return fallback;
    }
}

export function useLocalStorage(key, initialValue) {
    const getInitial = React.useCallback(() => {
        if (typeof window === "undefined") {
            return typeof initialValue === "function" ? initialValue() : initialValue;
        }
        const raw = window.localStorage.getItem(key);
        if (raw == null) {
            const v = typeof initialValue === "function" ? initialValue() : initialValue;
            window.localStorage.setItem(key, JSON.stringify(v));
            return v;
        }
        return safeParse(raw, typeof initialValue === "function" ? initialValue() : initialValue);
    }, [key, initialValue]);

    const [value, setValue] = React.useState(getInitial);

    React.useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
            /* quota / modo privado — ignora */
        }
    }, [key, value]);

    return [value, setValue];
}
