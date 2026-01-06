import { Inter } from 'next/font/google';
import './globals.css';
import { CalculatorProvider } from '../context/CalculatorContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Vinca Wealth | Financial Freedom Calculator',
  description: 'Plan your journey to financial freedom with our smart calculator',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <CalculatorProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </CalculatorProvider>
      </body>
    </html>
  );
}