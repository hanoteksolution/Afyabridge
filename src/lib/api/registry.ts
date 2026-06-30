export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiEndpoint = {
  method: HttpMethod;
  path: string;
  description: string;
  auth: "public" | "admin";
  tags: string[];
};

/** Single source of truth for REST endpoints — update when adding routes. */
export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    method: "GET",
    path: "/api/v1/health",
    description: "Database and API health check",
    auth: "public",
    tags: ["system"],
  },
  {
    method: "GET",
    path: "/api/v1/settings",
    description: "Site branding and configuration key-value map",
    auth: "public",
    tags: ["cms"],
  },
  {
    method: "GET",
    path: "/api/v1/pages",
    description: "List published pages (summary)",
    auth: "public",
    tags: ["cms"],
  },
  {
    method: "GET",
    path: "/api/v1/pages/:slug",
    description: "Single published page with sections",
    auth: "public",
    tags: ["cms"],
  },
  {
    method: "GET",
    path: "/api/v1/blogs",
    description: "List published blog posts",
    auth: "public",
    tags: ["blog"],
  },
  {
    method: "GET",
    path: "/api/v1/blogs/:slug",
    description: "Single published blog post",
    auth: "public",
    tags: ["blog"],
  },
  {
    method: "POST",
    path: "/api/v1/contacts",
    description: "Submit a contact / demo request",
    auth: "public",
    tags: ["leads"],
  },
  {
    method: "GET",
    path: "/api/v1/contacts",
    description: "List all contact submissions",
    auth: "admin",
    tags: ["leads"],
  },
  {
    method: "GET",
    path: "/api/v1/faqs",
    description: "Visible FAQ entries",
    auth: "public",
    tags: ["cms"],
  },
  {
    method: "GET",
    path: "/api/v1/testimonials",
    description: "Visible testimonials",
    auth: "public",
    tags: ["cms"],
  },
  {
    method: "POST",
    path: "/api/media/upload",
    description: "Upload media file (multipart form)",
    auth: "admin",
    tags: ["media"],
  },
  {
    method: "GET",
    path: "/api/auth/*",
    description: "NextAuth session and login handlers",
    auth: "public",
    tags: ["auth"],
  },
];

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
