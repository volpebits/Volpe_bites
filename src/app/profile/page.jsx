"use client";

import React, { useState } from 'react';
import { User, Edit3, Camera, Trophy, Gamepad2, Clock, MapPin, Calendar } from 'lucide-react';

const UserProfilePage = () => {
    const [activeTab, setActiveTab] = useState('games');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black p-6">
            <div className="max-w-7xl mx-auto">
                
                {/* Header do Perfil */}
                <div className="flex items-start gap-8 mb-8">
                    
                    {/* Avatar e Info Principal */}
                    <div className="flex items-start gap-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-600 bg-gray-600">
                                <div className="w-full h-full flex items-center justify-center">
                                    <User className="w-16 h-16 text-gray-400" />
                                </div>
                            </div>
                            <button className="absolute bottom-2 right-2 bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Nome</h1>
                            <p className="text-gray-300 text-lg mb-4">Biografia bla bla bla bla bla bla bla</p>
                            <div className="flex items-center gap-6 text-gray-400 text-sm">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    São Paulo - Sp
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Membro desde 00/00/0000
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-3 ml-auto">
                        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium">
                            <Edit3 className="w-4 h-4" />
                            Editar Perfil
                        </button>
                        <button className="text-gray-400 hover:text-white px-4 py-3">
                            Voltar
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="bg-purple-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-700/50">
                        <div className="text-3xl font-bold text-green-400 mb-1">Nível 30:</div>
                        <div className="text-gray-300 mb-3">XP: 3050</div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                            <div className="bg-green-500 h-3 rounded-full" style={{ width: '50%' }}></div>
                        </div>
                    </div>

                    <div className="bg-purple-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-700/50 text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">8</div>
                        <div className="text-gray-300 mb-2">Conquistas</div>
                        <Trophy className="w-8 h-8 text-yellow-500 mx-auto" />
                    </div>

                    <div className="bg-purple-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-700/50 text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">7</div>
                        <div className="text-gray-300 mb-2">Jogos</div>
                        <Gamepad2 className="w-8 h-8 text-purple-400 mx-auto" />
                    </div>

                    <div className="bg-purple-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-700/50 text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">166h</div>
                        <div className="text-gray-300 mb-2">Tempo de Jogo</div>
                        <Clock className="w-8 h-8 text-green-500 mx-auto" />
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Lado Esquerdo - Tabs e Conteúdo */}
                    <div className="flex-1">
                        {/* Tabs de Navegação */}
                        <div className="flex border-b border-gray-700 mb-6">
                            {[
                                { id: 'overview', label: 'Visão Geral' },
                                { id: 'games', label: 'Jogos' },
                                { id: 'missions', label: 'Missões Concluídas' },
                                { id: 'stats', label: 'Estatísticas' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-3 font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? 'text-green-400 border-b-2 border-green-400'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Conteúdo das Tabs */}
                        {activeTab === 'games' && (
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-6">Jogos Recentes</h3>
                                <div className="space-y-4">
                                    {/* GTA V */}
                                    <div className="flex items-center gap-4 bg-purple-800/20 rounded-lg p-4 border border-purple-700/30">
                                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold text-xs">GTA</span>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold text-lg">Grand Theft Auto V</h4>
                                            <p className="text-gray-400 text-sm">Jogado recentemente</p>
                                        </div>
                                    </div>

                                    {/* Tomb Raider */}
                                    <div className="flex items-center gap-4 bg-purple-800/20 rounded-lg p-4 border border-purple-700/30">
                                        <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold text-xs">TR</span>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold text-lg">Tomb Raider</h4>
                                            <p className="text-gray-400 text-sm">Jogado a três dias atrás</p>
                                        </div>
                                    </div>

                                    {/* Roblox */}
                                    <div className="flex items-center gap-4 bg-purple-800/20 rounded-lg p-4 border border-purple-700/30">
                                        <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
                                            <div className="w-8 h-8 bg-white rounded"></div>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold text-lg">Roblox</h4>
                                            <p className="text-gray-400 text-sm">Jogado a um dias atrás</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-3">Sobre</h3>
                                    <p className="text-gray-300">Gamer apaixonado por jogos nacionais! 🎮🇧🇷</p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-3">Gêneros Favoritos</h3>
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
                                <h3 className="text-2xl font-bold text-white mb-6">Missões Concluídas</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 bg-purple-800/20 rounded-lg p-4 border border-purple-700/30">
                                        <div className="text-3xl">🎯</div>
                                        <div>
                                            <h4 className="text-white font-semibold">Primeiro Jogo</h4>
                                            <p className="text-gray-400 text-sm">Jogou seu primeiro jogo nacional</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-purple-800/20 rounded-lg p-4 border border-purple-700/30">
                                        <div className="text-3xl">🗺️</div>
                                        <div>
                                            <h4 className="text-white font-semibold">Explorador</h4>
                                            <p className="text-gray-400 text-sm">Jogou 5 jogos diferentes</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'stats' && (
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-6">Estatísticas Detalhadas</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-purple-800/20 rounded-lg p-6 border border-purple-700/30">
                                        <h4 className="text-white font-semibold mb-4">Progresso do Nível</h4>
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-green-400 mb-2">30</div>
                                            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                                                <div className="bg-green-500 h-3 rounded-full" style={{width: '50%'}}></div>
                                            </div>
                                            <p className="text-gray-400 text-sm">50/100 XP para o próximo nível</p>
                                        </div>
                                    </div>
                                    <div className="bg-purple-800/20 rounded-lg p-6 border border-purple-700/30">
                                        <h4 className="text-white font-semibold mb-4">Resumo</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Total de XP:</span>
                                                <span className="text-white font-semibold">3050</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Jogos:</span>
                                                <span className="text-white font-semibold">7</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Tempo Total:</span>
                                                <span className="text-white font-semibold">166h</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Lado Direito - Missões Diárias */}
                    <div className="w-80">
                        <h3 className="text-2xl font-bold text-white mb-6">Missões diárias</h3>
                        <div className="space-y-4">
                            {/* Missão 1 */}
                            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-white font-semibold">Sweet Music</h4>
                                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs">🎵</span>
                                    </div>
                                </div>
                                <p className="text-green-300 text-sm mb-3">Give "Sweet Music" sticker to a studio</p>
                                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium">
                                    Browse games
                                </button>
                            </div>

                            {/* Missão 2 */}
                            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-white font-semibold">Sweet Music</h4>
                                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs">🎵</span>
                                    </div>
                                </div>
                                <p className="text-green-300 text-sm mb-3">Give "Sweet Music" sticker to a studio</p>
                                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium">
                                    Browse games
                                </button>
                            </div>

                            {/* Missão 3 */}
                            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-white font-semibold">Sweet Music</h4>
                                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs">🎵</span>
                                    </div>
                                </div>
                                <p className="text-green-300 text-sm mb-3">Give "Sweet Music" sticker to a studio</p>
                                <div className="flex gap-2">
                                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium flex-1">
                                        Browse games
                                    </button>
                                    <span className="text-green-400 text-xs self-center">Max</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;