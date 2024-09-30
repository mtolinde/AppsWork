'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, XCircle } from 'lucide-react'

type SBE2Data = {
  name: string
  inPPMAccelerator: boolean
  isPurchased: boolean
  hasLookbackInfo: boolean
}

type SBE2SuggestionsProps = {
  chartData: Array<{ name: string }>
  purchaseData: {
    [sbe2: string]: {
      isPurchased: boolean
      totalQuantity: number
      territoryLookback: { activityDate: Date | null } | null
    }
  }
  overallMedianQuantity: number | null
}

export default function SBE2Suggestions({ chartData, purchaseData, overallMedianQuantity }: SBE2SuggestionsProps) {
  const [rankedSBE2s, setRankedSBE2s] = useState<SBE2Data[]>([])

  useEffect(() => {
    if (!purchaseData || !chartData || overallMedianQuantity === null) {
      setRankedSBE2s([])
      return
    }

    const sbe2Data: SBE2Data[] = Object.entries(purchaseData).map(([name, data]) => {
      return {
        name,
        inPPMAccelerator: chartData.some(item => item.name === name),
        isPurchased: data.isPurchased,
        hasLookbackInfo: !!data.territoryLookback
      }
    })

    const rankedSBE2s = sbe2Data.sort((a, b) => {
      // Helper function to get rank based on criteria
      const getRank = (sbe2: SBE2Data) => {
        if (sbe2.inPPMAccelerator && !sbe2.isPurchased && sbe2.hasLookbackInfo) return 1
        if (sbe2.inPPMAccelerator && sbe2.isPurchased && sbe2.hasLookbackInfo) return 2
        if (sbe2.inPPMAccelerator && !sbe2.isPurchased && !sbe2.hasLookbackInfo) return 3
        if (sbe2.inPPMAccelerator && sbe2.isPurchased && !sbe2.hasLookbackInfo) return 4
        if (!sbe2.inPPMAccelerator && sbe2.hasLookbackInfo) return 5
        return 6 // For any other case
      }

      return getRank(a) - getRank(b)
    })

    setRankedSBE2s(rankedSBE2s)
  }, [chartData, purchaseData, overallMedianQuantity])

  if (rankedSBE2s.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>SBE-2 Suggestions (Ranked)</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No SBE-2 data available for ranking.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>SBE-2 Suggestions (Ranked)</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full pr-4">
          {rankedSBE2s.map((sbe2, index) => (
            <div key={sbe2.name} className="mb-4 p-3 border rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{index + 1}. {sbe2.name}</h3>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <span className="mr-2">Is it being purchased:</span>
                  {sbe2.isPurchased ? (
                    <CheckCircle2 className="text-green-500" size={20} />
                  ) : (
                    <XCircle className="text-red-500" size={20} />
                  )}
                </div>
                <div className="flex items-center">
                  <span className="mr-2">In PPM Accelerator:</span>
                  {sbe2.inPPMAccelerator ? (
                    <CheckCircle2 className="text-green-500" size={20} />
                  ) : (
                    <XCircle className="text-red-500" size={20} />
                  )}
                </div>
              </div>
              <div className="flex items-center text-sm mt-2">
                <span className="mr-2">Has territory lookback info:</span>
                {sbe2.hasLookbackInfo ? (
                  <CheckCircle2 className="text-green-500" size={20} />
                ) : (
                  <XCircle className="text-red-500" size={20} />
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}