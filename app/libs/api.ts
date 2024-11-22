import { treaty } from "@elysiajs/eden";
import { API } from "../api/[[...slugs]]/route";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const api = treaty<API>(getBaseUrl(), {
  fetch: {
    cache: "no-store",
  },
}).api;
