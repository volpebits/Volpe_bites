"use client";

import React, { useState } from 'react';
import { User, Edit3, Camera, Trophy, Gamepad2, Clock, Calendar, X, Eye, EyeOff, Loader2, Wand2, RefreshCw } from 'lucide-react';

const UserProfilePage = () => {
    // Dados para geração de missões aleatórias
    const missionTemplates = [
        // Missões de Jogo
        { type: 'play', title: 'Maratonista', description: 'Jogue por {time} consecutivas', icons: ['⏰', '🎮', '⚡'], xpRange: [20, 60], timeValues: ['1 hora', '2 horas', '3 horas'] },
        { type: 'games', title: 'Explorador', description: 'Complete {count} jogos diferentes', icons: ['🗺️', '🎯', '🌟'], xpRange: [30, 80], countValues: [2, 3, 4, 5] },
        { type: 'genre', title: 'Especialista', description: 'Jogue 3 jogos de {genre}', icons: ['🎭', '⚔️', '🏎️'], xpRange: [25, 55], genres: ['RPG', 'Aventura', 'Corrida', 'Estratégia', 'Indie'] },

        // Missões Sociais
        { type: 'social', title: 'Avaliador', description: 'Avalie {count} jogos', icons: ['⭐', '📝', '👍'], xpRange: [15, 45], countValues: [2, 3, 4] },
        { type: 'social', title: 'Compartilhador', description: 'Compartilhe {count} jogos com amigos', icons: ['📤', '🤝', '💫'], xpRange: [20, 40], countValues: [1, 2, 3] },
        { type: 'social', title: 'Crítico', description: 'Escreva uma review de {count} jogos', icons: ['✍️', '📖', '🎬'], xpRange: [25, 60], countValues: [1, 2] },

        // Missões de Conquistas
        { type: 'achievement', title: 'Colecionador', description: 'Desbloqueie {count} conquistas', icons: ['🏆', '💎', '🎗️'], xpRange: [30, 70], countValues: [2, 3, 4, 5] },
        { type: 'achievement', title: 'Perfeccionista', description: 'Complete um jogo 100%', icons: ['💯', '👑', '✨'], xpRange: [50, 100], countValues: [1] },
        { type: 'achievement', title: 'Speedrunner', description: 'Complete um jogo em menos de {time}', icons: ['🏃', '⚡', '🕐'], xpRange: [40, 80], timeValues: ['1 hora', '30 minutos', '2 horas'] },

        // Missões de Descoberta
        { type: 'discovery', title: 'Descobridor', description: 'Encontre {count} jogos ocultos', icons: ['🔍', '🗝️', '🎁'], xpRange: [35, 65], countValues: [1, 2, 3] },
        { type: 'discovery', title: 'Beta Tester', description: 'Teste {count} jogos em desenvolvimento', icons: ['🧪', '⚗️', '🔬'], xpRange: [45, 85], countValues: [1, 2] },

        // Missões Especiais
        { type: 'special', title: 'Nostálgico', description: 'Jogue um jogo clássico brasileiro', icons: ['🎖️', '📼', '🕹️'], xpRange: [40, 70], countValues: [1] },
        { type: 'special', title: 'Patriota', description: 'Complete {count} jogos nacionais', icons: ['🇧🇷', '🎊', '🏆'], xpRange: [30, 80], countValues: [2, 3, 4] },
        { type: 'special', title: 'Madrugador', description: 'Jogue entre 00:00 e 06:00', icons: ['🌙', '⭐', '🦉'], xpRange: [25, 55], countValues: [1] }
    ];

    const gemColors = [
        "from-yellow-400 to-orange-500",
        "from-purple-400 to-pink-500",
        "from-blue-400 to-cyan-500",
        "from-green-400 to-emerald-500",
        "from-red-400 to-rose-500",
        "from-indigo-400 to-purple-500"
    ];

    // Estados para os dados do perfil
    const [profileData, setProfileData] = useState({
        name: 'Robson',
        about: 'Gamer apaixonado por jogos nacionais! 🎮🇧🇷',
        email: 'robson@email.com',
        password: '123456789',
        avatar: null,
        level: 30,
        currentXP: 50,
        maxXP: 100
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [showPassword, setShowPassword] = useState(false);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    // Estados para missões (iniciar sempre com 5 missões)
    const [dailyMissions, setDailyMissions] = useState(() => {
        const initialMissions = [];
        for (let i = 0; i < 5; i++) {
            initialMissions.push({
                id: i + 1,
                title: ["Sweet Music", "Explorer Badge", "Time Master", "Game Collector", "Social Player"][i],
                description: [
                    'Give "Sweet Music" sticker to a studio',
                    "Complete 3 different games today",
                    "Play for 2 hours straight",
                    "Add 2 new games to your library",
                    "Rate 3 games you played"
                ][i],
                xpReward: [25, 50, 35, 40, 30][i],
                gemColor: "from-yellow-400 to-orange-500",
                icon: ["🎵", "🏆", "⏰", "📚", "⭐"][i],
                completed: false
            });
        }
        return initialMissions;
    });

    const [completedMissions, setCompletedMissions] = useState([
        {
            id: 101,
            title: "Primeiro Jogo",
            description: "Jogou seu primeiro jogo nacional",
            xpReward: 20,
            completedAt: "Hoje",
            icon: "🎯"
        },
        {
            id: 102,
            title: "Explorador",
            description: "Jogou 5 jogos diferentes",
            xpReward: 40,
            completedAt: "Ontem",
            icon: "🗺️"
        }
    ]);

    // Estado temporário para edição
    const [tempProfileData, setTempProfileData] = useState({
        name: profileData.name || '',
        about: profileData.about || '',
        email: profileData.email || '',
        password: profileData.password || '',
        avatar: profileData.avatar || '',
    });

    // Função para gerar missão aleatória
    const generateRandomMission = () => {
        const template = missionTemplates[Math.floor(Math.random() * missionTemplates.length)];
        const gemColor = gemColors[Math.floor(Math.random() * gemColors.length)];
        const icon = template.icons[Math.floor(Math.random() * template.icons.length)];
        const xpReward = Math.floor(Math.random() * (template.xpRange[1] - template.xpRange[0] + 1)) + template.xpRange[0];

        let description = template.description;

        // Substituir placeholders na descrição
        if (template.countValues && description.includes('{count}')) {
            const count = template.countValues[Math.floor(Math.random() * template.countValues.length)];
            description = description.replace('{count}', count);
        }

        if (template.timeValues && description.includes('{time}')) {
            const time = template.timeValues[Math.floor(Math.random() * template.timeValues.length)];
            description = description.replace('{time}', time);
        }

        if (template.genres && description.includes('{genre}')) {
            const genre = template.genres[Math.floor(Math.random() * template.genres.length)];
            description = description.replace('{genre}', genre);
        }

        return {
            id: Date.now() + Math.floor(Math.random() * 1000),
            title: template.title,
            description: description,
            xpReward: xpReward,
            gemColor: gemColor,
            icon: icon,
            type: template.type,
            completed: false
        };
    };

    // Função para regenerar todas as missões restantes (não concluídas)
    const regenerateAllMissions = () => {
        if (dailyMissions.length === 0) return; // Se não há missões restantes, não faz nada

        const newMissions = [];
        const remainingCount = dailyMissions.length; // Manter a mesma quantidade de missões restantes

        for (let i = 0; i < remainingCount; i++) {
            newMissions.push(generateRandomMission());
        }

        setDailyMissions(newMissions);
    };

    // Função para regenerar uma missão específica
    const regenerateSpecificMission = (missionId) => {
        const newMission = generateRandomMission();
        setDailyMissions(dailyMissions.map(mission =>
            mission.id === missionId ? newMission : mission
        ));
    };

    // Função para completar missão
    const completeMission = (missionId) => {
        const mission = dailyMissions.find(m => m.id === missionId);
        if (!mission || mission.completed) return;

        // Adicionar XP
        const newXP = profileData.currentXP + mission.xpReward;
        let newLevel = profileData.level;
        let finalXP = newXP;

        // Verificar se subiu de nível
        if (newXP >= profileData.maxXP) {
            newLevel += 1;
            finalXP = newXP - profileData.maxXP;
        }

        // Atualizar profile
        setProfileData({
            ...profileData,
            level: newLevel,
            currentXP: finalXP,
            maxXP: 100 // Pode aumentar baseado no nível
        });

        // Mover missão para concluídas
        const completedMission = {
            ...mission,
            id: Date.now(), // novo ID para concluídas
            completedAt: "Agora mesmo"
        };

        setCompletedMissions([completedMission, ...completedMissions]);

        // Remover das missões diárias
        setDailyMissions(dailyMissions.filter(m => m.id !== missionId));
    };

    const handleEditProfile = () => {
        setTempProfileData({ ...profileData });
        setIsEditModalOpen(true);
    };

    const handleSaveProfile = () => {
        setProfileData({ ...tempProfileData });
        setIsEditModalOpen(false);
    };

    const handleCancelEdit = () => {
        setTempProfileData({ ...profileData });
        setIsEditModalOpen(false);
    };

    // Função para gerar avatar com IA (simulada)
    const generateAIAvatar = async (type = 'dicebear') => {
        setIsGeneratingAI(true);

        // Simulação de chamada para IA (substitua pela sua implementação)
        setTimeout(() => {
            // Usando uma imagem placeholder para demonstração
            const aiAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`;
            setTempProfileData({ ...tempProfileData, avatar: aiAvatarUrl });
            setIsGeneratingAI(false);
        }, 2000);
    };

    const openReadyPlayerMe = () => {
        // Abrir Ready Player Me em nova aba
        const readyPlayerUrl = 'https://demo.readyplayer.me/avatar?frameApi';
        const popup = window.open(readyPlayerUrl, 'readyplayerme', 'width=400,height=600');

        // Escutar mensagens da janela popup
        const handleMessage = (event) => {
            // Verificar se a mensagem vem do Ready Player Me
            if (event.origin !== 'https://demo.readyplayer.me') return;

            // Verificar se é o evento de avatar criado
            if (event.data?.eventName === 'v1.avatar.exported') {
                const avatarUrl = event.data.url;
                console.log('Avatar criado:', avatarUrl);

                // Aplicar o avatar ao perfil
                setTempProfileData({ ...tempProfileData, avatar: avatarUrl });

                // Fechar o popup
                if (popup) {
                    popup.close();
                }

                // Remover o listener
                window.removeEventListener('message', handleMessage);

                // Notificar sucesso
                alert('Avatar 3D criado com sucesso!');
            }
        };

        // Adicionar listener para mensagens
        window.addEventListener('message', handleMessage);

        // Limpar listener se o popup for fechado manualmente
        const checkClosed = setInterval(() => {
            if (popup.closed) {
                window.removeEventListener('message', handleMessage);
                clearInterval(checkClosed);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen p-4 bg-gradient-to-br from-white via-purple-400 to-purple-950 dark:bg-gradient-to-br dark:from-black dark:via-purple-700 dark:to-purple-950">
            <div className="max-w-7xl mx-auto">

                {/* Header do Perfil */}
                <div className="flex items-start gap-8 mb-8">

                    {/* Avatar e Info Principal */}
                    <div className="flex items-start gap-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-600 dark:border-gray-300 bg-gray-700 dark:bg-gray-200 mb-4">
                                {profileData.avatar ? (
                                    <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="w-16 h-16 text-gray-400" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">{profileData.name}</h1>
                            <p className="text-gray-900 dark:text-white text-lg mb-4">{profileData.about}</p>
                            <div className="flex items-center gap-6 text-gray-400 text-sm">
                                <span className="flex items-center gap-1">
                                    <Calendar className="text-black dark:text-white w-4 h-4" />
                                    <span className="text-black dark:text-white">Membro desde 19/08/2025</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-3 ml-auto">
                        <button
                            onClick={handleEditProfile}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
                        >
                            <Edit3 className="w-4 h-4" />
                            Editar Perfil
                        </button>
                        <button className="text-black dark:text-gray-100 hover:text-white font-bold px-4 py-3">
                            Voltar
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80">
                        <div className="text-3xl font-bold text-green-400 mb-1">Nível {profileData.level}:</div>
                        <div className="text-black dark:text-white font-bold mb-3">XP: {profileData.currentXP + (profileData.level * 100)}</div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                            <div className="bg-green-500 h-3 rounded-full" style={{ width: `${(profileData.currentXP / profileData.maxXP) * 100}%` }}></div>
                        </div>
                        <div className="text-xs text-gray-300 mt-1">{profileData.currentXP}/{profileData.maxXP} XP</div>
                    </div>

                    <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80 text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">8</div>
                        <div className="text-black dark:text-white font-bold mb-2">Conquistas</div>
                        <Trophy className="w-8 h-8 text-yellow-500 mx-auto" />
                    </div>

                    <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80 text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">7</div>
                        <div className="text-black dark:text-white font-bold mb-2">Jogos</div>
                        <Gamepad2 className="w-8 h-8 text-purple-900 dark:text-purple-500 font-bold mx-auto" />
                    </div>

                    <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80 text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">166h</div>
                        <div className="text-black dark:text-white font-bold mb-2">Tempo de Jogo</div>
                        <Clock className="w-8 h-8 text-green-500 font-bold mx-auto" />
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Lado Esquerdo - Tabs e Conteúdo */}
                    <div className="flex-1">
                        {/* Tabs de Navegação */}
                        <div className="flex border-b border-gray-900 mb-6">
                            {[
                                { id: 'overview', label: 'Visão Geral' },
                                { id: 'games', label: 'Jogos' },
                                { id: 'missions', label: 'Missões Concluídas' },
                                { id: 'stats', label: 'Estatísticas' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-3 font-medium transition-colors ${activeTab === tab.id
                                        ? 'text-green-400 border-b-2 border-green-400'
                                        : 'text-black dark:text-white hover:text-white'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Conteúdo das Tabs */}
                        {activeTab === 'games' && (
                            <div>
                                <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Jogos Recentes</h3>
                                <div className="space-y-4">
                                    {/* GTA V */}
                                    <div className="flex items-center gap-4 bg-purple-800/20 rounded-lg p-4 border border-purple-900/80">
                                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold text-xs">GTA</span>
                                        </div>
                                        <div>
                                            <h4 className="text-black dark:text-white font-semibold text-lg">Grand Theft Auto V</h4>
                                            <p className="text-black dark:text-white text-sm">Jogado recentemente</p>
                                        </div>
                                    </div>

                                    {/* Tomb Raider */}
                                    <div className="flex items-center gap-4 bg-purple-800/20 rounded-lg p-4 border border-purple-900/80">
                                        <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold text-xs">TR</span>
                                        </div>
                                        <div>
                                            <h4 className="text-black dark:text-white font-semibold text-lg">Tomb Raider</h4>
                                            <p className="text-black dark:text-white text-sm">Jogado há três dias</p>
                                        </div>
                                    </div>

                                    {/* Roblox */}
                                    <div className="flex items-center gap-4 bg-purple-800/20 rounded-lg p-4 border border-purple-900/80">
                                        <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
                                            <div className="w-8 h-8 bg-white rounded"></div>
                                        </div>
                                        <div>
                                            <h4 className="text-black dark:text-white font-semibold text-lg">Roblox</h4>
                                            <p className="text-black dark:text-white text-sm">Jogado há um dia</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-black dark:text-white mb-3">Gêneros Favoritos</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {["RPG", "Aventura", "Indie"].map((genre, idx) => (
                                            <span key={idx} className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm">
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'missions' && (
                            <div>
                                <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Missões Concluídas</h3>
                                <div className="space-y-4">
                                    {completedMissions.map((mission) => (
                                        <div key={mission.id} className="flex items-center gap-4 bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                                            <div className="text-3xl">{mission.icon}</div>
                                            <div className="flex-1">
                                                <h4 className="text-black dark:text-white font-semibold">{mission.title}</h4>
                                                <p className="text-black dark:text-white text-sm">{mission.description}</p>
                                                <p className="text-green-400 text-xs">Concluída {mission.completedAt}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">💎</span>
                                                </div>
                                                <span className="text-green-400 font-bold">+{mission.xpReward} XP</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'stats' && (
                            <div>
                                <h3 className="text-2xl font-bold text-black dark:text-white mb-6">Estatísticas Detalhadas</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-purple-800/20 rounded-lg p-6 border border-purple-900/80">
                                        <h4 className="text-black dark:text-white font-semibold mb-4">Progresso do Nível</h4>
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-green-400 mb-2">{profileData.level}</div>
                                            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                                                <div className="bg-green-500 h-3 rounded-full" style={{ width: `${(profileData.currentXP / profileData.maxXP) * 100}%` }}></div>
                                            </div>
                                            <p className="text-black dark:text-white text-sm">{profileData.currentXP}/{profileData.maxXP} XP para o próximo nível</p>
                                        </div>
                                    </div>
                                    <div className="bg-purple-800/20 rounded-lg p-6 border border-purple-900/80">
                                        <h4 className="text-black dark:text-white font-semibold mb-4">Resumo</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-black dark:text-white">Total de XP:</span>
                                                <span className="text-black dark:text-white font-semibold">{profileData.currentXP + (profileData.level * 100)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-black dark:text-white">Jogos:</span>
                                                <span className="text-black dark:text-white font-semibold">7</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-black dark:text-white">Tempo Total:</span>
                                                <span className="text-black dark:text-white font-semibold">166h</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Lado Direito - Missões Diárias */}
                    <div className="w-80">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-black dark:text-white">Missões diárias</h3>
                            {dailyMissions.length > 0 && (
                                <button
                                    onClick={regenerateAllMissions}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                    title="Trocar todas as missões restantes"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Trocar Todas
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {dailyMissions.map((mission) => (
                                <div key={mission.id} className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-white font-semibold">{mission.title}</h4>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => regenerateSpecificMission(mission.id)}
                                                className="bg-gray-600 hover:bg-gray-700 text-white p-1 rounded text-xs transition-colors"
                                                title="Trocar esta missão"
                                            >
                                                <RefreshCw className="w-3 h-3" />
                                            </button>
                                            <div className={`w-8 h-8 bg-gradient-to-br ${mission.gemColor} rounded-full flex items-center justify-center shadow-lg`}>
                                                <span className="text-white text-xs font-bold">💎</span>
                                            </div>
                                            <span className="text-green-400 font-bold text-sm">+{mission.xpReward} XP</span>
                                        </div>
                                    </div>
                                    <p className="text-green-300 text-sm mb-4">{mission.description}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => completeMission(mission.id)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium flex-1 transition-colors"
                                        >
                                            Concluir
                                        </button>
                                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium">
                                            Ver Jogos
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {dailyMissions.length === 0 && (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">🎉</div>
                                    <h4 className="text-black dark:text-white font-semibold mb-2">Todas as missões concluídas!</h4>
                                    <p className="text-gray-500 text-sm">Novas missões chegam amanhã</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal de Edição */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-black dark:text-white">Editar Perfil</h2>
                                <button
                                    onClick={handleCancelEdit}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Avatar */}
                                <div className="flex flex-col items-center mb-6">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 mb-4">
                                        {tempProfileData.avatar ? (
                                            <img src={tempProfileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Criação de avatares */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={openReadyPlayerMe}
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-lg text-sm transition-colors"
                                        >
                                            <User size={16} />
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

                                {/* Nome */}
                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-white mb-2">Nome de usuário</label>
                                    <input
                                        type="text"
                                        value={tempProfileData.name}
                                        onChange={(e) => setTempProfileData({ ...tempProfileData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
                                    />
                                </div>

                                {/* Sobre */}
                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-white mb-2">Sobre</label>
                                    <textarea
                                        value={tempProfileData.about}
                                        onChange={(e) => setTempProfileData({ ...tempProfileData, about: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white resize-none"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-white mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={tempProfileData.email}
                                        onChange={(e) => setTempProfileData({ ...tempProfileData, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
                                    />
                                </div>

                                {/* Senha */}
                                <div>
                                    <label className="block text-sm font-medium text-black dark:text-white mb-2">Senha</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={tempProfileData.password}
                                            onChange={(e) => setTempProfileData({ ...tempProfileData, password: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-700 dark:text-green-500"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Botões */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleSaveProfile}
                                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium"
                                >
                                    Salvar
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg font-medium"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfilePage;