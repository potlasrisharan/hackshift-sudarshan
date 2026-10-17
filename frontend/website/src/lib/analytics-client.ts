import ReactGA from "react-ga4";

// Older CommonJS bundles expose an extra default wrapper under Vite 8.
// Normalize once so optional analytics cannot break workspace navigation.
const client =
  typeof ReactGA.send === "function"
    ? ReactGA
    : (ReactGA as unknown as { default: typeof ReactGA }).default;
export default client;
