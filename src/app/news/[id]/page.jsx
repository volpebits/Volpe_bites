import noticias from '@/data/news';
import NewsDetailClient from '../../components/NewsDetailClient';

export default function NewsDetail({ params }) {
    const id = parseInt(params.id);
    const noticia = noticias.find(item => item.id === id);

    if (!noticia) {
        return (
            <main className="bg-black text-white min-h-screen flex items-center justify-center">
                <p className="text-red-500 text-xl">Notícia não encontrada.</p>
            </main>
        );
    }

    return <NewsDetailClient noticia={noticia} />;
}