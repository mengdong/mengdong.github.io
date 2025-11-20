import Link from 'next/link';

const Header = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-8 max-w-4xl mx-auto flex justify-between items-center">
      <div className="font-bold text-xl tracking-tight">
        <Link href="/">Dong Meng</Link>
      </div>
      <nav className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
        <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
          Home
        </Link>
        <Link href="/about" className="hover:text-black dark:hover:text-white transition-colors">
          About
        </Link>
        <Link href="/blog" className="hover:text-black dark:hover:text-white transition-colors">
          Blog
        </Link>
      </nav>
    </header>
  );
};

export default Header;

