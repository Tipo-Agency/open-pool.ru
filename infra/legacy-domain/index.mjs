export default {
  fetch(request) {
    const url = new URL(request.url);
    if (url.hostname !== "pool.tipa.uz") {
      return new Response("Not found", { status: 404 });
    }
    url.protocol = "https:";
    url.hostname = "open-pool.ru";
    url.port = "";
    return new Response(null, {
      status: 301,
      headers: { Location: url.href, "Cache-Control": "public, max-age=3600" },
    });
  },
};
