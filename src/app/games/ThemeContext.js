'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => { }
})

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const savedTheme = localStorage.getItem('theme')
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        const initialTheme = savedTheme || systemTheme
        
        console.log('🔍 Tema inicial:', initialTheme)
        setTheme(initialTheme)
    }, [])

    useEffect(() => {
        if (!mounted) return

        console.log('🎨 Aplicando tema:', theme)
        console.log('📄 Classes antes:', document.documentElement.className)

        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }

        console.log('📄 Classes depois:', document.documentElement.className)
        localStorage.setItem('theme', theme)
    }, [theme, mounted])

    const toggleTheme = () => {
        console.log('🔄 Toggle clicado! Tema atual:', theme)
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light'
            console.log('🔄 Novo tema será:', newTheme)
            return newTheme
        })
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    return context
}