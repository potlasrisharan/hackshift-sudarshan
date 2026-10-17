import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { createApp } from "./app";

const app = createApp({
  speechKey: process.env.SARVAM_API_KEY,
  trustedProxy: process.env.TRUST_PROXY === "true",
  speechEnabled: process.env.SARVAM_SPEECH_ENABLED === "true",
});
app.get("/*", serveStatic({ root: "./dist/web" }));
// Loopback only by default: synthetic demo is not a production clinical server.
serve(
  {
    fetch: app.fetch,
    hostname: process.env.HOST ?? "127.0.0.1",
    port: Number(process.env.PORT ?? 8787),
  },
  (info) => {
    console.log(
      JSON.stringify({
        event: "server.started",
        port: info.port,
        mode: "synthetic-demo",
      }),
    );
  },
);
