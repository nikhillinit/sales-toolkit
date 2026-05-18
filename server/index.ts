import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  // /offline is the "Add to Home Screen" entry point — a single-file HTML
  // toolkit that caches and runs without network. Served BEFORE the static
  // middleware so the canonical artifact wins over any SPA fallback.
  const OFFLINE_HTML = path.join(staticPath, "offline", "Restless_FieldKit_Offline_v4.2.html");
  const serveOffline = (_req: express.Request, res: express.Response) => {
    res.sendFile(OFFLINE_HTML);
  };
  app.get("/offline", serveOffline);
  app.get("/offline/", serveOffline);

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
