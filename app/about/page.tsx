export const metadata = {
  title: 'About Me',
  description: 'Learn more about me',
};

export default function AboutPage() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold mb-6">About Me</h1>
      <p className="mb-4">
        Hello! I am currently an Engineer Manager at NVIDIA, 
        focusing on AI infrastructure, Deep Learning Performance and Cloud Managed Services. 
        I enjoy working with AI technologies, try to stay up to date with LLM development. 
      </p>
      <p className="mb-4">
        When I'm not coding or attending meetings, you can find me playing poker. 
        I was lucky enough to won 2 WSOP gold bracelets in 2023 and 2024 respectively.
        And I am on the endeavor to collect more titles.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">My WSOP TOC final table live stream</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex flex-col gap-2">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
            <iframe 
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/elrqwXDo9Z8?start=18120" 
              title="2023 WSOP Event #89 Final Table"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 italic">2023 WSOP Event #89 Final Table</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
            <iframe 
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/6WbSIy7dpxY?start=7144" 
              title="2024 WSOP Tournament of Champions Final Table"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 italic">2024 WSOP Tournament of Champions Final Table</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">News</h2>
      <ul className="list-none space-y-4">
        <li>
          <a 
            href="https://www.pokernews.com/news/2024/05/dong-meng-wins-wsop-tournament-of-champions-46094.htm" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block hover:bg-gray-50 dark:hover:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
          >
            <div className="font-bold text-lg text-blue-600 dark:text-blue-400">2024 WSOP Tournament of Champions Winner</div>
            <div className="text-sm text-gray-500 mt-1">PokerNews &bull; May 2024</div>
            <p className="text-gray-700 dark:text-gray-300 mt-2 no-underline">
              Dong Meng Wins First Bracelet of the Year in WSOP Tournament of Champions.
            </p>
          </a>
        </li>
        <li>
          <a 
            href="https://www.pokernews.com/news/2023/07/dong-meng-wins-2023-wsop-89-1000-flip-and-go-44118.htm" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block hover:bg-gray-50 dark:hover:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
          >
            <div className="font-bold text-lg text-blue-600 dark:text-blue-400">2023 WSOP Event #89: $1,000 Flip & Go Winner</div>
            <div className="text-sm text-gray-500 mt-1">PokerNews &bull; July 2023</div>
            <p className="text-gray-700 dark:text-gray-300 mt-2 no-underline">
              Dong Meng Holds Off 'Westside' Wesley to Win 2023 WSOP Event #89.
            </p>
          </a>
        </li>
      </ul>
    </div>
  );
}
