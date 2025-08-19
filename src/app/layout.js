import '../styles/globals.css'
import Footer from './components/Footer'
import Header from './components/Header'
import { ThemeProvider } from './components/ThemeContext'
import Rybena from './components/libras'

export const metadata = {
    title: 'Meu Site',
    icons: {
        icon: '/Favicon.png',
    },
    description: 'Site criado com Next.js e Tailwind CSS',
}

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR" suppressHydrationWarning={true}>
            <body suppressHydrationWarning={true}>
                <ThemeProvider>
                    <div className="min-h-screen w-full bg-gray-50 vh-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                        <Header />
                        <main className="mx-auto vh-100">
                            {children}
                        </main>
                    </div>
                    <Footer />
                    <Rybena />
                </ThemeProvider>
            </body>
        </html>
    )
}