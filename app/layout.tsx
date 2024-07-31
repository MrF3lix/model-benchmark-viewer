import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ReactQueryClientProvider } from '@/components/react-query-client-provider'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LLM Benchmark Comparison',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <body className={`bg-gray-100 ${inter.className}`}>
          <header className="bg-cyan-400">
            <header className="flex justify-between items-center w-full max-w-[1200px] mx-auto gap-4 py-4 px-4">
              <Link href="/area">
                <h1 className="text-black text-lg">Benchmark Viewer</h1>
              </Link>
              <div className="flex gap-4">
                <Link href="/area">
                  <h1 className="text-black text-sm">Area</h1>
                </Link>
                <Link href="/model">
                  <h1 className="text-black text-sm">Models</h1>
                </Link>
              </div>
            </header>
          </header>
          <div className="w-full max-w-[1200px] mx-auto py-8 px-4">
            {children}
          </div>
        </body>
      </html>
    </ReactQueryClientProvider>
  )
}