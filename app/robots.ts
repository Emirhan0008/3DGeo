import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://3d-cografya.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/gemini/'],
      },
      {
        userAgent: [
          'Googlebot',
          'Google-Extended',
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'anthropic-ai',
          'Applebot',
          'Bingbot',
        ],
        allow: [
          '/',
          '/llms.txt',
          '/llms-full.txt',
          '/ai-catalog.json',
          '/.well-known/ai-catalog.json',
          '/sitemap.xml',
          '/google9927a200e581db27.html',
        ],
        disallow: ['/api/gemini/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
