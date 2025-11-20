import Link from 'next/link';
import { getSortedPostsData } from '../lib/posts';

export const metadata = {
  title: 'Blog',
  description: 'My thoughts and writings',
};

export default function BlogPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="space-y-6">
        {allPostsData.map(({ slug, date, title, excerpt }) => (
          <article key={slug} className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0">
            <Link href={`/blog/${slug}`} className="group block">
              <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {title}
              </h2>
              <div className="text-sm text-gray-500 mb-3">{date}</div>
              <p className="text-gray-600 dark:text-gray-300">
                {excerpt}
              </p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

