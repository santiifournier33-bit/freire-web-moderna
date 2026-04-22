// Global analytics function declarations (injected via inline scripts in layout.tsx)
declare global {
  interface Window {
    fbq: (command: string, event: string, params?: Record<string, unknown>) => void;
    gtag: (command: string, event: string, params?: Record<string, unknown>) => void;
    dataLayer: unknown[];
  }
  function fbq(command: string, event: string, params?: Record<string, unknown>): void;
  function gtag(command: string, event: string, params?: Record<string, unknown>): void;
}

export {};
