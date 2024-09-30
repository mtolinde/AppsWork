import { Suspense } from 'react'
import AccountDataManager from '@/components/account-data-manager'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<div>Loading...</div>}>
        <AccountDataManager />
      </Suspense>
    </main>
  )
}