"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeContext";
import SlidePanel from "./login";
import SettingsModal from "./config";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuMobileOpen, setIsMenuMobileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const { theme, toggleTheme } = useTheme();

  const checkAuthStatus = () => {
    const savedProfile = localStorage.getItem("volpe_profile");
    if (savedProfile) {
      try {
        const profileData = JSON.parse(savedProfile);
        if (profileData?.name) {
          setUser(profileData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Erro ao ler volpe_profile:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    setMounted(true);
    checkAuthStatus();

    const handleStorageChange = (e) => {
      if (e.key === "volpe_profile") {
        checkAuthStatus();
      }
    };

    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authStatusChanged", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authStatusChanged", handleAuthChange);
    };
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/games", label: "Jogos" },
    { href: "/news", label: "Notícias" },
    { href: "/about", label: "Sobre" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("volpe_profile");
    setUser(null);
    setIsMenuOpen(false);
    setIsMenuMobileOpen(false);
    window.dispatchEvent(new CustomEvent("authStatusChanged"));
    alert("Você foi deslogado com sucesso!");
  };

  const handleProfile = () => {
    setIsMenuOpen(false);
    setIsMenuMobileOpen(false);
  };

  const handleOpenSettings = () => {
    setIsMenuOpen(false);
    setIsMenuMobileOpen(false);
    setShowSettings(true);
  };

  const handleLinkClick = () => {
    setIsMenuMobileOpen(false);
  };

  return (
    <>
      <header className="bg-purple-950 shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-green-500">Volpe</span>
              </Link>
            </div>

            {/* Links de navegação - Desktop */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "text-green-500 border-2 border-green-500"
                        : "text-white dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Botões - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Botão de Configurações */}
              <button
                onClick={handleOpenSettings}
                className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                title="Configurações"
              >
                <span className="text-xl">⚙️</span>
              </button>

              {/* Mostrar nome do usuário logado */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    <span className="text-black dark:text-white">Olá,</span>
                    <span className="text-black dark:text-white">
                      {user.name}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-50">
                      <ul className="text-sm text-gray-700 dark:text-gray-300">
                        <li>
                          <Link
                            href="/profile"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={handleProfile}
                          >
                            Ver perfil
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="block px-4 py-2 w-full text-left text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-700 text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  Login
                </button>
              )}
            </div>

            {/* Botão Hambúrguer - Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuMobileOpen(!isMenuMobileOpen)}
                className="p-2 rounded-lg text-white hover:bg-purple-900 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuMobileOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Menu Mobile */}
          {isMenuMobileOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-2">
                {/* Links de navegação */}
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "text-green-500 border-2 border-green-500"
                        : "text-white dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
                    }`}
                    onClick={handleLinkClick}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Separador */}
                <div className="border-t border-purple-800 my-2"></div>

                {/* Botão de Configurações */}
                <button
                  onClick={handleOpenSettings}
                  className="px-3 py-2 rounded-lg text-white hover:text-green-500 dark:hover:text-green-400 text-left text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  <span>⚙️</span>
                  <span>Configurações</span>
                </button>

                {/* Botão de Login ou Menu do Usuário */}
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="px-3 py-2 rounded-lg text-white hover:text-green-500 dark:hover:text-green-400 text-left text-sm font-medium transition-colors"
                      onClick={handleLinkClick}
                    >
                      Olá, {user.name}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-2 rounded-lg text-red-400 hover:text-red-300 text-left text-sm font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsLoginOpen(true);
                      setIsMenuMobileOpen(false);
                    }}
                    className="px-3 py-2 bg-gradient-to-r from-green-400 to-green-700 text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md text-sm font-medium"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>

        <SlidePanel isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
      </header>

      {/* Modal de Configurações */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}
