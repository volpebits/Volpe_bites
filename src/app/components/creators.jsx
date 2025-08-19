'use client'
import React, { useState } from 'react';

const FloatingCreatorsCarousel = () => {
    const creators = [
        {
            id: 1,
            name: "Lucas Almeida",
            role: "Criador de \"Terra Selvagem\"",
            description: "Finalmente temos um espaço dedicado ao talento brasileiro no mundo dos games! Terra Selvagem foi um sonho que nasceu pequeno, mas agora, com essa plataforma, sinto que alcançamos um público que realmente valoriza o que criamos.",
            avatar: "https://placehold.co/60x60/4f46e5/ffffff?text=LA"
        },
        {
            id: 2,
            name: "Ana Rodrigues",
            role: "Criadora de \"Luzes de Neon\"",
            description: "Ver \"Luzes de Neon\" sendo destaque em uma plataforma focada em jogos nacionais é emocionante. Nós, criadores independentes, precisávamos de um espaço assim. E ver que nos agora, sinto que fazemos parte de algo maior.",
            avatar: "https://placehold.co/60x60/ec4899/ffffff?text=AR"
        },
        {
            id: 3,
            name: "Gustavo Ferreira",
            role: "Criador de \"Crônicas do Cerrado\"",
            description: "Sempre sonhei em trazer as histórias do Brasil para o universo dos games, e com 'Crônicas do Cerrado' pude fazer isso. Saber que existe um lugar que valoriza nossa cultura e dá palco para nossos jogos é incrível.",
            avatar: "https://placehold.co/60x60/10b981/ffffff?text=GF"
        },
        {
            id: 4,
            name: "Marina Santos",
            role: "Criadora de \"Ritmos Urbanos\"",
            description: "Criar jogos que representam a diversidade cultural do Brasil sempre foi minha paixão. Com essa plataforma, posso alcançar pessoas que realmente entendem e valorizam nossa arte nacional.",
            avatar: "https://placehold.co/60x60/f59e0b/ffffff?text=MS"
        },
        {
            id: 5,
            name: "Rafael Costa",
            role: "Criador de \"Aventuras Amazônicas\"",
            description: "A Amazônia sempre foi uma fonte de inspiração infinita. Poder compartilhar essas histórias através dos games e ter uma plataforma que apoia desenvolvedores brasileiros é um sonho realizado.",
            avatar: "https://placehold.co/60x60/ef4444/ffffff?text=RC"
        },
        {
            id: 6,
            name: "Isabela Nunes",
            role: "Criadora de \"Encantos do Sertão\"",
            description: "Desde pequena, sonhava em transformar as lendas e belezas do sertão em algo interativo. Agora, com essa plataforma, meu jogo encontrou um público que reconhece e valoriza nossas raízes.",
            avatar: "https://placehold.co/60x60/f97316/ffffff?text=IN"
        },
        {
            id: 7,
            name: "Tiago Moreira",
            role: "Criador de \"Horizonte Metálico\"",
            description: "\"Horizonte Metálico\" mistura ficção científica com crítica social — tudo com um olhar brasileiro. Ver esse projeto sendo acolhido por uma comunidade que apoia criadores locais é gratificante demais.",
            avatar: "https://placehold.co/60x60/6366f1/ffffff?text=TM"
        },
        {
            id: 8,
            name: "Beatriz Lima",
            role: "Criadora de \"Vila Encantada\"",
            description: "Transformar a magia das pequenas vilas brasileiras em um game foi um desafio lindo. E ver a recepção calorosa nessa plataforma só me dá mais vontade de continuar criando.",
            avatar: "https://placehold.co/60x60/22d3ee/ffffff?text=BL"
        },
        {
            id: 9,
            name: "Eduardo Martins",
            role: "Criador de \"Sombras do Ouro\"",
            description: "Nosso passado colonial é cheio de histórias intensas. Com \"Sombras do Ouro\", quis explorar esse legado de forma crítica e envolvente. Essa plataforma é o espaço ideal para isso.",
            avatar: "https://placehold.co/60x60/84cc16/ffffff?text=EM"
        },
        {
            id: 10,
            name: "Camila Ribeiro",
            role: "Criadora de \"Raízes Perdidas\"",
            description: "Meu jogo busca reconectar os jogadores com as culturas indígenas brasileiras. Saber que existe um público aberto para isso me motiva a continuar contando essas histórias.",
            avatar: "https://placehold.co/60x60/a855f7/ffffff?text=CR"
        }
    ];

    // Duplicar os criadores para criar o efeito infinito
    const infiniteCreators = [...creators, ...creators, ...creators];
    const [isPaused, setIsPaused] = useState(false);

    return (
        <div className="p-5 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-950 overflow-hidden relative flex items-center">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 w-full">
                {/* titulo */}
                <div className="text-center pb-10 space-y-5">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-500">Por trás dos Controles</h2>
                    <p className="text-lg md:text-2xl lg:text-3xl font-bold text-white">As mentes brilhantes que estão redefinindo o que significa criar jogos no Brasil.</p>
                </div>
                {/* Infinite Carousel Container */}
                <div
                    className="relative w-full overflow-hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Horizontal scrolling row */}
                    <div
                        className={`flex gap-8 ${isPaused ? '' : 'animate-scroll'}`}
                        style={{
                            width: `${infiniteCreators.length * 400}px`
                        }}
                    >
                        {infiniteCreators.map((creator, index) => (
                            <div
                                key={`${creator.id}-${index}`}
                                className="flex-shrink-0 w-80 transform hover:scale-105 transition-all duration-300 hover:z-20 relative floating-card"
                                style={{
                                    animationDelay: `${(index % 5) * 0.8}s`
                                }}
                            >
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                                    {/* Header with avatar and name */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <img
                                            src={creator.avatar}
                                            alt={creator.name}
                                            className="w-15 h-15 rounded-full border-2 border-white/30"
                                        />
                                        <div>
                                            <h3 className="text-white font-bold text-lg">
                                                {creator.name}
                                            </h3>
                                            <p className="text-purple-200 text-sm font-medium">
                                                {creator.role}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-white/90 text-sm leading-relaxed">
                                        {creator.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-${creators.length * 400}px); }
                }
                
                @keyframes float-1 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(1deg); }
                }
                
                @keyframes float-2 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(-1deg); }
                }
                
                @keyframes float-3 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(0.5deg); }
                }
                
                .animate-scroll {
                    animation: scroll 40s linear infinite;
                }
                
                .floating-card:nth-child(3n+1) {
                    animation: float-1 8s ease-in-out infinite;
                }
                
                .floating-card:nth-child(3n+2) {
                    animation: float-2 8s ease-in-out infinite;
                }
                
                .floating-card:nth-child(3n+3) {
                    animation: float-3 8s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default FloatingCreatorsCarousel;