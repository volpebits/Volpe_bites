"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeContext";
import SlidePanel from "./login";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null); // Estado para armazenar o usuário logado
  const { theme, toggleTheme } = useTheme();

  // Função para verificar auth no localStorage
  const checkAuthStatus = () => {
    const savedAuth = localStorage.getItem("authData");
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      if (authData.isLoggedIn && authData.user) {
        setUser(authData.user);
      } else {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    setMounted(true);
    checkAuthStatus();

    // Listener para mudanças no localStorage (funciona entre abas)
    const handleStorageChange = (e) => {
      if (e.key === "authData") {
        checkAuthStatus();
      }
    };

    // Listener customizado para mudanças na mesma aba
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
    localStorage.removeItem("authData");
    setUser(null);
    setIsMenuOpen(false); // Fechar o dropdown após logout
    // Disparar evento customizado
    window.dispatchEvent(new CustomEvent("authStatusChanged"));
    alert("Você foi deslogado com sucesso!");
  };

  const handleProfile = () => {
    setIsMenuOpen(false); // Fechar o dropdown ao acessar o perfil
  };

  return (
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
            {/* Botão Dark/Light Mode */}
            {mounted && (
              <button
                onClick={() => {
                  console.log("🖱️ Botão clicado!");
                  toggleTheme();
                }}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-md"
                aria-label="Alternar tema"
              >
                {theme === "light" ? (
                  <svg
                    className="w-5 h-5 text-gray-700 dark:text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            )}

            {/* Mostrar nome do usuário logado */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <span className="text-black dark:text-white">Olá,</span>
                  <span className="text-black dark:text-white">
                    {user.username}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
                    <ul className="text-sm text-gray-700 dark:text-gray-300">
                      <li>
                        <Link
                          href="/profile"
                          className="block px-4 py-2"
                          onClick={handleProfile} // Fecha o dropdown ao acessar o perfil
                        >
                          Ver perfil
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout} // Fecha o dropdown ao realizar o logout
                          className="block px-4 py-2 w-full text-left text-red-500"
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

          {/* Menu Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white dark:text-gray-300 hover:text-green-500 focus:outline-none"
            >
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
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
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-green-200 dark:bg-green-800 text-black dark:text-white"
                      : "text-black dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Botões Mobile */}
              <div className="flex flex-col space-y-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                {/* Botão Dark/Light Mode Mobile */}
                {mounted && (
                  <button
                    onClick={toggleTheme}
                    className="flex items-center justify-center p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
                    aria-label="Alternar tema"
                  >
                    {theme === "light" ? (
                      <svg
                        className="w-5 h-5 text-gray-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {theme === "light" ? "Modo Escuro" : "Modo Claro"}
                    </span>
                  </button>
                )}

                {/* Seção Login/Usuário Mobile */}
                {user ? (
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    {/* Nome do usuário */}
                    <div className="flex items-center mb-3 pb-2 border-b border-gray-300 dark:border-gray-600">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {user.username}
                      </span>
                    </div>

                    {/* Botões de ação */}
                    <div className="flex space-x-2">
                      <Link
                        href="/profile"
                        onClick={() => {
                          handleProfile();
                          setIsMenuOpen(false);
                        }}
                        className="flex-1 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-2 text-sm transition-all duration-300"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 2a4 4 0 100 8 4 4 0 000-8zM3 18a7 7 0 1114 0v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Perfil
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-2 text-sm transition-all duration-300"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Sair
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="w-full bg-gradient-to-r from-green-400 to-green-700 text-white rounded-lg transition-all duration-300 px-4 py-3 text-center font-medium"
                  >
                    Fazer Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      <SlidePanel isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />
    </header>
  );
}
