
interface Window {
  solana?: {
    connect(): Promise<{ publicKey: { toString(): string } }>;
    disconnect(): Promise<void>;
    isPhantom?: boolean;
  }
}

declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const content: string;
  export default content;
}
