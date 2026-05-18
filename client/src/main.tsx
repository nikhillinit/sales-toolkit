import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Analytics (optional): inject Umami script only when both env vars are configured.
const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT as string | undefined;
const analyticsWebsiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID as string | undefined;
if (analyticsEndpoint && analyticsWebsiteId) {
  const s = document.createElement("script");
  s.defer = true;
  s.src = `${analyticsEndpoint}/umami`;
  s.setAttribute("data-website-id", analyticsWebsiteId);
  document.head.appendChild(s);
}

createRoot(document.getElementById("root")!).render(<App />);
