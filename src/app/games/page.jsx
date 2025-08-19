"use client";
import { useState, useRef, useEffect } from 'react';

export default function Games() {

  useEffect(() => {
        document.title = "Jogos";})

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const seekBarRef = useRef(null);

  const handleVideoError = (e) => {
    console.error("Erro ao carregar vídeo:", e);
    setVideoError(true);
    
    if (e.target.error) {
      const errorCode = e.target.error.code;
      const errorMessage = e.target.error.message || 'Erro desconhecido';
      
      console.error("Código do erro:", errorCode);
      console.error("Mensagem do erro:", errorMessage);
      
      switch(errorCode) {
        case 1:
          console.error("Download do vídeo foi abortado");
          break;
        case 2:
          console.error("Erro de rede - vídeo não encontrado");
          break;
        case 3:
          console.error("Erro de decodificação do vídeo");
          break;
        case 4:
          console.error("Formato do vídeo não suportado ou arquivo não encontrado");
          break;
        default:
          console.error("Erro desconhecido:", errorMessage);
      }
    }
  };

  const handleVideoLoadSuccess = () => {
    setVideoError(false);
    setVideoLoaded(true);
    console.log("Vídeo carregado com sucesso!");
  };

  const togglePlay = () => {
    if (videoRef.current && !videoError) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error("Erro ao reproduzir vídeo:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current && !videoError) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging && !videoError) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      console.log("Vídeo carregado! Duração:", videoRef.current.duration);
      console.log("Ready state:", videoRef.current.readyState);
      console.log("Network state:", videoRef.current.networkState);
      setDuration(videoRef.current.duration || 0);
      videoRef.current.loop = false;
      handleVideoLoadSuccess();
    }
  };

  const checkDuration = () => {
    if (videoRef.current && videoRef.current.duration && duration === 0 && !videoError) {
      console.log("Duração encontrada:", videoRef.current.duration);
      setDuration(videoRef.current.duration);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!videoError) {
        checkDuration();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, videoError]);

  const handleSeek = (e) => {
    e.preventDefault();
    if (!videoRef.current || duration === 0 || videoError) return;

    const seekBar = e.currentTarget;
    const rect = seekBar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pos * duration;

    try {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    } catch (error) {
      console.error("Erro ao navegar no vídeo:", error);
    }
  };

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const updateVideoTime = (clientX) => {
    if (!seekBarRef.current || duration === 0 || videoError) return;

    const rect = seekBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = pos * duration;

    setCurrentTime(newTime);
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = newTime;
      } catch (error) {
        console.error("Erro ao atualizar tempo do vídeo:", error);
      }
    }
  };

  const handleMouseDown = (e) => {
    if (videoError) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    updateVideoTime(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (isDragging && !videoError) {
      e.preventDefault();
      updateVideoTime(e.clientX);
    }
  };

  const handleMouseUp = (e) => {
    if (isDragging && !videoError) {
      setIsDragging(false);
      updateVideoTime(e.clientX);
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    if (videoError) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    const touch = e.touches[0];
    updateVideoTime(touch.clientX);
  };

  const handleTouchMove = (e) => {
    if (isDragging && e.touches[0] && !videoError) {
      e.preventDefault();
      const touch = e.touches[0];
      updateVideoTime(touch.clientX);
    }
  };

  const handleTouchEnd = (e) => {
    if (isDragging && !videoError) {
      setIsDragging(false);
      if (e.changedTouches[0]) {
        updateVideoTime(e.changedTouches[0].clientX);
      }
    }
  };

  useEffect(() => {
    if (isDragging && !videoError) {
      const handleGlobalMouseMove = (e) => {
        e.preventDefault();
        updateVideoTime(e.clientX);
      };

      const handleGlobalMouseUp = (e) => {
        setIsDragging(false);
        updateVideoTime(e.clientX);
      };

      const handleGlobalTouchMove = (e) => {
        if (e.touches[0]) {
          e.preventDefault();
          updateVideoTime(e.touches[0].clientX);
        }
      };

      const handleGlobalTouchEnd = (e) => {
        setIsDragging(false);
        if (e.changedTouches[0]) {
          updateVideoTime(e.changedTouches[0].clientX);
        }
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
        document.removeEventListener('touchmove', handleGlobalTouchMove);
        document.removeEventListener('touchend', handleGlobalTouchEnd);
      };
    }
  }, [isDragging, duration, videoError]);

  const retryVideo = () => {
    setVideoError(false);
    setVideoLoaded(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <main className="bg-gradient-to-r from-white to-purple-300 text-purple-800 dark:bg-gradient-to-br dark:from-black dark:via-purple-700 dark:to-purple-950 flex flex-col items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="text-center max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-2 sm:px-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 text-purple-800 dark:text-green-500 leading-tight">
            HellClock: Reescreva a História na Guerra de Canudos
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-black dark:text-white leading-relaxed font-sans px-1 sm:px-2">
            Mergulhe em um ARPG roguelite desafiador que combina ação intensa e narrativa envolvente.
          </p>
        </div>

        {/* Video Container */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl h-[200px] sm:h-[250px] md:h-[350px] lg:h-[450px] xl:h-[500px] 2xl:h-[600px] rounded-lg overflow-hidden shadow-lg sm:shadow-xl border border-black sm:border-2 md:border-4 bg-black relative group sm:mx-4">
          
          {/* Video Error Fallback */}
          {videoError && (
            <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gray-800">
              <div className="text-center p-4">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21,3H3C1.89,3 1,3.89 1,5V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19V5C23,3.89 22.1,3 21,3M21,19H3V5H21V19Z" />
                </svg>
                <h3 className="text-lg font-semibold mb-2">Vídeo não disponível</h3>
                <p className="text-sm text-gray-300 mb-4">Não foi possível carregar o vídeo.</p>
                <button
                  onClick={retryVideo}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          )}

          {/* Video Element */}
          {!videoError && (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              onError={handleVideoError}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onLoadedData={() => {
                console.log("Dados do vídeo carregados");
                checkDuration();
                handleVideoLoadSuccess();
              }}
              onCanPlay={() => {
                console.log("Vídeo pode ser reproduzido");
                checkDuration();
                handleVideoLoadSuccess();
              }}
              onDurationChange={() => {
                console.log("Duração mudou:", videoRef.current?.duration);
                checkDuration();
              }}
            >
              {/* Corrigindo os caminhos dos vídeos */}
              <source src="/video/roguesnail_54358480.mp4" type="video/mp4" />
              <source src="/videos/roguesnail_54358480.mp4" type="video/mp4" />
              <source src="./public/video/roguesnail_54358480.mp4" type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          )}

          {/* Video Controls - Only show if video is loaded and no error */}
          {!videoError && videoLoaded && (
            <div className="absolute bottom-1 sm:bottom-2 md:bottom-4 left-1 sm:left-2 md:left-4 right-1 sm:right-2 md:right-4">
              {/* Control Buttons */}
              <div className="flex gap-1 sm:gap-2 mb-1 sm:mb-2 md:mb-4">
                <button
                  onClick={togglePlay}
                  className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1 sm:p-1.5 md:p-2 rounded-md sm:rounded-lg transition-all duration-200 touch-manipulation min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] md:min-w-[40px] md:min-h-[40px] flex items-center justify-center"
                >
                  {isPlaying ? (
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={toggleMute}
                  className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1 sm:p-1.5 md:p-2 rounded-md sm:rounded-lg transition-all duration-200 touch-manipulation min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] md:min-w-[40px] md:min-h-[40px] flex items-center justify-center"
                >
                  {isMuted ? (
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Progress Bar */}
              <div>
                <div
                  ref={seekBarRef}
                  className="w-full h-1.5 sm:h-2 md:h-3 bg-gray-600 bg-opacity-50 rounded-full cursor-pointer hover:bg-opacity-70 transition-all duration-200 relative select-none touch-manipulation"
                  onClick={handleSeek}
                >
                  <div
                    className="h-full bg-white rounded-full transition-all duration-100 pointer-events-none"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  ></div>
                  {/* Draggable indicator */}
                  <div
                    className={`absolute top-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-white rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-lg cursor-grab ${isDragging ? 'cursor-grabbing scale-110' : 'hover:scale-105'} transition-transform duration-150 z-10 touch-manipulation`}
                    style={{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  ></div>
                </div>
                <div className="flex justify-between text-white text-xs sm:text-sm mt-0.5 sm:mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Story Section */}
      <div className="min-h-screen bg-gradient-to-r from-purple-400 to-purple-600 dark:bg-gradient-to-br dark:from-black flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
        <div className="max-w-xs sm:max-w-lg md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          {/* Text Content */}
          <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl flex-1 font-bold text-black dark:text-white order-2 lg:order-1 px-2 sm:px-0">
            <p className="leading-relaxed mb-3 sm:mb-4 md:mb-6">
              Em Hell Clock, você assume o papel de Pajeú, um ex-escravo e guerreiro destemido, determinado a resgatar seu mentor, Antônio Conselheiro, das forças sobrenaturais que assolam a região. Este jogo oferece uma experiência única ao combinar elementos de ARPG com mecânicas de roguelite, proporcionando combates intensos e desafiadores.
            </p>
            <p className="leading-relaxed">
              Com uma narrativa profunda ambientada em uma versão sombria da Guerra de Canudos, os jogadores enfrentarão demônios e criaturas místicas enquanto exploram masmorras traiçoeiras. A dublagem em português e a riqueza de detalhes culturais tornam Hell Clock uma jornada imperdível para os fãs de ação e história.
            </p>
          </div>

          {/* Image */}
          <div className="flex-shrink-0 order-1 lg:order-2">
            <img
              src="/images/frame-games.webp"
              alt="Personagem Hell Clock"
              className="w-32 sm:w-40 md:w-52 lg:w-64 xl:w-80 h-auto object-contain mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Other Games Section */}
      <div className="flex flex-col items-center text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl min-h-screen bg-white text-purple-700 dark:bg-gradient-to-br dark:from-black dark:via-purple-700 dark:to-purple-950 font-bold p-3 sm:p-4 md:p-8 lg:p-12 xl:p-20 mt-[-30px] sm:mt-[-50px] md:mt-[-80px] lg:mt-[-100px] xl:mt-[-130px] dark:text-green-500">
        <h1 className="text-center mt-[-10px] sm:mt-[-15px] md:mt-[-20px] lg:mt-[-25px] xl:mt-[-30px] px-2 sm:px-4">
          Explore também outros trabalhos incríveis!
        </h1>
        <div className="mt-6 sm:mt-8 md:mt-12 lg:mt-16 xl:mt-20 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 md:gap-4 lg:gap-6 rounded-lg w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl">
          <a href="https://www.horizonchaseturbo.com/pt-br" className="block hover:scale-105 transition-transform duration-300">
            <img src="/images/Horizon Chase Turbo.webp" alt="Horizon Chase Turbo" className="w-full h-auto p-1 sm:p-2 md:p-4 lg:p-6 xl:p-10 mx-auto rounded-lg" />
          </a>
          <a href="https://blog.studiominiboss.com/games/outtheresomewhere.html" className="block hover:scale-105 transition-transform duration-300">
            <img src="/images/download (12).webp" alt="Out There Somewhere" className="w-full h-auto p-1 sm:p-2 md:p-4 lg:p-6 xl:p-10 mx-auto rounded-lg" />
          </a>
          <a href="https://www.bombservice.com" className="block hover:scale-105 transition-transform duration-300">
            <img src="/images/momodora.webp" alt="Momodora" className="w-full h-auto p-1 sm:p-2 md:p-4 lg:p-6 xl:p-10 mx-auto rounded-lg" />
          </a>
          <a href="https://alendadoheroi.com.br" className="block hover:scale-105 transition-transform duration-300">
            <img src="/images/a-lenda-do-héroi.webp" alt="A Lenda do Herói" className="w-full h-auto p-1 sm:p-2 md:p-4 lg:p-6 xl:p-10 mx-auto rounded-lg" />
          </a>
          <a href="https://www.bombservice.com" className="block hover:scale-105 transition-transform duration-300">
            <img src="/images/minoria.webp" alt="Minoria" className="w-full h-auto p-1 sm:p-2 md:p-4 lg:p-6 xl:p-10 mx-auto rounded-lg" />
          </a>
          <a href="https://www.coffeeaddictstudio.com" className="block hover:scale-105 transition-transform duration-300">
            <img src="/images/hazel.webp" alt="Hazel" className="w-full h-auto p-1 sm:p-2 md:p-4 lg:p-6 xl:p-10 mx-auto rounded-lg" />
          </a>
        </div>
      </div>
    </div>
  );
}