import ExcelProcessor from '@/components/excel-processor'
import '@/app/globals.css'
export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <ExcelProcessor />
    </main>
  )
}