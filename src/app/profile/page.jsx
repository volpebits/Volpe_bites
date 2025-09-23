"use client";

import React from "react";
import {
  User,
  Edit3,
  Calendar,
  Clock,
  Trophy,
  Gamepad2,
  RefreshCw,
  X,
  Wand2,
  Loader2,
} from "lucide-react";

// hooks
import { useProfile } from "./hooks/useProfile";
import { useMissions } from "./hooks/useMissions";
import { migrateOldKeysToVolpe } from "./utils/storage";

const UserProfilePage = () => {
  // Perfil + onboarding (vindos do hook)
  const { profile, updateProfile, onboarding, updateOnboarding } = useProfile();

  // Missões (perfil é passado p/ o hook aplicar XP/espelhamento quando conclui missão)
  const {
    dailyMissions,
    completedMissions,
    missionsFinishedToday,
    completeMission,
    regenerateSpecificMission,
    regenerateAllMissions,
  } = useMissions(profile, updateProfile, onboarding, updateOnboarding);

  // Estados locais só para UI
  const [mounted, setMounted] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = React.useState(false);
  const [tempProfileData, setTempProfileData] = React.useState(profile);

  // Boot do cliente + migração opcional das chaves antigas -> volpe_*
  React.useEffect(() => {
    setMounted(true);
    try {
      migrateOldKeysToVolpe?.();
    } catch { }
  }, []);

  // Sempre que o profile do hook mudar, atualiza os campos temporários do modal
  React.useEffect(() => {
    setTempProfileData(profile);
  }, [profile]);

  // Handlers
  const handleEditProfile = () => {
    setTempProfileData({
      name: profile?.name ?? "",
      about: profile?.about ?? "",
      email: profile?.email ?? "",
      avatar: profile?.avatar ?? null,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    const next = {
      ...profile,
      name: tempProfileData.name ?? "",
      about: tempProfileData.about ?? "",
      email: tempProfileData.email ?? "",
      avatar: tempProfileData.avatar ?? null,
    };
    updateProfile(next);

    // marca perfil configurado se preencheu algo
    if (!onboarding.profileConfigured && (next.name || next.about || next.avatar)) {
      updateOnboarding({ profileConfigured: true });
    }
    setIsEditModalOpen(false);
  };

  const handleCancelEdit = () => setIsEditModalOpen(false);

  // Avatar (demo)
  const generateAIAvatar = async () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      const aiAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`;
      setTempProfileData((prev) => ({ ...prev, avatar: aiAvatarUrl }));
      setIsGeneratingAI(false);
    }, 900);
  };

  const openReadyPlayerMe = () => {
    const readyPlayerUrl = "https://demo.readyplayer.me/avatar?frameApi";
    const popup = window.open(readyPlayerUrl, "readyplayerme", "width=400,height=600");

    const handleMessage = (event) => {
      if (event.origin !== "https://demo.readyplayer.me") return;
      if (event.data?.eventName === "v1.avatar.exported") {
        const avatarUrl = event.data.url;
        setTempProfileData((prev) => ({ ...prev, avatar: avatarUrl }));
        popup?.close();
        window.removeEventListener("message", handleMessage);
      }
    };

    window.addEventListener("message", handleMessage);
    const checkClosed = setInterval(() => {
      if (popup && popup.closed) {
        window.removeEventListener("message", handleMessage);
        clearInterval(checkClosed);
      }
    }, 1000);
  };

  if (!mounted || !profile) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-white via-purple-400 to-purple-950 dark:bg-gradient-to-br dark:from-black dark:via-purple-700 dark:to-purple-950">
        <div className="max-w-7xl mx-auto animate-pulse text-white/70">Carregando…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-white via-white to-white dark:bg-gradient-to-br dark:from-black dark:via-purple-700 dark:to-purple-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start gap-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-600 dark:border-gray-300 bg-gray-700 dark:bg-gray-200 mb-4">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" aria-hidden />
                  </div>
                )}
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-purple-700 dark:text-green-500 mb-1">
                {profile.name || "Usuário"}
              </h1>

              <div className="text-sm text-black/80 dark:text-white/80 mb-3">
                {profile.email ? (
                  <span>
                    E-mail: <span className="font-semibold">{profile.email}</span>
                  </span>
                ) : (
                  <span className="italic">E-mail não definido</span>
                )}
              </div>

              <p className="text-gray-900 dark:text-white text-lg mb-4">
                {profile.about || "Adicione uma bio para contar um pouco sobre você!"}
              </p>

              <div className="flex items-center gap-6 text-gray-400 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="text-black dark:text-white w-4 h-4" aria-hidden />
                  <span className="text-black dark:text-white" suppressHydrationWarning>
                    Membro desde {new Date(profile.memberSince).toLocaleDateString("pt-BR")}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 ml-auto">
            <button
              onClick={handleEditProfile}
              className="flex items-center gap-2 bg-purple-600 dark:bg-green-500 text-white px-6 py-3 rounded-lg font-medium"
            >
              <Edit3 className="w-4 h-4" aria-hidden />
              Editar Perfil
            </button>
            <button
              onClick={() => window.history.back()}
              className="text-black dark:text-gray-100 hover:text-white font-bold px-4 py-3"
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80">
            <div className="text-3xl font-bold text-purple-700 dark:text-green-500 mb-1">
              Nível {profile.level}
            </div>
            <div className="text-black dark:text-white font-bold mb-3">
              XP: {profile.currentXP}/{profile.maxXP}
            </div>
            <div className="w-full bg-purple-300 dark:bg-green-200 rounded-full h-3">
              <div
                className="bg-purple-600 dark:bg-green-500 h-3 rounded-full"
                style={{ width: `${(profile.currentXP / profile.maxXP) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-300 mt-1">
              {profile.currentXP}/{profile.maxXP} XP
            </div>
          </div>

          <div className="bg-white dark:bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80 text-center">
            <div className="text-4xl font-bold text-purple-700 dark:text-green-500 mb-2">
              {profile.achievementsCount}
            </div>
            <div className="text-black dark:text-white font-bold mb-2">Conquistas</div>
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto" aria-hidden />
          </div>

          <div className="bg-white dark:bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80 text-center">
            <div className="text-4xl font-bold text-purple-700 dark:text-green-500 mb-2">
              {profile.gamesCount}
            </div>
            <div className="text-black dark:text-white font-bold mb-2">Jogos</div>
            <Gamepad2 className="w-8 h-8 text-purple-900 dark:text-purple-500 font-bold mx-auto" aria-hidden />
          </div>

          <div className="bg-white dark:bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80 text-center">
            <div className="text-4xl font-bold text-purple-700 dark:text-green-500 mb-2">
              {profile.totalPlaytimeHours}h
            </div>
            <div className="text-black dark:text-white font-bold mb-2">Tempo de Jogo</div>
            <Clock className="w-8 h-8 text-green-500 font-bold mx-auto" aria-hidden />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Tabs e Conteúdo */}
          <div className="flex-1">
            <div className="flex border-b border-gray-900 mb-6">
              {[
                { id: "overview", label: "Visão Geral" },
                { id: "games", label: "Jogos" },
                { id: "achievements", label: "Conquistas" },
                { id: "stats", label: "Estatísticas" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium transition-colors ${activeTab === tab.id
                      ? "text-purple-600 dark:text-green-400 border-b-2 border-purple-700 dark:border-green-400 "
                      : "text-purple-600 dark:text-green-500  hover:text-purple-900 dark:hover:text-green-300"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Visão Geral */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Objetivo do nível */}
                <div className="bg-white dark:bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80">
                  <h4 className="text-black dark:text-white font-semibold mb-3">Objetivo do nível</h4>
                  <p className="text-sm text-black dark:text-white font-semibold mb-2">
                    Faltam{" "}
                    <span className="font-bold text-purple-700 dark:text-green-500">
                      {Math.max(0, profile.maxXP - profile.currentXP)} XP
                    </span>{" "}
                    para alcançar o nível {profile.level + 1}.
                  </p>
                  <div className="w-full bg-purple-300 dark:bg-green-300 rounded-full h-3 mb-2">
                    <div
                      className="bg-purple-500 dark:bg-green-600 h-3 rounded-full"
                      style={{ width: `${(profile.currentXP / profile.maxXP) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-black dark:text-white font-bold">
                    {profile.currentXP}/{profile.maxXP} XP
                  </p>
                </div>

                {/* Atividade recente */}
                <div className="bg-white dark:bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80">
                  <h4 className="text-black dark:text-white font-semibold mb-3">Atividade Recente</h4>
                  <div className="space-y-3">
                    {/* Jogos */}
                    <div>
                      <p className="text-sm text-purple-700 dark:text-green-400 font-semibold mb-1">Jogos</p>
                      {profile.recentGames?.length ? (
                        <ul className="text-sm text-black dark:text-white list-disc list-inside space-y-1">
                          {profile.recentGames.slice(0, 3).map((g, i) => (
                            <li key={i}>
                              <span className="font-semibold">{g.name}</span>{" "}
                              <span className="text-black dark:text-white">— {g.playedAt}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-black dark:text-white">Sem jogos ainda.</p>
                      )}
                    </div>

                    {/* Conquistas */}
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-sm text-purple-700 dark:text-green-400 font-semibold mb-1">Conquistas</p>
                      {completedMissions?.length ? (
                        <ul className="text-sm text-black dark:text-white list-disc list-inside space-y-1">
                          {completedMissions.slice(0, 3).map((m) => (
                            <li key={m.id}>
                              <span className="font-semibold">{m.title}</span>{" "}
                              <span className="text-black dark:text-white">— +{m.xpReward} XP</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-black dark:text-white">
                          Ainda sem conquistas. Bora nessas missões!
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gêneros favoritos com edição */}
                <div>
                  <h3 className="text-2xl font-bold text-purple-700 dark:text-green-500 mt-2 mb-3">
                    Gêneros Favoritos
                  </h3>
                  {profile.favoriteGenres?.length ? (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {profile.favoriteGenres.map((genre, idx) => (
                        <span
                          key={idx}
                          className="group inline-flex items-center gap-2 bg-purple-600 dark:bg-green-500 text-white font-semibold px-3 py-1.5 rounded-full text-sm"
                        >
                          {genre}
                          <button
                            onClick={() =>
                              updateProfile({
                                favoriteGenres: profile.favoriteGenres.filter((_, i) => i !== idx),
                              })
                            }
                            className="opacity-70 group-hover:opacity-100 hover:text-rose-200 transition"
                            aria-label={`Remover ${genre}`}
                            title="Remover"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-black dark:text-white font-sans mb-3">
                      Nenhum gênero adicionado ainda. Comece adicionando os que você mais curte!
                    </p>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tempProfileData?.newGenre || ""}
                      onChange={(e) => setTempProfileData((p) => ({ ...p, newGenre: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && tempProfileData?.newGenre?.trim()) {
                          updateProfile({
                            favoriteGenres: [
                              ...(profile.favoriteGenres || []),
                              tempProfileData.newGenre.trim(),
                            ].slice(0, 8),
                          });
                          setTempProfileData((p) => ({ ...p, newGenre: "" }));
                        }
                      }}
                      className="w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
                      placeholder="Ex.: RPG, Aventura…"
                    />
                    <button
                      onClick={() => {
                        if (tempProfileData?.newGenre?.trim()) {
                          updateProfile({
                            favoriteGenres: [
                              ...(profile.favoriteGenres || []),
                              tempProfileData.newGenre.trim(),
                            ].slice(0, 8),
                          });
                          setTempProfileData((p) => ({ ...p, newGenre: "" }));
                        }
                      }}
                      className="bg-purple-600 hover:bg-purple-700 dark:bg-green-500 dark:hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Jogos */}
            {activeTab === "games" && (
              <div>
                <h3 className="text-2xl font-bold text-purple-700 dark:text-green-400 mb-6">Seus Jogos</h3>
                {profile.recentGames?.length === 0 ? (
                  <div className="bg-white dark:bg-purple-900/30 backdrop-blur-sm rounded-xl p-8 border border-purple-900/80 text-center">
                    <Gamepad2 className="w-16 h-16 text-purple-800 dark:text-green-400 mx-auto mb-4" />
                    <h4 className="text-black dark:text-white font-semibold text-xl mb-2">Nenhum jogo ainda</h4>
                    <p className="text-gray-700 dark:text-gray-300">Comece jogando para ver seus jogos aqui!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profile.recentGames.map((game, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 bg-white dark:bg-purple-900/30 rounded-lg p-4 border border-purple-900/80"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{game.name.substring(0, 3)}</span>
                        </div>
                        <div>
                          <h4 className="text-black dark:text-white font-semibold text-lg">{game.name}</h4>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">{game.playedAt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Conquistas */}
            {activeTab === "achievements" && (
              <div>
                <h3 className="text-2xl font-bold text-purple-700 dark:text-green-400 mb-6">Conquistas</h3>
                {!Array.isArray(completedMissions) || completedMissions.length === 0 ? (
                  <div className="bg-white dark:bg-purple-900/30 backdrop-blur-sm rounded-xl p-8 border border-purple-900/80 text-center">
                    <Trophy className="w-16 h-16 text-green-400 mx-auto mb-4 font-semibold" />
                    <h4 className="text-black dark:text-white font-semibold text-xl mb-2">Nenhuma conquista ainda</h4>
                    <p className="text-gray-800 dark:text-gray-300 font-semibold">
                      Jogue e complete missões para desbloquear conquistas!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 font-semibold">
                    {completedMissions.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center gap-4 bg-white dark:bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80"
                      >
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-black dark:text-white font-semibold">{achievement.title}</h4>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">{achievement.description}</p>
                          <p className="text-purple-600 dark:text-green-400 text-xs">
                            Concluída {achievement.completedAt}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Estatísticas */}
            {activeTab === "stats" && (
              <div>
                <h3 className="text-2xl font-bold text-purple-700 dark:text-green-400 mb-6">Estatísticas Detalhadas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80">
                    <h4 className="text-black dark:text-white font-semibold mb-4">Progresso do Nível</h4>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-700 dark:text-green-400 mb-2">
                        {profile.level}
                      </div>
                      <div className="w-full bg-purple-300 dark:bg-green-200 rounded-full h-3 mb-2">
                        <div
                          className="bg-purple-600 dark:bg-green-500 h-3 rounded-full"
                          style={{ width: `${(profile.currentXP / profile.maxXP) * 100}%` }}
                        />
                      </div>
                      <p className="text-black dark:text-white text-sm">
                        {profile.currentXP}/{profile.maxXP} XP para o próximo nível
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-900/80">
                    <h4 className="text-black dark:text-white font-semibold mb-4">Resumo</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-black dark:text-white">Nível atual:</span>
                        <span className="text-black dark:text-white font-semibold">{profile.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black dark:text-white">Jogos:</span>
                        <span className="text-black dark:text-white font-semibold">{profile.gamesCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black dark:text-white">Conquistas:</span>
                        <span className="text-black dark:text-white font-semibold">{completedMissions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black dark:text-white">Tempo Total:</span>
                        <span className="text-black dark:text-white font-semibold">
                          {profile.totalPlaytimeHours}h
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lado Direito - Onboarding OU Missões */}
          <div className="w-80">
            {!onboarding.missionsUnlocked ? (
              <>
                <h3 className="text-2xl font-bold text-purple-700 dark:text-green-400 mb-6">Comece sua jornada</h3>
                <div className="space-y-4">
                  <div className="border border-yellow-400 rounded-lg p-4">
                    <h4 className="text-yellow-500 font-bold mb-2">Configure seu perfil</h4>
                    <p className="text-black dark:text-white font-semibold text-sm mb-4">
                      Adicione uma foto e uma bio para personalizar seu perfil
                    </p>
                    <button
                      onClick={handleEditProfile}
                      className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-white px-4 py-2 rounded text-sm font-medium w-full transition-colors"
                    >
                      Editar Perfil
                    </button>
                    {onboarding.profileConfigured && (
                      <p className="text-xs text-yellow-500 mt-2">✓ Perfil configurado</p>
                    )}
                  </div>

                  <div className="border border-purple-600 rounded-lg p-4">
                    <h4 className="text-purple-600 dark:text-purple-300 font-bold mb-2">Primeiro jogo</h4>
                    <p className="text-black dark:text-white font-semibold text-sm mb-4">
                      Jogue seu primeiro jogo para ganhar XP e começar sua jornada
                    </p>
                    <button
                      onClick={() => {
                        updateProfile({
                          gamesCount: (profile.gamesCount ?? 0) + 1,
                          totalPlaytimeHours: (profile.totalPlaytimeHours ?? 0) + 1,
                          recentGames: [
                            { name: "Jogo Demo", playedAt: new Date().toLocaleString("pt-BR") },
                            ...(profile.recentGames || []),
                          ].slice(0, 5),
                        });
                        updateOnboarding({ firstGamePlayed: true });
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium w-full transition-colors"
                    >
                      Explorar Jogos
                    </button>
                    {onboarding.firstGamePlayed && (
                      <p className="text-xs text-emerald-300 mt-2">✓ Primeiro jogo jogado</p>
                    )}
                  </div>

                  <div className="border border-green-600 rounded-lg p-4">
                    <h4 className="text-green-600 font-bold mb-2">Primeira conquista</h4>
                    <p className="text-black dark:text-white font-semibold text-sm mb-4">
                      Assim que as missões forem desbloqueadas, conclua uma para sua 1ª conquista
                    </p>
                    <button
                      disabled
                      className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium w-full transition-colors cursor-not-allowed"
                    >
                      Ver Missões
                    </button>
                  </div>

                  <p className="text-xs text-white/70">
                    As missões desbloqueiam automaticamente quando concluir os 2 passos acima.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-purple-700 dark:text-green-400">Missões diárias</h3>
                  {dailyMissions.length > 0 && (
                    <button
                      onClick={regenerateAllMissions}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      title="Trocar todas as missões (mantendo o XP necessário)"
                    >
                      <RefreshCw className="w-4 h-4" aria-hidden />
                      Trocar Todas
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {dailyMissions.map((mission) => (
                    <div key={mission.id} className="border border-purple-900 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-black dark:text-white font-semibold">{mission.title}</h4>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => regenerateSpecificMission(mission.id)}
                            className="bg-gray-500 hover:bg-gray-600 text-white p-1 rounded text-xs transition-colors"
                            title="Trocar esta missão (ajustando o XP)"
                            aria-label="Trocar esta missão"
                          >
                            <RefreshCw className="w-3 h-3" aria-hidden />
                          </button>
                          <div
                            className={`w-8 h-8 bg-gradient-to-br ${mission.gemColor} rounded-full flex items-center justify-center shadow-lg`}
                          >
                            <span className="text-white text-xs font-bold" aria-hidden>
                              💎
                            </span>
                          </div>
                          <span className="text-purple-700 dark:text-green-400 font-bold text-sm">
                            +{mission.xpReward} XP
                          </span>
                        </div>
                      </div>
                      <p className="text-black dark:text-white text-sm mb-4">{mission.description}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => completeMission(mission.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium flex-1 transition-colors"
                        >
                          Concluir
                        </button>
                        <button
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium"
                          onClick={() => setActiveTab("games")}
                        >
                          Ver Jogos
                        </button>
                      </div>
                    </div>
                  ))}

                  {dailyMissions.length === 0 &&
                    (missionsFinishedToday ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4" aria-hidden>
                          🎉
                        </div>
                        <h4 className="text-black dark:text-white font-semibold mb-2">
                          Todas as missões concluídas!
                        </h4>
                        <p className="text-gray-600 dark:text-white font-semibold text-sm">
                          Novas missões chegam já já…
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4" aria-hidden>
                          ⏳
                        </div>
                        <h4 className="text-black dark:text-white font-semibold mb-2">Novas missões amanhã</h4>
                        <p className="text-black dark:text-white text-sm">
                          Volte amanhã para continuar sua jornada!
                        </p>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Modal de Edição */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/60" onClick={handleCancelEdit} />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-profile-title"
              className="relative mx-auto mt-16 w-full max-w-md rounded-lg bg-white dark:bg-zinc-800 p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 id="edit-profile-title" className="text-2xl font-bold text-purple-800 dark:text-green-400">
                  Editar Perfil
                </h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-500  hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Fechar modal"
                >
                  <X className="w-6 h-6" aria-hidden />
                </button>
              </div>

              <div className="space-y-4">
                {/* Avatar */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-600 dark:border-gray-300 bg-gray-700 dark:bg-gray-200 mb-4">
                    {tempProfileData?.avatar ? (
                      <img src={tempProfileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" aria-hidden />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={openReadyPlayerMe}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-lg text-sm transition-colors"
                    >
                      <User size={16} aria-hidden />
                      3D Avatar
                    </button>

                    <button
                      type="button"
                      onClick={generateAIAvatar}
                      disabled={isGeneratingAI}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white rounded-lg text-sm transition-colors"
                    >
                      {isGeneratingAI ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Wand2 size={16} aria-hidden />}
                      IA Random
                    </button>
                  </div>
                </div>

                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-purple-800 dark:text-green-400 mb-2">
                    Nome de usuário
                  </label>
                  <input
                    type="text"
                    value={tempProfileData?.name ?? ""}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
                    placeholder="Seu nome"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-purple-800 dark:text-green-400 mb-2">Sobre</label>
                  <textarea
                    value={tempProfileData?.about ?? ""}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, about: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white resize-none"
                    placeholder="Bio (opcional)"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-purple-800 dark:text-green-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={tempProfileData?.email ?? ""}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
                    placeholder="voce@exemplo.com"
                  />
                </div>

                <p className="text-xs text-black/60 dark:text-white/60">
                  Dica: senha deve ser tratada no backend; não a salve em localStorage.
                </p>
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
