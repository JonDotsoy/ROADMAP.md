import { settings } from "../../settings";
import { router } from "./router";
import { serverTimeAlive } from "./stores/server-time-alive";
import { sanitizeURL } from "./utils/sanitize-url.js";

serverTimeAlive.set(Date.now());

export const server = Bun.serve({
  hostname: settings.http.host,
  port: settings.http.port,
  fetch: async (req) =>
    (await router.fetch(req)) ?? new Response(null, { status: 404 }),
});

const publicUrl = sanitizeURL(
  server.url,
  settings.http.basePath,
  settings.http.url,
);

console.log(`Listening on ${publicUrl}`);
console.log(``);

for (const route of router.routes) {
  console.log(
    `route ${route.method} ${new URL(route.urlPattern.pathname, publicUrl)}`,
  );
}

console.log(``);
