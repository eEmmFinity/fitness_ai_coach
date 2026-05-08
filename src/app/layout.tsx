import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fitness AI Coach - Your Personal Fitness Assistant',
  description: 'AI-powered fitness coaching with personalized workout routines, nutrition advice, and expert guidance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Dark is the default; .light is the opt-in. Avoid FOUC by
              // setting the class before paint.
              try {
                const saved = localStorage.getItem('theme');
                const root = document.documentElement;
                if (saved === 'light') {
                  root.classList.add('light');
                  root.classList.remove('dark');
                } else {
                  root.classList.add('dark');
                  root.classList.remove('light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
