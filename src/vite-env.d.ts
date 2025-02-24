/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_SOLANA_RPC_URL: string;
    VITE_PROGRAM_ID: string;
    VITE_WALLET_PUBLIC_KEY: string;
    // Add other environment variables as needed
}