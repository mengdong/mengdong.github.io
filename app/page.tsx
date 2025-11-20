import Image from "next/image";

export default function Home() {
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
        <h1 className="text-4xl font-bold mb-4">Hi, I'm Dong Meng 👋</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          I'm an engineer passionate about AI technologies and poker competitions.
        </p>
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
        <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
        <p className="text-gray-500">Coming soon...</p>
      </section>
    </div>
  );
}
