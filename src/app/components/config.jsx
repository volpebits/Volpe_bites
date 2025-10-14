"use client";
import { useState, useEffect } from "react";
import {
  X,
  Type,
  Eye,
  Volume2,
  Palette,
  Zap,
  Save,
  RotateCcw,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";

export default function SettingsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("appearance");
  const [settings, setSettings] = useState({
    // Aparência
    theme: "auto", // auto, light, dark
    fontSize: "medium", // small, medium, large, xlarge

    // Acessibilidade
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    focusIndicator: true,
    vlibras: false,

    // Som
    soundEffects: true,
    volume: 70,

    // Avançado
    autoSave: true,
    notifications: true,
    animations: true,
    compactMode: false,
  });

  // Carrega configurações do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("volpe_settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  // Salva configurações
  const handleSave = () => {
    localStorage.setItem("volpe_settings", JSON.stringify(settings));

    // Aplica as configurações
    applySettings(settings);

    // Feedback visual
    alert("Configurações salvas com sucesso!");
    onClose();
  };

  // Aplica configurações no documento
  const applySettings = (config) => {
    const root = document.documentElement;

    // Tamanho da fonte
    const fontSizes = {
      small: "14px",
      medium: "16px",
      large: "18px",
      xlarge: "20px",
    };
    root.style.fontSize = fontSizes[config.fontSize];

    // Alto contraste
    if (config.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Reduzir movimento
    if (config.reducedMotion) {
      root.style.setProperty("--animation-duration", "0.01ms");
    } else {
      root.style.removeProperty("--animation-duration");
    }

    // Tema
    if (config.theme === "dark") {
      root.classList.add("dark");
    } else if (config.theme === "light") {
      root.classList.remove("dark");
    } else {
      // Auto - detecta preferência do sistema
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }

    // VLibras
    toggleVLibras(config.vlibras);
  };

  // Função para ativar/desativar VLibras
  const toggleVLibras = (enable) => {
    if (enable) {
      // Verifica se o script já foi adicionado
      if (!document.querySelector('script[src*="vlibras"]')) {
        // Adiciona o script do VLibras
        const script = document.createElement("script");
        script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
        script.async = true;
        script.onload = () => {
          new window.VLibras.Widget("https://vlibras.gov.br/app");
        };
        document.body.appendChild(script);
      } else {
        // Se já existe, apenas mostra o widget
        const vlibrasDiv = document.querySelector("[vw]");
        if (vlibrasDiv) {
          vlibrasDiv.style.display = "block";
        }
      }
    } else {
      // Esconde o widget do VLibras
      const vlibrasDiv = document.querySelector("[vw]");
      if (vlibrasDiv) {
        vlibrasDiv.style.display = "none";
      }
    }
  };

  // Reseta para padrão
  const handleReset = () => {
    if (confirm("Tem certeza que deseja restaurar as configurações padrão?")) {
      const defaultSettings = {
        theme: "auto",
        fontSize: "medium",
        highContrast: false,
        reducedMotion: false,
        screenReader: false,
        focusIndicator: true,
        soundEffects: true,
        volume: 70,
        autoSave: true,
        notifications: true,
        animations: true,
        compactMode: false,
      };
      setSettings(defaultSettings);
      applySettings(defaultSettings);
    }
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  const tabs = [
    { id: "appearance", label: "Aparência", icon: Palette },
    { id: "accessibility", label: "Acessibilidade", icon: Eye },
    { id: "sound", label: "Som", icon: Volume2 },
    { id: "advanced", label: "Avançado", icon: Zap },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-purple-200 dark:border-purple-500/30 flex flex-col">
        {/* Header - Responsivo */}
        <div className="bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700 p-4 sm:p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1">
                Configurações
              </h2>
              <p className="text-purple-100 text-xs sm:text-sm">
                Personalize sua experiência
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/10 backdrop-blur-sm rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
              aria-label="Fechar"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          {/* Sidebar com tabs - Horizontal em mobile, vertical em desktop */}
          <div className="w-full md:w-48 bg-gray-50 dark:bg-gray-900 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-2 sm:p-4 flex-shrink-0">
            <nav className="flex md:flex-col gap-1 sm:gap-2 overflow-x-auto md:overflow-x-visible">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-colors whitespace-nowrap flex-shrink-0 md:w-full ${
                      activeTab === tab.id
                        ? "bg-purple-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm font-medium">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Conteúdo - Com scroll independente */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-0">
            {/* Aparência */}
            {activeTab === "appearance" && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-purple-950 dark:text-white mb-3 sm:mb-4">
                    Aparência
                  </h3>

                  {/* Tema - Grid responsivo */}
                  <div className="mb-4 sm:mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                      Tema
                    </label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {[
                        { value: "light", label: "Claro", icon: Sun },
                        { value: "dark", label: "Escuro", icon: Moon },
                        { value: "auto", label: "Auto", icon: Monitor },
                      ].map((theme) => {
                        const Icon = theme.icon;
                        return (
                          <button
                            key={theme.value}
                            onClick={() => updateSetting("theme", theme.value)}
                            className={`flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
                              settings.theme === theme.value
                                ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                                : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                            }`}
                          >
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="text-xs sm:text-sm font-medium">
                              {theme.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tamanho da fonte */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                      Tamanho da fonte
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: "small", label: "Pequeno", size: "14px" },
                        { value: "medium", label: "Médio", size: "16px" },
                        { value: "large", label: "Grande", size: "18px" },
                        {
                          value: "xlarge",
                          label: "Extra Grande",
                          size: "20px",
                        },
                      ].map((size) => (
                        <label
                          key={size.value}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors min-h-[48px] ${
                            settings.fontSize === size.value
                              ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="fontSize"
                            value={size.value}
                            checked={settings.fontSize === size.value}
                            onChange={(e) =>
                              updateSetting("fontSize", e.target.value)
                            }
                            className="w-4 h-4 text-purple-600 flex-shrink-0"
                          />
                          <span style={{ fontSize: size.size }}>
                            {size.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Acessibilidade */}
            {activeTab === "accessibility" && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-purple-950 dark:text-white mb-3 sm:mb-4">
                    Acessibilidade
                  </h3>

                  <div className="space-y-3 sm:space-y-4">
                    {[
                      {
                        key: "highContrast",
                        label: "Alto contraste",
                        description:
                          "Aumenta o contraste das cores para melhor visibilidade",
                      },
                      {
                        key: "reducedMotion",
                        label: "Reduzir movimento",
                        description:
                          "Minimiza animações e efeitos de movimento",
                      },
                      {
                        key: "screenReader",
                        label: "Otimizar para leitores de tela",
                        description:
                          "Melhora a navegação com tecnologias assistivas",
                      },
                      {
                        key: "focusIndicator",
                        label: "Indicador de foco aprimorado",
                        description:
                          "Destaca elementos em foco durante navegação por teclado",
                      },
                    ].map((option) => (
                      <div
                        key={option.key}
                        className="flex items-start justify-between gap-3 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-white mb-1">
                            {option.label}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {option.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={settings[option.key]}
                            onChange={(e) =>
                              updateSetting(option.key, e.target.checked)
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Som */}
            {activeTab === "sound" && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-purple-950 dark:text-white mb-3 sm:mb-4">
                    Som
                  </h3>

                  {/* Efeitos sonoros */}
                  <div className="flex items-start justify-between gap-3 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-3 sm:mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-white mb-1">
                        Efeitos sonoros
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Sons de cliques, notificações e interações
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={settings.soundEffects}
                        onChange={(e) =>
                          updateSetting("soundEffects", e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  {/* Volume */}
                  <div className="p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <label className="block font-medium text-sm sm:text-base text-gray-900 dark:text-white mb-3">
                      Volume: {settings.volume}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.volume}
                      onChange={(e) =>
                        updateSetting("volume", parseInt(e.target.value))
                      }
                      disabled={!settings.soundEffects}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Avançado */}
            {activeTab === "advanced" && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-purple-950 dark:text-white mb-3 sm:mb-4">
                    Avançado
                  </h3>

                  <div className="space-y-3 sm:space-y-4">
                    {[
                      {
                        key: "autoSave",
                        label: "Salvamento automático",
                        description: "Salva suas alterações automaticamente",
                      },
                      {
                        key: "notifications",
                        label: "Notificações",
                        description:
                          "Receba notificações sobre novos jogos e atualizações",
                      },
                      {
                        key: "animations",
                        label: "Animações avançadas",
                        description:
                          "Ativa efeitos visuais e transições elaboradas",
                      },
                      {
                        key: "compactMode",
                        label: "Modo compacto",
                        description:
                          "Reduz espaçamentos para exibir mais conteúdo",
                      },
                    ].map((option) => (
                      <div
                        key={option.key}
                        className="flex items-start justify-between gap-3 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-white mb-1">
                            {option.label}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {option.description}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={settings[option.key]}
                            onChange={(e) =>
                              updateSetting(option.key, e.target.checked)
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Responsivo */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[44px] sm:min-h-0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restaurar padrão</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center px-4 py-2.5 sm:py-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[44px] sm:min-h-0"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 px-6 py-2.5 sm:py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium transition-all shadow-lg text-sm sm:text-base min-h-[44px] sm:min-h-0"
            >
              <Save className="w-4 h-4" />
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
