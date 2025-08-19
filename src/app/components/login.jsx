'use client';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, X, ArrowLeft, Camera, Wand2, Loader2 } from 'lucide-react';

// Seu Google Client ID
const GOOGLE_CLIENT_ID = "306605130597-nkfa413h7gsk17nhja0rc7dvnqp95fqs.apps.googleusercontent.com";

// Substitua pela sua chave do reCAPTCHA v2
const RECAPTCHA_SITE_KEY = "6LcEf6orAAAAAJHRrGuwH--ZGIKtMS340oAzjmYg";

export default function SlidePanel({ isOpen, setIsOpen }) {
    const [authMode, setAuthMode] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
    const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState(null);

    const [previewImage, setPreviewImage] = useState(null);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    const isLogin = authMode === 'login';
    const isRegister = authMode === 'register';
    const isForgotPassword = authMode === 'forgot-password';

    // Inicializar Google OAuth e reCAPTCHA quando o componente montar
    useEffect(() => {
        const initGoogleAuth = () => {
            if (window.google && window.google.accounts) {
                try {
                    window.google.accounts.id.initialize({
                        client_id: GOOGLE_CLIENT_ID,
                        callback: handleGoogleCallback,
                        auto_select: false,
                        cancel_on_tap_outside: true,
                        use_fedcm_for_prompt: false,
                        ux_mode: 'popup',
                        itp_support: true,
                    });
                    setIsGoogleLoaded(true);
                    console.log('Google OAuth inicializado com sucesso');
                } catch (error) {
                    console.warn('Erro ao inicializar Google OAuth:', error);
                    setIsGoogleLoaded(true);
                }
            } else {
                setTimeout(initGoogleAuth, 500);
            }
        };

        const initRecaptcha = () => {
            if (window.grecaptcha && window.grecaptcha.render) {
                setIsRecaptchaLoaded(true);
                console.log('reCAPTCHA inicializado com sucesso');
            } else {
                setTimeout(initRecaptcha, 500);
            }
        };

        // Carregar o script do Google se não estiver carregado
        if (!window.google) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = initGoogleAuth;
            script.onerror = () => {
                console.error('Falha ao carregar script do Google');
                setIsGoogleLoaded(false);
            };
            document.head.appendChild(script);
        } else {
            initGoogleAuth();
        }

        // Carregar reCAPTCHA se não estiver carregado
        if (!window.grecaptcha) {
            const recaptchaScript = document.createElement('script');
            recaptchaScript.src = 'https://www.google.com/recaptcha/api.js';
            recaptchaScript.async = true;
            recaptchaScript.defer = true;
            recaptchaScript.onload = initRecaptcha;
            recaptchaScript.onerror = () => {
                console.error('Falha ao carregar reCAPTCHA');
                setIsRecaptchaLoaded(false);
            };
            document.head.appendChild(recaptchaScript);
        } else {
            initRecaptcha();
        }

        return () => {
            try {
                if (window.google && window.google.accounts) {
                    window.google.accounts.id.cancel();
                }
            } catch (error) {
                console.warn('Erro no cleanup:', error);
            }
        };
    }, []);

    // Callback para processar a resposta do Google
    const handleGoogleCallback = async (response) => {
        try {
            console.log('Google Login Success:', response);
            
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            
            console.log('User Info:', {
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                sub: payload.sub
            });

            alert(`Login realizado com sucesso!\nBem-vindo, ${payload.name}!`);
            setIsOpen(false);
            
        } catch (error) {
            console.error('Erro ao processar login do Google:', error);
            alert('Erro ao fazer login com Google. Tente novamente.');
        }
    };

    // Função para lidar com o reCAPTCHA
    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
        console.log('reCAPTCHA token:', token);
    };

    const handleRecaptchaExpired = () => {
        setRecaptchaToken(null);
        console.log('reCAPTCHA expirado');
    };

    // Renderizar reCAPTCHA quando necessário
    useEffect(() => {
        if (isRecaptchaLoaded && isRegister && isOpen) {
            const recaptchaContainer = document.getElementById('recaptcha-container');
            if (recaptchaContainer && !recaptchaContainer.hasChildNodes()) {
                try {
                    window.grecaptcha.render('recaptcha-container', {
                        sitekey: RECAPTCHA_SITE_KEY,
                        callback: handleRecaptchaChange,
                        'expired-callback': handleRecaptchaExpired,
                        'error-callback': () => {
                            console.error('Erro no reCAPTCHA');
                            setRecaptchaToken(null);
                        }
                    });
                } catch (error) {
                    console.error('Erro ao renderizar reCAPTCHA:', error);
                }
            }
        }
    }, [isRecaptchaLoaded, isRegister, isOpen]);

    // Função para gerar avatar com IA (simulada)
    const generateAIAvatar = async (type = 'dicebear') => {
        setIsGeneratingAI(true);
        
        // Simulação de chamada para IA (substitua pela sua implementação)
        setTimeout(() => {
            // Usando uma imagem placeholder para demonstração
            const aiAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`;
            setPreviewImage(aiAvatarUrl);
            setIsGeneratingAI(false);
        }, 2000);
    };

    const openReadyPlayerMe = () => {
        // Abrir Ready Player Me em nova aba
        const readyPlayerUrl = 'https://demo.readyplayer.me/avatar?frameApi';
        window.open(readyPlayerUrl, '_blank', 'width=400,height=600');
    };

    // Função simplificada para login com Google
    const handleGoogleLogin = () => {
        if (window.google && window.google.accounts && isGoogleLoaded) {
            try {
                // Método mais direto - cria um botão temporário e dispara o clique
                const tempContainer = document.createElement('div');
                tempContainer.style.position = 'fixed';
                tempContainer.style.top = '-9999px';
                tempContainer.style.left = '-9999px';
                document.body.appendChild(tempContainer);

                window.google.accounts.id.renderButton(tempContainer, {
                    theme: 'outline',
                    size: 'large',
                    width: '300',
                    type: 'standard',
                    shape: 'rectangular',
                    logo_alignment: 'left',
                    ux_mode: 'popup'
                });

                // Simular clique no botão
                setTimeout(() => {
                    const button = tempContainer.querySelector('div[role="button"]');
                    if (button) {
                        button.click();
                    }
                    // Limpar o elemento temporário
                    setTimeout(() => {
                        if (document.body.contains(tempContainer)) {
                            document.body.removeChild(tempContainer);
                        }
                    }, 1000);
                }, 100);

            } catch (error) {
                console.error('Erro ao iniciar login Google:', error);
                alert('Erro ao conectar com Google. Tente novamente.');
            }
        } else {
            alert('Google OAuth ainda não foi carregado. Tente novamente em alguns segundos.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validar reCAPTCHA apenas no registro
        if (isRegister && !recaptchaToken) {
            alert('Por favor, complete o reCAPTCHA');
            return;
        }

        // Aqui você processaria o formulário
        console.log('Formulário enviado:', {
            mode: authMode,
            recaptchaToken: recaptchaToken,
            previewImage: previewImage
        });
        
        alert(`${authMode === 'login' ? 'Login' : authMode === 'register' ? 'Cadastro' : 'Recuperação'} realizado com sucesso!`);
    };

    const handleForgotPassword = () => {
        setAuthMode('forgot-password');
    };

    const handleBackToLogin = () => {
        setAuthMode('login');
        // Limpar token do reCAPTCHA ao mudar de modo
        setRecaptchaToken(null);
    };

    const getTitle = () => {
        if (isLogin) return 'Log in';
        if (isRegister) return 'Crie uma conta';
        if (isForgotPassword) return 'Recuperar senha';
    };

    const getButtonText = () => {
        if (isLogin) return 'Entrar';
        if (isRegister) return 'Crie sua conta!';
        if (isForgotPassword) return 'Enviar link de recuperação';
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                />
            )}

            {/* Painel deslizante */}
            <div
                className={`fixed inset-0 z-50 flex font-poppins transition-transform duration-500 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Parte esquerda clicável */}
                <div
                    className="w-0 md:w-1/2 bg-black/30 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />

                {/* Conteúdo do painel */}
                <div className="relative w-full md:w-1/2 bg-white dark:bg-gray-900 h-screen flex flex-col px-6 py-16 shadow-xl overflow-y-auto">
                    {/* Botão fechar */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
                    >
                        <X size={20} />
                    </button>

                    {/* Cabeçalho */}
                    <div className="w-full max-w-md mx-auto mt-10 space-y-10 animate-fade-in">
                        <div className="flex items-center space-x-4">
                            {isRegister && (
                                <button
                                    onClick={handleBackToLogin}
                                    className="text-gray-500 hover:text-gray-700 transition"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                            )}
                            {isForgotPassword && (
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

                    {/* Formulário */}
                    <div className="w-full max-w-md mx-auto mt-10 space-y-10 animate-fade-in">
                        <div className="space-y-6">{/* Form simulation */}
                            {/* Seção de Perfil - apenas no registro */}
                            {isRegister && (
                                <div className="text-center space-y-4">
                                    {/* Avatar */}
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
                                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Criação de avatares */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={openReadyPlayerMe}
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                                        >
                                            <Camera size={16} />
                                            3D Avatar
                                        </button>
                                        
                                        <button
                                            type="button"
                                            onClick={() => generateAIAvatar('dicebear')}
                                            disabled={isGeneratingAI}
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white rounded-lg text-sm transition-colors"
                                        >
                                            {isGeneratingAI ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                                            IA Random
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Campo Usuário - apenas no registro */}
                            {isRegister && (
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-white mb-1">Usuário</label>
                                    <input
                                        type="text"
                                        placeholder="Seu usuário"
                                        className="w-full border border-gray-300 text-black px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                                    />
                                </div>
                            )}

                            {/* Campo E-mail */}
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-white mb-1">
                                    Endereço de e-mail
                                </label>
                                <input
                                    type="email"
                                    placeholder="seu@email.com"
                                    className="w-full border border-gray-300 dark:text-black px-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                                />
                            </div>

                            {/* Campo Senha */}
                            {!isForgotPassword && (
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-white  mb-1">Senha</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="********"
                                            className="w-full border border-gray-300 dark:text-black px-4 py-3 pr-10 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="dark: text-black absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {isRegister && (
                                        <p className="text-xs text-gray-500 dark:text-white mt-1">
                                            Use 8 ou mais caracteres com pelo menos uma letra maiúscula, minúscula,
                                            número e símbolo.
                                        </p>
                                    )}
                                    {isLogin && (
                                        <div className="w-full flex justify-end mt-2">
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

                            {/* reCAPTCHA - apenas no registro */}
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
                                        Ao criar uma conta, você concorda com os nossos{' '}
                                        <a href="#" className="text-green-500 underline">
                                            Termos de uso
                                        </a>{' '}
                                        e{' '}
                                        <a href="#" className="text-green-500 underline">
                                            Política de Privacidade
                                        </a>.
                                    </p>
                                </>
                            )}

                            {/* Botão principal */}
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-gradient-to-r from-green-400 to-green-700 text-white py-4 rounded-full mt-4 transition-all duration-300 hover:scale-105 hover:shadow-md"
                            >
                                {getButtonText()}
                            </button>

                            {/* Divisor "OU" */}
                            {!isForgotPassword && (
                                <div className="relative flex items-center justify-center">
                                    <div className="border-t border-gray-300 w-full"></div>
                                    <span className="px-4 text-gray-500 text-sm">OU</span>
                                    <div className="border-t border-gray-300 w-full"></div>
                                </div>
                            )}

                            {/* Botão Google */}
                            {!isForgotPassword && (
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={!isGoogleLoaded}
                                    className={`w-full flex items-center justify-center gap-3 bg-white border-2 border-green-500 text-gray-700 py-4 rounded-full transition-all duration-300 hover:bg-gray-50 hover:shadow-md ${
                                        !isGoogleLoaded ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                                    }`}
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    {isGoogleLoaded 
                                        ? (isLogin ? 'Entrar com Google' : 'Cadastrar com Google')
                                        : 'Carregando Google...'
                                    }
                                </button>
                            )}

                            {/* Links de navegação */}
                            {!isForgotPassword && (
                                <div className="register">
                                    <p className="text-sm text-gray-600 dark:text-white text-center">
                                        {isLogin ? 'Novo por aqui?' : 'Já possui uma conta?'}{' '}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setAuthMode((prev) =>
                                                    prev === 'login' ? 'register' : 'login'
                                                )
                                            }
                                            className="text-green-500 hover:underline transition-all duration-200"
                                        >
                                            {isLogin ? 'Faça seu cadastro gratuitamente!' : 'Faça o log-in!'}
                                        </button>
                                    </p>
                                </div>
                            )}

                            {/* Voltar ao login na tela de recuperação */}
                            {isForgotPassword && (
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 dark:text-white">
                                        Lembrou da sua senha?{' '}
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}