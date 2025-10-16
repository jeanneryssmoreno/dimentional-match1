import Header from './Header';
import Footer from './Footer';
import ThemeToggle from '../ui/ThemeToggle';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main className="flex-1 relative">
        <ThemeToggle />
        {children}
      </main>
      <Footer />
    </div>
  );
}
