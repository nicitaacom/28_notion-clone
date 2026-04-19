declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_CONVEX_URL: string
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string
      CLERK_SECRET_KEY: string
      EDGE_STORE_ACCESS_KEY: string
      EDGE_STORE_SECRET_KEY: string
      NEXT_PUBLIC_CLOUDFLARE_SITE_KEY: string
      TURNSTILE_SECRET_KEY: string
    }
  }

  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          theme?: "auto" | "dark" | "light"
          "error-callback"?: () => void
          "expired-callback"?: () => void
        },
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId: string) => void
    }
  }
}

export {}
