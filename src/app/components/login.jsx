"use client";
import { useState, useEffect, useRef } from "react";
import {
  Eye,
  EyeOff,
  X,
  ArrowLeft,
  Camera,
  Wand2,
  Loader2,
} from "lucide-react";

const RECAPTCHA_SITE_KEY = "6LcEf6orAAAAAJHRrGuwH--ZGIKtMS340oAzjmYg";
const GOOGLE_CLIENT_ID = "324836051849-t7b5pb0ei572as0c9kfr37caik9gfja8.apps.googleusercontent.com";

/** se true, ao fazer logout também apaga a conta salva */
const DELETE_ACCOUNT_ON_LOGOUT = true;

/** ==== NOVO: chaves e helpers compatíveis com a página de Perfil ==== */
const AUTH_KEY = "auth user"; // { email, password, rememberMe? }
const USERS_KEY = "userdata"; // { [userId]: { ... } }
const computeUserId = (email) =>
  String(email || "guest")
    .trim()
    .toLowerCase()
    .replace(/[^\w.-]+/g, "_");

const readAuth = () => JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
const writeAuth = (obj) =>
  localStorage.setItem(AUTH_KEY, JSON.stringify(obj || null));
const readUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
const writeUsers = (map) =>
  localStorage.setItem(USERS_KEY, JSON.stringify(map || {}));

/** cria estrutura mínima p/ novo usuário (o Perfil completa com defaults) */
function makeUserRecord({ email, password = "", username = "", avatar = "" }) {
  return {
    email,
    password, // ⚠️ protótipo; em produção NUNCA salve senha em texto puro
    profile: {
      name: username,
      about: "",
      email,
      avatar,
      level: 1,
      currentXP: 0,
      maxXP: 100,
      achievementsCount: 0,
      gamesCount: 0,
      totalPlaytimeHours: 0,
      memberSince: new Date().toString(), // salva data e hora local
      recentGames: [],
      completedMissions: [],
    },
    onboarding: {
      profileConfigured: !!(username || avatar),
      firstGamePlayed: false,
      missionsUnlocked: false,
    },
    daily: [],
    dailyMeta: { availableAt: null },
  };
}

export default function SlidePanel({ isOpen, setIsOpen }) {
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register' | 'forgot-password'
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [recaptchaWidgetId, setRecaptchaWidgetId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    avatar: "",
  });

  const timers = useRef([]); // rastrear timeouts p/ limpar

  const isLogin = authMode === "login";
  const isRegister = authMode === "register";
  const isForgotPassword = authMode === "forgot-password";

  // --------- Google & Recaptcha boot ----------
  useEffect(() => {
    const initGoogleAuth = () => {
      if (window.google?.accounts) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCallback,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false,
            ux_mode: "popup",
            itp_support: true,
          });
          setIsGoogleLoaded(true);
        } catch (error) {
          console.warn("Erro ao inicializar Google OAuth:", error);
          setIsGoogleLoaded(true);
        }
      } else {
        timers.current.push(setTimeout(initGoogleAuth, 500));
      }
    };

    const initRecaptcha = () => {
      if (window.grecaptcha?.render) {
        setIsRecaptchaLoaded(true);
      } else {
        timers.current.push(setTimeout(initRecaptcha, 500));
      }
    };

    // GSI (Google Identity Services)
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogleAuth;
      script.onerror = () => setIsGoogleLoaded(false);
      document.head.appendChild(script);
    } else {
      initGoogleAuth();
    }

    // reCAPTCHA v2 (explicit)
    if (!window.grecaptcha) {
      const recaptchaScript = document.createElement("script");
      recaptchaScript.src =
        "https://www.google.com/recaptcha/api.js?render=explicit&hl=pt-BR";
      recaptchaScript.async = true;
      recaptchaScript.defer = true;
      recaptchaScript.onload = initRecaptcha;
      recaptchaScript.onerror = () => setIsRecaptchaLoaded(false);
      document.head.appendChild(recaptchaScript);
    } else {
      initRecaptcha();
    }

    return () => {
      try {
        window.google?.accounts?.id?.cancel();
      } catch { }
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  // render/reset do Recaptcha (apenas no registro)
  useEffect(() => {
    if (!isOpen) return; // painel fechado
    if (!isRecaptchaLoaded || !isRegister) return;
    const container = document.getElementById("recaptcha-container");
    if (!container) return;

    try {
      if (recaptchaWidgetId == null && !container.hasChildNodes()) {
        const id = window.grecaptcha.render("recaptcha-container", {
          sitekey: RECAPTCHA_SITE_KEY,
          callback: (token) => setRecaptchaToken(token),
          "expired-callback": () => setRecaptchaToken(null),
          "error-callback": () => setRecaptchaToken(null),
        });
        setRecaptchaWidgetId(id);
      } else if (recaptchaWidgetId != null) {
        window.grecaptcha.reset(recaptchaWidgetId);
        setRecaptchaToken(null);
      }
    } catch (error) {
      console.error("Erro ao renderizar/zerar reCAPTCHA:", error);
    }
  }, [isRecaptchaLoaded, isRegister, isOpen, recaptchaWidgetId]);

  // --------- Helpers de UI ----------
  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const openReadyPlayerMe = () => {
    window.open(
      "https://demo.readyplayer.me/avatar?frameApi",
      "_blank",
      "width=400,height=600"
    );
  };

  const generateAIAvatar = async () => {
    setIsGeneratingAI(true);
    timers.current.push(
      setTimeout(() => {
        const aiAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`;
        setPreviewImage(aiAvatarUrl);
        setFormData((prev) => ({ ...prev, avatar: aiAvatarUrl }));
        setIsGeneratingAI(false);
      }, 1200)
    );
  };

  // --------- Fluxo Google ----------
  const handleGoogleCallback = async (response) => {
    try {
      if (!response?.credential) {
        alert("Não foi possível autenticar com o Google (sem credential).");
        return;
      }
      const payload = JSON.parse(atob(response.credential.split(".")[1] || ""));
      if (!payload?.email) {
        alert("Não foi possível obter o e-mail do Google.");
        return;
      }

      const email = String(payload.email).trim().toLowerCase();
      const avatar = payload.picture || "";
      const name = payload.name || email.split("@")[0];
      const id = computeUserId(email);

      const users = readUsers();
      const exists = users[id];

      if (!exists) {
        users[id] = makeUserRecord({
          email,
          username: name,
          avatar,
          password: "",
        });
      } else {
        // atualiza dados básicos (sem sobrescrever progresso)
        users[id] = {
          ...users[id],
          email,
          profile: {
            ...(users[id].profile || {}),
            name: users[id].profile?.name || name,
            email,
            avatar: users[id].profile?.avatar || avatar,
          },
        };
      }
      writeUsers(users);

      // salva sessão
      writeAuth({ email, password: "", rememberMe });

      alert(`Login realizado com sucesso!\nBem-vindo, ${name}!`);
      setIsOpen(false);
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("Erro ao fazer login com Google. Tente novamente.");
    }
  };

  const handleGoogleLogin = () => {
    if (isGoogleLoaded && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((n) => {
          if (n.isNotDisplayed?.() || n.isSkippedMoment?.()) {
            console.log("Google prompt não foi exibido", n);
          }
        });
      } catch (error) {
        console.error("Erro ao iniciar login Google:", error);
        alert("Erro ao conectar com Google. Tente novamente.");
      }
    } else {
      alert(
        "Google OAuth ainda não foi carregado. Tente novamente em alguns segundos."
      );
    }
  };

  // --------- Validações simples ----------
  const isValidEmail = (email) =>
    /\S+@\S+\.\S+/.test(String(email || "").trim());
  const isStrongPassword = (pwd) => String(pwd || "").length >= 8;

  // --------- Fluxo Local (Cadastro / Login / Logout) ----------
  const register = () => {
    if (!isValidEmail(formData.email)) {
      alert("Informe um e-mail válido.");
      return;
    }
    if (!isStrongPassword(formData.password)) {
      alert("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (!recaptchaToken) {
      alert("Por favor, complete o reCAPTCHA");
      return;
    }

    const email = formData.email.trim().toLowerCase();
    const id = computeUserId(email);
    const users = readUsers();

    if (users[id]) {
      alert("Usuário já existe. Faça login!");
      setAuthMode("login");
      return;
    }

    users[id] = makeUserRecord({
      email,
      password: formData.password,
      username: formData.username,
      avatar: formData.avatar || previewImage || "",
    });
    writeUsers(users);

    // cria sessão
    writeAuth({ email, password: formData.password, rememberMe });

    // cria cópia rápida pro perfil atual (compatível com /profile)
    localStorage.setItem("volpe_profile", JSON.stringify(users[id].profile));

    alert("Cadastro realizado e login efetuado!");
    setIsOpen(false);
    window.location.href = "/profile"; // 👈 vai direto pro perfil
  };

  const login = () => {
    if (!isValidEmail(formData.email)) {
      alert("Informe um e-mail válido.");
      return;
    }
    if (!formData.password) {
      alert("Digite sua senha.");
      return;
    }

    const email = formData.email.trim().toLowerCase();
    const id = computeUserId(email);
    const users = readUsers();

    const record = users[id];
    if (!record) {
      alert("Usuário não encontrado. Cadastre-se.");
      setAuthMode("register");
      return;
    }
    if ((record.password || "") !== formData.password) {
      alert("Senha incorreta!");
      return;
    }

    // sessão
    writeAuth({ email, password: formData.password, rememberMe });

    // cópia rápida pro perfil atual
    localStorage.setItem("volpe_profile", JSON.stringify(record.profile));

    alert(`Bem-vindo, ${record.profile?.name || email}`);
    setIsOpen(false);
    window.location.href = "/profile"; // 👈 vai direto pro perfil
  };

  const handleForgotPassword = () => setAuthMode("forgot-password");
  const handleBackToLogin = () => {
    setAuthMode("login");
    setRecaptchaToken(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) return register();
    if (isLogin) return login();
    if (isForgotPassword) {
      if (!isValidEmail(formData.email)) {
        alert("Digite um e-mail válido para recuperação");
        return;
      }
      alert("Se este e-mail existir, enviaremos instruções para redefinição.");
      setAuthMode("login");
    }
  };

  const getTitle = () =>
    isLogin ? "Log in" : isRegister ? "Crie uma conta" : "Recuperar senha";
  const getButtonText = () =>
    isLogin
      ? "Entrar"
      : isRegister
        ? "Crie sua conta!"
        : "Enviar link de recuperação";

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md transition-opacity duration-300"

        />
      )}

      <div
        className={`fixed inset-0 z-50 flex font-sans transition-transform duration-500 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div
          className="hidden md:block md:flex-1"
          onClick={() => setIsOpen(false)}
        />
        <div className="relative w-full md:max-w-[520px] ml-auto h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl overflow-y-auto">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          >
            <X size={20} />
          </button>

          <div className="w-full max-w-md mx-auto mt-10 space-y-10">
            <div className="flex items-center space-x-4">
              {(isRegister || isForgotPassword) && (
                <button
                  onClick={handleBackToLogin}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <h2 className="text-3xl font-bold text-green-500">
                {getTitle()}
              </h2>
            </div>

            {isForgotPassword && (
              <p className="text-gray-600 dark:text-white text-sm">
                Digite seu e-mail e enviaremos um link para redefinir sua senha.
              </p>
            )}
          </div>

          {/* Use form para habilitar Enter */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md mx-auto mt-10 space-y-10"
          >
            <div className="space-y-6">
              {/* Perfil no registro */}
              {isRegister && (
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mx-auto border-4 border-green-500">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg
                            className="w-8 h-8"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        window.open(
                          "https://demo.readyplayer.me/avatar?frameApi",
                          "_blank",
                          "width=400,height=600"
                        )
                      }
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
                    >
                      <Camera size={16} /> 3D Avatar
                    </button>

                    <button
                      type="button"
                      onClick={generateAIAvatar}
                      disabled={isGeneratingAI}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white rounded-lg text-sm transition-colors"
                    >
                      {isGeneratingAI ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Wand2 size={16} />
                      )}{" "}
                      IA Random
                    </button>
                  </div>
                </div>
              )}

              {/* Usuário (registro) */}
              {isRegister && (
                <div>
                  <label className="block text-sm text-gray-600 dark:text-white mb-1">
                    Usuário
                  </label>
                  <input
                    type="text"
                    placeholder="Digite seu usuário"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    className="w-full border border-gray-300 text-black px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                  />
                </div>
              )}

              {/* E-mail */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-white mb-1">
                  Endereço de e-mail
                </label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full border border-gray-300 text-black px-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                />
              </div>

              {/* Senha (exceto recuperação) */}
              {!isForgotPassword && (
                <div>
                  <label className="block text-sm text-gray-600 dark:text-white mb-1">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="w-full border border-gray-300 text-black px-4 py-3 pr-10 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-black absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {isRegister && (
                    <p className="text-xs text-gray-500 dark:text-white mt-1">
                      Use 8 ou mais caracteres com pelo menos uma letra
                      maiúscula, minúscula, número e símbolo.
                    </p>
                  )}
                  {isLogin && (
                    <div className="w-full flex justify-between items-center mt-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-600 dark:text-white">
                          Lembrar-me
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-green-500 hover:underline transition-all duration-200 text-sm"
                      >
                        Esqueceu sua senha?
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* reCAPTCHA (registro) */}
              {isRegister && (
                <>
                  <div className="mt-4">
                    <div
                      id="recaptcha-container"
                      className="flex justify-center"
                    >
                      {!isRecaptchaLoaded && (
                        <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-center text-gray-500">
                          Carregando reCAPTCHA...
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-black dark:text-white">
                    Ao criar uma conta, você concorda com os nossos{" "}
                    <a href="#" className="text-green-500 underline">
                      Termos de uso
                    </a>{" "}
                    e{" "}
                    <a href="#" className="text-green-500 underline">
                      Política de Privacidade
                    </a>
                    .
                  </p>
                </>
              )}

              {/* Botão principal */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-400 to-green-700 text-white py-4 rounded-full mt-4 transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                {getButtonText()}
              </button>

              {/* OU */}
              {!isForgotPassword && (
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-gray-300 w-full"></div>
                  <span className="px-4 text-gray-500 text-sm">OU</span>
                  <div className="border-t border-gray-300 w-full"></div>
                </div>
              )}

              {/* Google */}
              {!isForgotPassword && (
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={!isGoogleLoaded}
                  className={`w-full flex items-center justify-center gap-3 bg-white border-2 border-green-500 text-gray-700 py-4 rounded-full transition-all duration-300 hover:bg-gray-50 hover:shadow-md ${!isGoogleLoaded
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105"
                    }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {isGoogleLoaded
                    ? isLogin
                      ? "Entrar com Google"
                      : "Cadastrar com Google"
                    : "Carregando Google..."}
                </button>
              )}

              {/* Alternar login/cadastro */}
              {!isForgotPassword && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-white text-center">
                    {isLogin ? "Novo por aqui?" : "Já possui uma conta?"}{" "}
                    <button
                      type="button"
                      onClick={() =>
                        setAuthMode((prev) =>
                          prev === "login" ? "register" : "login"
                        )
                      }
                      className="text-green-500 hover:underline transition-all duration-200"
                    >
                      {isLogin
                        ? "Faça seu cadastro gratuitamente!"
                        : "Faça o log-in!"}
                    </button>
                  </p>
                </div>
              )}

              {/* Voltar ao login (recuperação) */}
              {isForgotPassword && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-white">
                    Lembrou da sua senha?{" "}
                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className="text-green-500 hover:underline transition-all duration-200"
                    >
                      Voltar ao login
                    </button>
                  </p>
                </div>
              )}

              {/* Exemplo para testar: */}
              {/* <button onClick={handleLogout} type="button" className="mt-6 underline text-sm text-red-600">
                Sair (e {DELETE_ACCOUNT_ON_LOGOUT ? 'apagar conta' : 'manter conta'})
              </button> */}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
