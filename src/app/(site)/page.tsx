import { generatePageMetadata, CmsPageContent } from "@/components/site/cms-page";
export const revalidate = 120;

export async function generateMetadata() {
  return generatePageMetadata();
}

export default function HomePage() {
  return <CmsPageContent />;
}
