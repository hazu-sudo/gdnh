import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const workerPath = resolve("dist/server/index.js");

const workerSource = `const cacheControl = {
  headers: {
    "Cache-Control": "public, max-age=300",
  },
};

export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const url = new URL(request.url);
    const assetResponse = await env.ASSETS.fetch(request);

    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    if (url.pathname.startsWith("/assets/") || url.pathname.includes(".")) {
      return assetResponse;
    }

    return env.ASSETS.fetch(
      new Request(new URL("/index.html", request.url), request),
      cacheControl,
    );
  },
};
`;

await mkdir(dirname(workerPath), { recursive: true });
await writeFile(workerPath, workerSource);
