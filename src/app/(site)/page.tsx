import { generatePageMetadata, CmsPageContent } from "@/components/site/cms-page";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return generatePageMetadata();
}

export default function HomePage() {
  return <CmsPageContent />;
}
