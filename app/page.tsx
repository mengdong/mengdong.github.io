import Image from "next/image";
import Link from "next/link";
import { getSortedPostsData } from "./lib/posts";

export default function Home() {
  // Get top 2 recent posts
  const recentPosts = getSortedPostsData().slice(0, 2);

  return (
    <div className="flex flex-col gap-8">
      {/* Banner Section */}
      <section className="relative w-full h-48 sm:h-64 mb-12">
        <div className="absolute top-0 left-0 w-[70%] h-full bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ease-out z-10 hover:z-30 hover:scale-105">
          <Image
            src="/images/banner1.jpg"
            alt="Banner Image 1"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute top-4 right-0 w-[70%] h-full bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ease-out z-20 hover:z-30 hover:scale-105">
          <Image
            src="/images/banner2.jpg"
            alt="Banner Image 2"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      <section className="py-4">
        <h1 className="text-4xl font-bold mb-4">Full time AI Engineer, Part time Punting</h1>

        <div className="flex gap-4">
          <a 
            href="/about" 
            className="px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium hover:opacity-90 transition-opacity"
          >
            More about me
          </a>
          <a 
            href="/blog" 
            className="px-6 py-3 rounded-full border border-gray-200 dark:border-gray-800 font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            Read my blog
          </a>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
        <div className="space-y-6">
          {recentPosts.length > 0 ? (
            recentPosts.map(({ slug, date, title, excerpt }) => (
              <article key={slug} className="group">
                <Link href={`/blog/${slug}`} className="block p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {title}
                  </h3>
                  <div className="text-sm text-gray-500 mb-3">{date}</div>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                    {excerpt}
                  </p>
                </Link>
              </article>
            ))
          ) : (
            <p className="text-gray-500">Coming soon...</p>
          )}
        </div>
        {recentPosts.length > 0 && (
          <div className="mt-6 text-center sm:text-left">
            <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              View all posts &rarr;
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
