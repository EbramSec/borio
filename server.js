const http = require("http");
const https = require("https");

const TARGET_HOST = "bramlove1234-public.hf.space";
const TARGET_ORIGIN = `https://${TARGET_HOST}`;

const server = http.createServer((req, res) => {
  const targetUrl = new URL(req.url, TARGET_ORIGIN);

  const headers = { ...req.headers };
  headers.host = TARGET_HOST;
  delete headers["x-forwarded-host"];
  delete headers["x-forwarded-server"];

  const proxyReq = https.request(
    targetUrl,
    {
      method: req.method,
      headers
    },
    (proxyRes) => {
      const responseHeaders = { ...proxyRes.headers };

      if (responseHeaders.location) {
        responseHeaders.location = responseHeaders.location.replace(
          TARGET_ORIGIN,
          ""
        );
      }

      res.writeHead(proxyRes.statusCode || 200, responseHeaders);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on("error", (err) => {
    res.writeHead(502, { "content-type": "text/plain" });
    res.end("Proxy error: " + err.message);
  });

  req.pipe(proxyReq);
});

const PORT = process.env.PORT || 10000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Borio proxy running on port ${PORT}`);
});
