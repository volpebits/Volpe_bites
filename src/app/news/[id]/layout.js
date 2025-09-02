import noticias from '@/data/news';

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

export default function NewsLayout({ children }) {
    return (
        <>
            {children}
        </>
    );
}