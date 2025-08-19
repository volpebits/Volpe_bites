import Image from 'next/image'

export const metadata = {
    title: 'Sobre',
}

export default function About() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 via-purple-400 to-purple-950 dark:from-black dark:via-purple-500 dark:to-purple-950 px-4">
            <div className="max-w-screen-xl w-full mx-auto flex flex-col items-center space-y-10 text-center py-10">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-purple-950 dark:text-green-500">
                    Um projeto independente e nacional
                </h1>

                <p className="text-base font-bold sm:text-lg md:text-xl max-w-4xl text-black dark:text-white text-justify">
                    Somos mais do que uma plataforma de jogos somos um movimento. Nosso projeto nasceu da paixão pelos games e do desejo de fortalecer a cena gamer nacional, oferecendo um palco exclusivo para jogos desenvolvidos por talentos brasileiros. Acreditamos que o Brasil é um berço de criatividade, onde cada jogo carrega não apenas códigos e gráficos, mas também histórias, culturas e sonhos. Aqui, criadores independentes ganham voz, e jogadores têm a oportunidade de explorar mundos inéditos, repletos de identidade e inovação. Queremos conectar quem cria com quem joga, construindo uma ponte sólida para um mercado nacional cada vez mais forte e reconhecido. A cada clique, a cada novo lançamento, estamos impulsionando o futuro dos games no Brasil e você faz parte disso.
                    <br /><br />
                    <strong>Jogue nacional. Apoie local. Cresça global.</strong>
                </p>


                {/* avatares */}
                <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-purple-950 dark:text-green-500'>Desenvolvedores</h2>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    {/* Avatar 1 - Giullia (original) */}
                    <div className="relative group">
                        <div className="absolute inset-0 border-2 border-white rounded-full w-24 h-24 group-hover:w-80 group-hover:h-24 transition-all duration-700 origin-left"></div>

                        <div className="relative flex items-center">
                            <div className="w-24 h-24 flex items-center justify-center">
                                <Image
                                    src="/avatars/Giullia.png"
                                    alt="Giullia"
                                    width="80"
                                    height="80"
                                    className="rounded-full cursor-pointer z-10 transition-all duration-300 group-hover:shadow-lg"
                                />
                            </div>

                            <div className="text-white w-0 group-hover:w-56 overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-700">
                                <div className="whitespace-nowrap">
                                    <h3 className="font-bold text-xl">Giullia</h3>
                                    <p className="text-sm text-gray-200">19 anos, São Paulo - SP</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Avatar 2 - Fabio */}
                    <div className="relative group">
                        <div className="absolute inset-0 border-2 border-white rounded-full w-24 h-24 group-hover:w-80 group-hover:h-24 transition-all duration-700 origin-left"></div>

                        <div className="relative flex items-center">
                            <div className="w-24 h-24 flex items-center justify-center">
                                <Image
                                    src="/avatars/Fabio.png"
                                    alt="Fabio"
                                    width="80"
                                    height="80"
                                    className="rounded-full cursor-pointer z-10 transition-all duration-300 group-hover:shadow-lg"
                                />
                            </div>

                            <div className="text-white w-0 group-hover:w-56 overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-700">
                                <div className="whitespace-nowrap">
                                    <h3 className="font-bold text-xl">Fabio</h3>
                                    <p className="text-sm text-gray-200">23 anos, Juiz de Fora - MG</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Avatar 3 - Isabela */}
                    <div className="relative group">
                        <div className="absolute inset-0 border-2 border-white rounded-full w-24 h-24 group-hover:w-80 group-hover:h-24 transition-all duration-700 origin-left"></div>

                        <div className="relative flex items-center">
                            <div className="w-24 h-24 flex items-center justify-center">
                                <Image
                                    src="/avatars/Isabela.png"
                                    alt="Isabela"
                                    width="80"
                                    height="80"
                                    className="rounded-full cursor-pointer z-10 transition-all duration-300 group-hover:shadow-lg"
                                />
                            </div>

                            <div className="text-white w-0 group-hover:w-56 overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-700">
                                <div className="whitespace-nowrap">
                                    <h3 className="font-bold text-xl">Isabela</h3>
                                    <p className="text-sm text-gray-200">19 anos, Cajuru - SP</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Avatar 4 - Zilton */}
                    <div className="relative group">
                        <div className="absolute inset-0 border-2 border-white rounded-full w-24 h-24 group-hover:w-80 group-hover:h-24 transition-all duration-700 origin-left"></div>

                        <div className="relative flex items-center">
                            <div className="w-24 h-24 flex items-center justify-center">
                                <Image
                                    src="/avatars/Zilton.png"
                                    alt="Zilton"
                                    width="80"
                                    height="80"
                                    className="rounded-full cursor-pointer z-10 transition-all duration-300 group-hover:shadow-lg"
                                />
                            </div>

                            <div className="text-white w-0 group-hover:w-56 overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-700">
                                <div className="whitespace-nowrap">
                                    <h3 className="font-bold text-xl">Zilton</h3>
                                    <p className="text-sm text-gray-200">18 anos, Montes Claros - MG</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
