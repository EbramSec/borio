const TARGET = "https://bramlove1234-public.hf.space";

export default async function onRequest(context) {
  return proxyToHF(context);
}

async function proxyToHF(context) {
  const req = context.request;
  const url = new URL(req.url);
  const targetUrl = TARGET + url.pathname + url.search;

  const headers = new Headers(req.headers);
  headers.set("host", "bramlove1234-public.hf.space");
  headers.delete("x-forwarded-host");
  headers.delete("x-forwarded-server");

  const init = {
    method: req.method,
    headers,
    redirect: "manual"
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.body;
  }

  const res = await fetch(targetUrl, init);
  const outHeaders = new Headers(res.headers);

  outHeaders.set("access-control-allow-origin", "*");
  outHeaders.set("cache-control", "no-store");

  const location = outHeaders.get("location");
  if (location) {
    outHeaders.set(
      "location",
      location.replace(TARGET, "")
    );
  }

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: outHeaders
  });
}
