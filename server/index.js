const cacheControl = {
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
