import Link from 'next/link';
import noticias from '@/data/news';

// Função para gerar metadata dinâmico
export async function generateMetadata({ params }) {
    const id = parseInt(params.id);
    const noticia = noticias[id];

    if (!noticia) {
        return {
            title: 'Notícia não encontrada',
        };
    }

    return {
        title: noticia.titulo,
    };
}

export function generateStaticParams() {
    return noticias.map((_, index) => ({ id: index.toString() }));
}

export default function NewsDetail({ params }) {
    const id = parseInt(params.id);
    const noticia = noticias[id];

    if (!noticia) {
        return (
            <main className="bg-black text-white min-h-screen flex items-center justify-center">
                <p className="text-red-500 text-xl">Notícia não encontrada.</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen p-4 bg-gradient-to-br from-white via-purple-400 to-purple-950 dark:bg-gradient-to-br dark:from-black dark:via-purple-700 dark:to-purple-950">
            <div className="max-w-3xl mx-auto">
                <div className="text-white dark:text-white text-xl font-bold p-6 bg-white bg-opacity-10 rounded-2xl mb-6">
                <img src={noticia.imagem} alt={noticia.titulo} className="w-full rounded mb-6" />
                <h1 className="text-3xl font-bold mb-4 text-purple-950 dark:text-black">{noticia.titulo}</h1>
                    {noticia.texto.split('\n').map((par, i) => (
                        <p key={i} className="mb-4 text-justify">{par}</p>
                    ))}
                </div>
                <Link href="/news">
                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Voltar
                    </button>
                </Link>
            </div>
        </main>
    );
}