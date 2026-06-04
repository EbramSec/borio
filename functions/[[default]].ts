const TARGET = "https://bramlove1234-public.hf.space";

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const targetUrl = new URL(url.pathname + url.search, TARGET);

    const headers = new Headers(request.headers);
    headers.set("host", "bramlove1234-public.hf.space");

    const proxyRequest = new Request(targetUrl.toString(), {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
      redirect: "manual"
    });

    const response = await fetch(proxyRequest);
    const responseHeaders = new Headers(response.headers);

    responseHeaders.delete("content-security-policy");
    responseHeaders.delete("content-security-policy-report-only");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  }
};
