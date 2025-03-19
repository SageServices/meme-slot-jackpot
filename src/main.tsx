
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Use environment variables for sensitive data
const SOLANA_RPC_URL =
  import.meta.env.VITE_SOLANA_RPC_URL || "https://api.devnet.solana.com";

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App rpcUrl={SOLANA_RPC_URL} />
  </React.StrictMode>
);
