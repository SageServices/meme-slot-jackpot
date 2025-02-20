
interface Window {
  solana?: {
    connect(options?: { onlyIfTrusted: boolean }): Promise<{ publicKey: { toString(): string } }>;
    disconnect(): Promise<void>;
    isPhantom?: boolean;
    request(params: { method: string; params?: any[] }): Promise<any>;
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
