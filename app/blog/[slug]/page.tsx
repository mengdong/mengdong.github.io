import React from 'react';
import ReactMarkdown from 'react-markdown';
import { getPostData, getSortedPostsData } from '../../lib/posts';
import Link from 'next/link';
import Comments from '../../components/Comments';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const postData = getPostData(params.slug);
  return {
    title: postData.title,
    description: postData.excerpt,
  };
}

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Post(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const postData = getPostData(params.slug);

  return (
    <article>
      <div className="mb-8">
        <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
          &larr; Back to Blog
        </Link>
        <h1 className="text-4xl font-bold mb-2">{postData.title}</h1>
        <div className="text-gray-500 dark:text-gray-400">{postData.date}</div>
      </div>
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{postData.content}</ReactMarkdown>
      </div>
      <Comments />
    </article>
  );
}
