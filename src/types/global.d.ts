
/// <reference types="vite/client" />
/// <reference types="three" />

declare module 'three-stdlib';

declare global {
  interface Window {
    solana: any;
  }
}

// This helps with rollup/parseAst module resolution issues
declare module 'rollup/parseAst' {
  export const parseAst: any;
}

export {};
