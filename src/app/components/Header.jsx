'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTheme } from './ThemeContext'
import SlidePanel from './login'

export default function Header() {
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isLoginOpen, setIsLoginOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const { theme, toggleTheme } = useTheme()

    // Verifica se está no cliente para evitar problemas de hidratação
    useEffect(() => {
        setMounted(true)
    }, [])

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/games', label: 'Jogos' },
        { href: '/news', label: 'Notícias' },
        { href: '/about', label: 'Sobre' }
    ]

    return (
        <header className="bg-purple-950 shadow-md">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo com imagem */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center space-x-2">
                            <Image
                                src="/icons/logo2.png"
                                alt="Logo"
                                width={48}
                                height={48}
                                className="rounded"
                            />
                            <span className="text-3xl font-bold text-green-500">
                                Volpe
                            </span>
                        </Link>
                    </div>

                    {/* Links de navegação - Desktop */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === link.href
                                        ? 'text-green-500 border-2 border-green-500'
                                        : 'text-white dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Botões - Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Botão Dark/Light Mode */}
                        {mounted && (
                            <button
                                onClick={() => {
                                    console.log('🖱️ Botão clicado!')
                                    toggleTheme()
                                }}
                                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-md"
                                aria-label="Alternar tema"
                            >
                                {theme === 'light' ? (
                                    // Ícone da lua (dark mode)
                                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                ) : (
                                    // Ícone do sol (light mode)
                                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                    </svg>
                                )}

                            </button>
                        )}

                        {/* Botão de Login */}
                        <button
                            onClick={() => setIsLoginOpen(true)}
                            className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-700 text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md"
                        >
                            Login
                        </button>
                    </div>

                    {/* Botão Menu Mobile */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white dark:text-gray-300 hover:text-green-500 focus:outline-none"
                        >
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Menu Mobile */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 dark:bg-gray-800 rounded-md mt-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${pathname === link.href
                                        ? 'bg-green-200 dark:bg-green-800 text-black dark:text-white'
                                        : 'text-black dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* Botões Mobile */}
                            <div className="flex items-center space-x-2 pt-2">
                                {/* Botão Dark/Light Mode Mobile */}
                                {mounted && (
                                    <button
                                        onClick={toggleTheme}
                                        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 px-4 py-2 hover:scale-105 hover:shadow-md"
                                        aria-label="Alternar tema"
                                    >
                                        {theme === 'light' ? (
                                            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                )}

                                {/* Botão Login Mobile */}
                                <button
                                    onClick={() => setIsLoginOpen(true)}
                                    className="flex-1 bg-gradient-to-r from-green-400 to-green-700 text-white rounded-lg transition-all duration-300 px-4 py-2 hover:scale-105 hover:shadow-md"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
            <SlidePanel isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
        </header>
    )
}