import { treaty } from "@elysiajs/eden";
import { API } from "../api/[[...slugs]]/route";

export const api = treaty<API>(process.env.APP_URL!, {
  fetch: {
    cache: "no-store",
  },
}).api;
