import HomePageClient from '@/components/HomePageClient';
import SemanticSEOContent from '@/components/seo/SemanticSEOContent';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      {/* Server-Side Pre-Rendered Semantic HTML for Search Bots, LLMs, and Screen Readers */}
      <SemanticSEOContent />

      {/* Interactive 3D WebGL Client Application */}
      <HomePageClient />
    </>
  );
}
