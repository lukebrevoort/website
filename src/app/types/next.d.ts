import type { NextPage } from 'next'

// Override Next.js internal types
declare module 'next' {
  export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP>
}

// Fix for app router types
declare module 'next/dist/server/app-render/entry-base' {
  interface PageProps {
    params: Record<string, string>;
    searchParams?: Record<string, string | string[] | undefined>;
  }
}