'use client'

import React, { useState, useEffect } from 'react'
import * as ExcelJS from 'exceljs'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from 'lucide-react'
import SBE2Suggestions from './sbe2-suggestions'
import { SheetData, ChartData, PurchaseData, AlertData, SheetName } from '@/lib/types'

const expectedSheets = ['PPM Accel', 'Alerts', 'PPM', 'Step 6', 'Territory Lookback'] as const

const sheetStructures: Record<SheetName, readonly string[]> = {
  'PPM Accel': ['Account', 'EE', 'SBE', 'SBE1', 'SBE2', 'MyPPM Projects', 'AA Projects %ID', 'ID Delta', 'MyPPM Projects %Convert', 'AA Project %WIN', 'Convert Delta', 'AA Device %WIN', 'MyPPM Projects Value', '# AA PPM Projects'],
  'Alerts': ['Alert Description', 'Account Name', 'Activity Date', 'Contact Email', 'GPN', 'Detail', 'Detail Link', 'Last Email Date', 'Last Email Description', 'PPM Project List', 'Contact Name', 'Alert Contact Email List'],
  'PPM': ['Account Name', 'Project Name', 'SOP QTR', 'GPN', 'Convert Pipeline (SOP)', 'Stuck Convert', 'Convert to Revenue', 'Account GPN Popularity', 'mmPPM Convert', 'Convert (30 days)', 'Contact Name List', '$ Amt Identified', '% $ Amt Converted'],
  'Step 6': ['Sub Family', 'GPN', 'SBE', 'SBE-1', 'SBE-2', 'My Account', '2022 QTY', '2022 R', '2023 QTY', '2023 R', '2024 QTY', '2024 R', '2025 QTY', '2025 R'],
  'Territory Lookback': ['Activity Date', 'MAA Name', 'Contact Name', 'Email', 'GPN', 'Activity Type', 'Product Family', 'Derived Entity', 'QTY', 'GPN Release Date', 'Playbook Division Name', 'Company Name', 'VIP', 'Contact Lookback URL', 'Account Lookback URL', 'TI.com URL', 'Content Recommender Link', 'Sub Family TICOM', 'New GPN Flag', 'New Sub Family Flag', 'Market Level 2', 'Market Level 3', 'Market Level 4', 'Market Segment of MAA Name', 'Sector of MAA Name', 'EE Category of MAA Name', 'End Equipment of MAA Name', 'EE Variant of MAA Name', 'Phone', 'Postal Code', 'CITY', 'STATE', 'COUNTRY', 'Requester Email', 'GPN on Project Flag', 'Contact on Project', 'Active Project List', 'Marketing Email Opt-Out Status', 'MG1', 'SBE', 'SBE-1', 'SBE-2', 'Product Category', 'GPN Marketing Status', 'Sub Family Lowest', 'Rating', 'Description']
} as const

const accountColumns: Record<SheetName, string> = {
  'PPM Accel': 'Account',
  'Alerts': 'Account Name',
  'PPM': 'Account Name',
  'Step 6': 'My Account',
  'Territory Lookback': 'MAA Name'
}

const percentageColumns = ['AA Projects %ID', 'MyPPM Projects %Convert', 'AA Project %WIN', 'AA Device %WIN'] as const

export default function ExcelProcessor(): JSX.Element {
  const [file, setFile] = useState<File | null>(null)
  const [processedData, setProcessedData] = useState<SheetData | null>(null)
  const [filteredData, setFilteredData] = useState<SheetData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [accountName, setAccountName] = useState<string>('')
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [chartTitle, setChartTitle] = useState<string>('SBE2 Performance Chart')
  const [purchaseData, setPurchaseData] = useState<PurchaseData>({})
  const [overallMedianQuantity, setOverallMedianQuantity] = useState<number | null>(null)
  const [hasTerritoryLookbackData, setHasTerritoryLookbackData] = useState<boolean>(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

      if (selectedFile.size > MAX_FILE_SIZE) {
        setError('File size exceeds the maximum limit of 5MB.')
        return
      }

      setFile(selectedFile)
      setError(null)
      setProcessedData(null)
      setFilteredData(null)
      setChartData([])
      setChartTitle('SBE2 Performance Chart')
      setPurchaseData({})
      setOverallMedianQuantity(null)
      setHasTerritoryLookbackData(false)
    }
  }

  const cleanColumnName = (name: string): string => {
    return name.trim().replace(/\s+/g, ' ').toLowerCase()
  }

  const convertToPercentage = (value: string | number | boolean | null): number => {
    if (typeof value === 'boolean' || value === null) {
      return 0
    }
    const num = parseFloat(String(value))
    return isNaN(num) ? 0 : num * 100
  }

  const parseDate = (dateString: string | number | boolean | null): Date | null => {
    if (typeof dateString !== 'string' && typeof dateString !== 'number') {
      return null
    }
    
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? null : date
  }

  const processExcel = async (): Promise<void> => {
    if (!file) {
      setError('Please select a file first.')
      return
    }

    const reader = new FileReader()
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      try {
        if (!e.target || !e.target.result) {
          throw new Error('Failed to read file')
        }

        const buffer = e.target.result instanceof ArrayBuffer ? e.target.result : Buffer.from(e.target.result)
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(buffer)

        const processedSheets: SheetData = {}

        for (const sheetName of expectedSheets) {
          const worksheet = workbook.getWorksheet(sheetName)
          if (!worksheet) {
            setError(`Sheet "${sheetName}" not found in the Excel file.`)
            return
          }

          const sheetData = worksheet.getSheetValues() as (string | number | boolean | null)[][]
          if (sheetData.length <= 1) {
            setError(`Sheet "${sheetName}" is empty or contains only headers.`)
            return
          }

          const headers = sheetData[1].map(String)
          const expectedColumns = sheetStructures[sheetName].map(cleanColumnName)
          const actualColumns = headers.map(cleanColumnName)

          const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col))
          const extraColumns = actualColumns.filter(col => !expectedColumns.includes(col))

          if (missingColumns.length > 0 || extraColumns.length > 0) {
            let errorMessage = `Sheet "${sheetName}" has structural issues:\n`
            if (missingColumns.length > 0) {
              errorMessage += `Missing columns: ${missingColumns.join(', ')}\n`
            }
            if (extraColumns.length > 0) {
              errorMessage += `Extra columns: ${extraColumns.join(', ')}\n`
            }
            setError(errorMessage)
            return
          }

          processedSheets[sheetName] = sheetData.slice(2).map(row => {
            const newRow: Record<string, string | number | boolean | null> = {}
            headers.forEach((header, index) => {
              const cleanHeader = cleanColumnName(header)
              const expectedKey = sheetStructures[sheetName].find(col => cleanColumnName(col) === cleanHeader)
              if (expectedKey) {
                newRow[expectedKey] = row[index] === undefined ? (percentageColumns.includes(expectedKey as typeof percentageColumns[number]) ? 0 : '0') : row[index]
              }
            })
            return newRow
          })
        }

        setProcessedData(processedSheets)
        setError(null)
      } catch (err) {
        console.error('Error processing Excel file:', err)
        setError(`Error processing the Excel file: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    reader.onerror = (error) => {
      console.error('FileReader error:', error)
      setError('Error reading the file. Please try again.')
    }

    reader.readAsArrayBuffer(file)
  }

  useEffect(() => {
    if (processedData && accountName) {
      const filtered: SheetData = {}
      Object.entries(processedData).forEach(([sheetName, data]) => {
        const accountColumn = accountColumns[sheetName as SheetName]
        filtered[sheetName] = data.filter((row) => 
          String(row[accountColumn]).toLowerCase().includes(accountName.toLowerCase())
        )
      })
      setFilteredData(filtered)

      if (filtered['PPM Accel']) {
        const newChartData: ChartData[] = filtered['PPM Accel']
          .filter((row) => {
            const aaProjectsID = convertToPercentage(row['AA Projects %ID'])
            const aaProjectWIN = convertToPercentage(row['AA Project %WIN'])
            return aaProjectsID > 50 && aaProjectWIN > 30
          })
          .map((row) => ({
            name: String(row['SBE2']),
            'AA Projects %ID': convertToPercentage(row['AA Projects %ID']),
            'AA Project %WIN': convertToPercentage(row['AA Project %WIN']),
            'MyPPM Projects %Convert': convertToPercentage(row['MyPPM Projects %Convert'])
          }))
        
        setChartData(newChartData)

        if (newChartData.length > 0 && filtered['PPM Accel'][0] && filtered['PPM Accel'][0]['EE']) {
          const ee = filtered['PPM Accel'][0]['EE']
          setChartTitle(`SBE2 Performance Chart for ${ee}`)
        } else {
          setChartTitle('No data available for chart')
        }

        const filteredPurchaseData: PurchaseData = {}

        // Initialize purchase data for all SBE-2's in the chart
        newChartData.forEach((item) => {
          filteredPurchaseData[item.name] = {
            isPurchased: false,
            quantities: {
              '2022': 0,
              '2023': 0,
              '2024': 0,
              '2025': 0,
            },
            totalQuantity: 0,
            territoryLookback: null
          }
        })

        // Update purchase data with actual quantities if available
        filtered['Step 6'].forEach((row) => {
          const sbe2 = String(row['SBE-2'])
          if (filteredPurchaseData[sbe2]) {
            const quantities = {
              '2022': parseInt(String(row['2022 QTY'])) || 0,
              '2023': parseInt(String(row['2023 QTY'])) || 0,
              '2024': parseInt(String(row['2024 QTY'])) || 0,
              '2025': parseInt(String(row['2025 QTY'])) || 0,
            }
            const totalQuantity = Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
            
            filteredPurchaseData[sbe2] = {
              ...filteredPurchaseData[sbe2],
              isPurchased: totalQuantity > 0,
              quantities: quantities,
              totalQuantity: totalQuantity,
            }
          }
        })

        // Add Territory Lookback information
        let hasAnyTerritoryLookbackData = false
        filtered['Territory Lookback'].forEach((row) => {
          const sbe2 = String(row['SBE-2'])
          if (filteredPurchaseData[sbe2]) {
            filteredPurchaseData[sbe2].territoryLookback = {
              activityDate: parseDate(row['Activity Date']),
              contactName: String(row['Contact Name']) || '',
              email: String(row['Email']) || '',
              gpn: String(row['GPN']) || '',
              activityType: String(row['Activity Type']) || ''
            }
            hasAnyTerritoryLookbackData = true
          }
        })

        setHasTerritoryLookbackData(hasAnyTerritoryLookbackData)
        setPurchaseData(filteredPurchaseData)

        // Calculate median quantity for the filtered data
        const filteredQuantities = Object.values(filteredPurchaseData).map(data => data.totalQuantity).filter(q => q > 0)
        if (filteredQuantities.length > 0) {
          const sortedQuantities = filteredQuantities.sort((a, b) => a - b)
          const mid = Math.floor(sortedQuantities.length / 2)
          const filteredMedian = sortedQuantities.length % 2 !== 0 
            ? sortedQuantities[mid] 
            : (sortedQuantities[mid - 1] + sortedQuantities[mid]) / 2
          setOverallMedianQuantity(filteredMedian)
        } else {
          setOverallMedianQuantity(null)
        }
      }
    } else {
      setFilteredData(null)
      setChartData([])
      setChartTitle('SBE2 Performance Chart')
      setPurchaseData({})
      setHasTerritoryLookbackData(false)
      setOverallMedianQuantity(null)
    }
  }, [processedData, accountName])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Excel File Processor</h1>
      <div className="mb-4">
        <Input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="w-full" />
      </div>
      <Button onClick={processExcel} className="mb-4 bg-black text-white hover:bg-gray-800">Process Excel File</Button>
      {processedData && (
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Filter by Account Name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="w-full"
          />
        </div>
      )}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription style={{whiteSpace: 'pre-line'}}>{error}</AlertDescription>
        </Alert>
      )}
      {chartData.length > 0 && Object.keys(purchaseData).length > 0 && (
        <Tabs defaultValue="chart" className="mt-8">
          <TabsList className="bg-black text-white">
            <TabsTrigger value="chart" className="data-[state=active]:bg-white data-[state=active]:text-black">Chart</TabsTrigger>
            <TabsTrigger value="purchase-info" className="data-[state=active]:bg-white data-[state=active]:text-black">Purchase Info</TabsTrigger>
            <TabsTrigger value="sbe2-suggestions" className="data-[state=active]:bg-white data-[state=active]:text-black">SBE2 Suggestions</TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-white data-[state=active]:text-black">Alerts</TabsTrigger>
          </TabsList>
          <TabsContent value="chart">
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4">{chartTitle}</h2>
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                    <Legend />
                    <Bar dataKey="AA Projects %ID" fill="#8884d8" />
                    <Bar dataKey="AA Project %WIN" fill="#82ca9d" />
                    <Bar dataKey="MyPPM Projects %Convert" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="purchase-info">
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4">SBE-2 Purchase Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(purchaseData).map(([sbe2, data]) => (
                  <Card key={sbe2} className={data.isPurchased ? 'bg-green-100' : 'bg-red-100'}>
                    <CardHeader>
                      <CardTitle>{sbe2}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Status: {data.isPurchased ? 'Purchased' : 'Not Purchased'}</p>
                      <div>
                        <p className="font-semibold mt-2">Quantities by Year:</p>
                        <ul>
                          {Object.entries(data.quantities).map(([year, qty]) => (
                            <li key={year}>{year}: {qty}</li>
                          ))}
                        </ul>
                        <p className="mt-2">Total Quantity: {data.totalQuantity}</p>
                      </div>
                      {data.territoryLookback ? (
                        <div className="mt-4">
                          <p className="font-semibold">Territory Lookback Information:</p>
                          <p>Activity Date: {data.territoryLookback.activityDate ? data.territoryLookback.activityDate.toLocaleString() : 'N/A'}</p>
                          <p>Contact Name: {data.territoryLookback.contactName}</p>
                          <p>Email: {data.territoryLookback.email}</p>
                          <p>GPN: {data.territoryLookback.gpn}</p>
                          <p>Activity Type: {data.territoryLookback.activityType}</p>
                        </div>
                      ) : (
                        <p className="mt-4 font-semibold text-red-500">No Territory Lookback data available for this SBE-2.</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              {overallMedianQuantity !== null && (
                <p className="mt-4 text-lg font-semibold">
                  Overall Median Quantity of Purchased Devices: {overallMedianQuantity}
                </p>
              )}
              {!hasTerritoryLookbackData && (
                <p className="mt-4 text-lg font-semibold text-red-500">
                  No Territory Lookback data exists for any of the SBE-2&apos;s in question.
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="sbe2-suggestions">
            <div className="mt-4">
              <SBE2Suggestions
                chartData={chartData}
                purchaseData={purchaseData}
                overallMedianQuantity={overallMedianQuantity}
              />
            </div>
          </TabsContent>
          <TabsContent value="alerts">
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4">New GPN Quote Alerts</h2>
              {filteredData && filteredData['Alerts'] && filteredData['Alerts'].length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {(filteredData['Alerts'] as AlertData[])
                    .filter((row) => row['Alert Description'] === 'New GPN Quote')
                    .map((alert, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>New GPN Quote Alert</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p><strong>Activity Date:</strong> {new Date(alert['Activity Date']).toLocaleString()}</p>
                              <p><strong>Contact Email:</strong> {alert['Contact Email']}</p>
                              <p><strong>GPN:</strong> {alert['GPN']}</p>
                              <div className="mt-2">
                                <strong>Purchase Status:</strong>
                                {Object.values(purchaseData).some(data => data.isPurchased && data.territoryLookback?.gpn === alert['GPN']) ? (
                                  <Badge className="ml-2 bg-green-500">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Purchased
                                  </Badge>
                                ) : (
                                  <Badge className="ml-2 bg-red-500">
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Not Purchased
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div>
                              <p><strong>Details:</strong></p>
                              <p className="text-sm mt-1">{alert['Detail']}</p>
                              <p className="mt-2"><strong>PPM Project List:</strong></p>
                              <p className="text-sm mt-1">{alert['PPM Project List']}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <p>No New GPN Quote alerts found for the filtered account.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}