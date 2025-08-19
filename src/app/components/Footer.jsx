
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="text-gray-300 py-2 pt-4" style={{ backgroundColor: '#0F0716' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Logo e Newsletter */}

                <div className="flex-shrink-0">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/icons/logo2.png"
                            alt="Logo"
                            width={80}
                            height={80}
                            className="rounded"
                        />
                        <span className="text-2xl font-bold text-green-500">
                            Volpe
                        </span>
                    </Link>
                </div>

                {/* Links de Navegação */}

                <div className="col-span-1 md:col-span-1">
                    <ul className="space-y-1 font-semibold">
                        <li>
                            <Link href="/" className="text-green-500 underline">
                                Início
                            </Link>
                        </li>
                        <li>
                            <Link href="/games" className="hover:text-white transition duration-300">
                                Jogos
                            </Link>
                        </li>
                        <li>
                            <Link href="/news" className="hover:text-white transition duration-300">
                                Newsletters
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Links de Contato e Anúncio */}

                <div className="col-span-1 md:col-span-1">
                    <ul className="space-y-1 font-semibold">
                        <li>
                            <Link href="mailto:volpebits@gmail.com" className="text-green-500 underline">
                                Fale conosco
                            </Link>
                        </li>
                         <li>
                            <Link href="/avalienos" className="hover:text-white transition duration-300">
                                Avalie-nos
                            </Link>
                            
                        </li>
                        <li>
                            <Link href="https://www.instagram.com/volp.ebits/" className="hover:text-white transition duration-300">
                                Anuncie na Volpe
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Links de Termos e Políticas */}

                <div className="col-span-1 md:col-span-1">
                    <ul className="space-y-1 font-semibold">
                        <li>
                            <Link href="" className="text-green-500 underline">
                                Termos e políticas
                            </Link>
                        </li>
                        <li>
                            <Link href="" className="hover:text-white transition duration-300">
                                Política de privacidade
                            </Link>
                        </li>
                        <li>
                            <Link href="" className="hover:text-white transition duration-300">
                                Termos de uso
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Ícones de Redes Sociais */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex justify-start space-x-4">
                <a href="https://x.com/volpebits" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300 border border-gray-600 rounded-full p-2">
                    <Image src="/icons/new-twitter.png" alt="Ícone do X" width={24} height={24} />
                </a>
                <a href="https://discord.gg/DaH48GMWKV" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300 border border-gray-600 rounded-full p-2">
                    <Image src="/icons/discord.png" alt="Ícone do Discord" width={24} height={24} />
                </a>
                <a href="https://www.instagram.com/volp.ebits/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300 border border-gray-600 rounded-full p-2">
                    <Image src="/icons/instagram.png" alt="Ícone do Instagram" width={24} height={24} />
                </a>
            </div>
        </footer>
    );
};

export default Footer;

