const TARGET = "https://bramlove1234-public.hf.space";

async function handleRequest(request) {
  const url = new URL(request.url);
  const targetUrl = TARGET + url.pathname + url.search;

  const headers = new Headers(request.headers);
  headers.set("host", "bramlove1234-public.hf.space");

  return fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    redirect: "follow"
  });
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});
