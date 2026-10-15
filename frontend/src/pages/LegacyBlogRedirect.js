import { Navigate, useParams } from "react-router-dom";
import { LEGACY_BLOG_REDIRECTS } from "@/data/guidesData";

/** Client-side fallback for old /blog/:slug links; vercel.json serves the real 301s. */
export default function LegacyBlogRedirect() {
  const { slug } = useParams();
  const target = LEGACY_BLOG_REDIRECTS[slug];
  return <Navigate to={target ? `/guides/${target}` : "/guides"} replace />;
}
