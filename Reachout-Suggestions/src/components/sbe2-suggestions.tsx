import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from 'lucide-react'

interface SBE2Data {
  name: string
  inBarGraph: boolean
  purchaseStatus: 'red' | 'orange' | 'green'
  hasTerritoryLookback: boolean
  opportunitySize: number
}

interface SBE2SuggestionsProps {
  sbe2Data: SBE2Data[]
}

export default function SBE2Suggestions({ sbe2Data }: SBE2SuggestionsProps) {
  const getRank = (data: SBE2Data): number => {
    if (data.inBarGraph) {
      if (['red', 'orange'].includes(data.purchaseStatus) && data.hasTerritoryLookback) return 1
      if (data.purchaseStatus === 'green' && data.hasTerritoryLookback) return 2
      if (['red', 'orange'].includes(data.purchaseStatus) && !data.hasTerritoryLookback) return 3
      if (data.purchaseStatus === 'green' && !data.hasTerritoryLookback) return 4
    } else if (data.hasTerritoryLookback) {
      return 5
    }
    return 6 // For any other case
  }

  const sortedSBE2Data = [...sbe2Data].sort((a, b) => getRank(a) - getRank(b))

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">SBE-2 Suggestions</h2>
      {sortedSBE2Data.map((sbe2, index) => (
        <Card key={sbe2.name}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{sbe2.name}</span>
              <Badge variant="secondary">Rank {getRank(sbe2)}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center">
                <span className="mr-2">Included in bar graph:</span>
                {sbe2.inBarGraph ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="flex items-center">
                <span className="mr-2">Purchase status:</span>
                <span className={`px-2 py-1 rounded-full text-white ${
                  sbe2.purchaseStatus === 'red' ? 'bg-red-500' :
                  sbe2.purchaseStatus === 'orange' ? 'bg-orange-500' : 'bg-green-500'
                }`}>
                  {sbe2.purchaseStatus}
                </span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">Has territory lookback:</span>
                {sbe2.hasTerritoryLookback ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="flex items-center">
                <span className="mr-2">Opportunity size:</span>
                <span>{sbe2.opportunitySize.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}