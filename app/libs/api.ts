import { treaty } from "@elysiajs/eden";
import { API } from "../api/[[...slugs]]/route";

export const api = treaty<API>(
  typeof window === "undefined"
    ? `http://localhost:${process.env.PORT ?? 3000}`
    : window.location.origin,
  {
    fetch: {
      cache: "no-store",
    },
  },
).api;
