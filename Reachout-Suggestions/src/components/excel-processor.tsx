'use client'

import React, { useState, useEffect } from 'react'
import * as ExcelJS from 'exceljs'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import SBE2Suggestions from './sbe2-suggestions'

const expectedSheets = ['PPM Accel', 'Alerts', 'PPM', 'Step 6', 'Territory Lookback', 'Weight'] as const

type SheetName = typeof expectedSheets[number]

interface SheetData {
  [key: string]: Record<string, string | number | boolean | null>[]
}

interface ChartData {
  name: string
  'AA Projects %ID': number
  'AA Project %WIN': number
  'MyPPM Projects %Convert': number
}

interface PurchaseData {
  [key: string]: {
    isPurchased: boolean
    quantities: {
      [year: string]: number
    }
    totalQuantity: number
    territoryLookback: {
      activityDate: Date | null
      contactName: string
      email: string
      gpn: string
      activityType: string
      appearanceCount: number
    } | null
  }
}

interface AlertData {
  'Alert Description': string
  'Account Name': string
  'Activity Date': string
  'Contact Email': string
  'GPN': string
  'Detail': string
  'PPM Project List': string
}

interface HeatmapData {
  name: string
  opportunitySize: number
  rank: number
  weight: number
}

interface SBE2Data {
  name: string
  inBarGraph: boolean
  purchaseStatus: 'red' | 'orange' | 'green'
  hasTerritoryLookback: boolean
  opportunitySize: number
  rank: number
}

const sheetStructures: Record<SheetName, readonly string[]> = {
  'PPM Accel': ['Account', 'EE', 'SBE', 'SBE1', 'SBE2', 'MyPPM Projects', 'AA Projects %ID', 'ID Delta', 'MyPPM Projects %Convert', 'AA Project %WIN', 'Convert Delta', 'AA Device %WIN', 'MyPPM Projects Value', '# AA PPM Projects'],
  'Alerts': ['Alert Description', 'Account Name', 'Activity Date', 'Contact Email', 'GPN', 'Detail', 'Detail Link', 'Last Email Date', 'Last Email Description', 'PPM Project List', 'Contact Name', 'Alert Contact Email List'],
  'PPM': ['Account Name', 'Project Name', 'SOP QTR', 'GPN', 'Convert Pipeline (SOP)', 'Stuck Convert', 'Convert to Revenue', 'Account GPN Popularity', 'mmPPM Convert', 'Convert (30 days)', 'Contact Name List', '$ Amt Identified', '% $ Amt Converted'],
  'Step 6': ['Sub Family', 'GPN', 'SBE', 'SBE-1', 'SBE-2', 'My Account', '2022 QTY', '2022 R', '2023 QTY', '2023 R', '2024 QTY', '2024 R', '2025 QTY', '2025 R'],
  'Territory Lookback': ['Activity Date', 'MAA Name', 'Contact Name', 'Email', 'GPN', 'Activity Type', 'Product Family', 'Derived Entity', 'QTY', 'GPN Release Date', 'Playbook Division Name', 'Company Name', 'VIP', 'Contact Lookback URL', 'Account Lookback URL', 'TI.com URL', 'Content Recommender Link', 'Sub Family TICOM', 'New GPN Flag', 'New Sub Family Flag', 'Market Level 2', 'Market Level 3', 'Market Level 4', 'Market Segment of MAA Name', 'Sector of MAA Name', 'EE Category of MAA Name', 'End Equipment of MAA Name', 'EE Variant of MAA Name', 'Phone', 'Postal Code', 'CITY', 'STATE', 'COUNTRY', 'Requester Email', 'GPN on Project Flag', 'Contact on Project', 'Active Project List', 'Marketing Email Opt-Out Status', 'MG1', 'SBE', 'SBE-1', 'SBE-2', 'Product Category', 'GPN Marketing Status', 'Sub Family Lowest', 'Rating', 'Description'],
  'Weight': ['SBE-2', 'Weight']
}

const accountColumns: Record<SheetName, string> = {
  'PPM Accel': 'Account',
  'Alerts': 'Account Name',
  'PPM': 'Account Name',
  'Step 6': 'My Account',
  'Territory Lookback': 'MAA Name',
  'Weight': 'SBE-2'
}

const percentageColumns = ['AA Projects %ID', 'MyPPM Projects %Convert', 'AA Project %WIN', 'AA Device %WIN'] as const

function SBE2Heatmap({ sbe2Data }: { sbe2Data: SBE2Data[] }) {
  const maxOpportunitySize = Math.max(...sbe2Data.map(item => item.opportunitySize))
  const minOpportunitySize = Math.min(...sbe2Data.map(item => item.opportunitySize))

  const getColor = (value: number) => {
    const normalizedValue = (value - minOpportunitySize) / (maxOpportunitySize - minOpportunitySize)
    return `hsl(${120 * (1 - normalizedValue)}, 100%, ${50 + normalizedValue * 20}%)`
  }

  const getSize = (value: number) => {
    const normalizedValue = (value - minOpportunitySize) / (maxOpportunitySize - minOpportunitySize)
    return 80 + normalizedValue * 40 // Size range from 80px to 120px for a more compact grid
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>SBE-2 Opportunity Size Heatmap</CardTitle>
        <CardDescription>Size and color intensity represent opportunity size</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
          {sbe2Data.map((item) => {
            const size = getSize(item.opportunitySize)
            const color = getColor(item.opportunitySize)
            return (
              <div key={item.name} className="flex flex-col items-center">
                <div
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                  }}
                  className="relative group cursor-pointer hover:shadow-lg"
                >
                  <span className="text-xs font-semibold text-white text-center p-1">
                    {item.name}
                  </span>
                  <span className="text-xs font-medium text-white text-center">
                    ${item.opportunitySize.toFixed(2)}
                  </span>
                  <span className="text-xs font-medium text-white text-center">
                    Rank: {item.rank}
                  </span>
                  <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 rounded-lg">
                    <span className="text-white text-xs font-medium text-center p-2">
                      Opportunity: ${item.opportunitySize.toFixed(2)}
                      <br />
                      Rank: {item.rank}
                    </span>
                  </div>
                </div>
                <Badge 
                  variant={item.purchaseStatus === 'green' ? 'default' : item.purchaseStatus === 'orange' ? 'secondary' : 'destructive'}
                  className="mt-1 text-xs"
                >
                  {item.purchaseStatus === 'green' ? 'Purchased' : item.purchaseStatus === 'orange' ? 'Partial' : 'Not Purchased'}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ExcelProcessor(): JSX.Element {
  const [file, setFile] = useState<File | null>(null)
  const [processedData, setProcessedData] = useState<SheetData | null>(null)
  const [filteredData, setFilteredData] = useState<SheetData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [accountName, setAccountName] = useState<string>('')
  const [selectedEE, setSelectedEE] = useState<string>('')
  const [eeOptions, setEEOptions] = useState<string[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [chartTitle, setChartTitle] = useState<string>('SBE2 Performance Chart')
  const [purchaseData, setPurchaseData] = useState<PurchaseData>({})
  const [overallMedianQuantity, setOverallMedianQuantity] = useState<number | null>(null)
  const [hasTerritoryLookbackData, setHasTerritoryLookbackData] = useState<boolean>(false)
  const [weightData, setWeightData] = useState<{ sbe2: string; weight: number }[]>([])

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
      setSelectedEE('')
      setEEOptions([])
      setWeightData([])
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
    if (typeof dateString === 'number') {
      // Excel stores dates as number of days since January 1, 1900
      const date = new Date((dateString - 25569) * 86400 * 1000);
      return isNaN(date.getTime()) ? null : date;
    }
    if (typeof dateString === 'string') {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    }
    return null;
  }

  const processExcel = async (): Promise<void> => {
    if (!file) {
      setError('Please select a file first.')
      return
    }

    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(arrayBuffer)

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
          return  newRow
        })
      }

      setProcessedData(processedSheets)
      setError(null)

      // Extract unique EE options
      const eeSet = new Set(processedSheets['PPM Accel'].map(row => String(row['EE'])))
      setEEOptions(Array.from(eeSet))

      // Calculate average purchase quantity
      if (processedSheets['Step 6'] && Array.isArray(processedSheets['Step 6'])) {
        const allQuantities = processedSheets['Step 6'].flatMap(row => [
          parseInt(String(row['2022 QTY'])) || 0,
          parseInt(String(row['2023 QTY'])) || 0,
          parseInt(String(row['2024 QTY'])) || 0,
          parseInt(String(row['2025 QTY'])) || 0
        ]).filter(qty => qty > 0)

        const averagePurchaseQuantity = allQuantities.length > 0
          ? allQuantities.reduce((sum, qty) => sum + qty, 0) / allQuantities.length
          : 0

        setOverallMedianQuantity(averagePurchaseQuantity)
      } else {
        console.error("'Step 6' sheet is missing or not an array")
        setOverallMedianQuantity(0)
      }

      // Set weight data
      if (processedSheets['Weight'] && Array.isArray(processedSheets['Weight'])) {
        const newWeightData = processedSheets['Weight'].map(row => ({
          sbe2: String(row['SBE-2']),
          weight: parseFloat(String(row['Weight']))
        })).filter(item => !isNaN(item.weight))

        setWeightData(newWeightData)
      } else {
        console.error("'Weight' sheet is missing or not an array")
        setWeightData([])
      }

    } catch (err) {
      console.error('Error processing Excel file:', err)
      setError(`Error processing the Excel file: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  useEffect(() => {
    if (processedData && accountName && selectedEE) {
      const filtered: SheetData = {}
      Object.entries(processedData).forEach(([sheetName, data]) => {
        const accountColumn = accountColumns[sheetName as SheetName]
        
        filtered[sheetName] = data.filter((row) => 
          String(row[accountColumn]).toLowerCase().includes(accountName.toLowerCase()) &&
          (sheetName !== 'PPM Accel' || String(row['EE']) === selectedEE)
        )
      })
      setFilteredData(filtered)

      if (filtered['PPM Accel'] && filtered['Weight']) {
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

        if (newChartData.length > 0) {
          setChartTitle(`SBE2 Performance Chart for ${selectedEE}`)
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

        // Update purchase data with actual quantities
        filtered['Step 6'].forEach((row) => {
          const sbe2 = String(row['SBE-2'])
          if (filteredPurchaseData[sbe2]) {
            const quantities = {
              '2022': parseInt(String(row['2022 QTY'])) || 0,
              '2023': parseInt(String(row['2023 QTY'])) || 0,
              '2024': parseInt(String(row['2024 QTY'])) || 0,
              '2025': parseInt(String(row['2025 QTY'])) || 0,
            }
            
            filteredPurchaseData[sbe2].quantities['2022'] += quantities['2022']
            filteredPurchaseData[sbe2].quantities['2023'] += quantities['2023']
            filteredPurchaseData[sbe2].quantities['2024'] += quantities['2024']
            filteredPurchaseData[sbe2].quantities['2025'] += quantities['2025']
            
            filteredPurchaseData[sbe2].totalQuantity = 
              Object.values(filteredPurchaseData[sbe2].quantities).reduce((sum, qty) => sum + qty, 0)
            filteredPurchaseData[sbe2].isPurchased = filteredPurchaseData[sbe2].totalQuantity > 0
          }
        })

        // Add Territory Lookback information
        let hasAnyTerritoryLookbackData = false;
        const territoryLookbackCounts: { [key: string]: number } = {};
        const latestActivityDates: { [key: string]: Date } = {};

        filtered['Territory Lookback'].forEach((row) => {
          const sbe2 = String(row['SBE-2']);
          const activityDate = parseDate(row['Activity Date']);
          
          if (filteredPurchaseData[sbe2]) {
            territoryLookbackCounts[sbe2] = (territoryLookbackCounts[sbe2] || 0) + 1;
            
            if (activityDate && (!latestActivityDates[sbe2] || activityDate > latestActivityDates[sbe2])) {
              latestActivityDates[sbe2] = activityDate;
            }

            if (!filteredPurchaseData[sbe2].territoryLookback) {
              filteredPurchaseData[sbe2].territoryLookback = {
                activityDate: null,
                contactName: String(row['Contact Name']) || '',
                email: String(row['Email']) || '',
                gpn: String(row['GPN']) || '',
                activityType: String(row['Activity Type']) || '',
                appearanceCount: 0
              };
            }
            hasAnyTerritoryLookbackData = true;
          }
        });

        // Update filteredPurchaseData with the latest activity date and appearance count
        Object.keys(filteredPurchaseData).forEach((sbe2) => {
          if (filteredPurchaseData[sbe2].territoryLookback) {
            filteredPurchaseData[sbe2].territoryLookback!.activityDate = latestActivityDates[sbe2] || null;
            filteredPurchaseData[sbe2].territoryLookback!.appearanceCount = territoryLookbackCounts[sbe2] || 0;
          }
        });

        setHasTerritoryLookbackData(hasAnyTerritoryLookbackData)
        setPurchaseData(filteredPurchaseData)
      }
    } else {
      setFilteredData(null)
      setChartData([])
      setChartTitle('SBE2 Performance Chart')
      setPurchaseData({})
      setHasTerritoryLookbackData(false)
    }
  }, [processedData, accountName, selectedEE, overallMedianQuantity])

  const getPurchaseStatusColor = (totalQuantity: number, averageQuantity: number): string => {
    if (totalQuantity === 0) return 'bg-red-100'
    if (totalQuantity > 0.25 * averageQuantity) return 'bg-green-100'
    return 'bg-yellow-100'
  }

  const prepareSBE2Data = (): SBE2Data[] => {
    const data = Object.entries(purchaseData).map(([name, data]) => {
      const weightItem = weightData.find(item => item.sbe2 === name);
      const opportunitySize = weightItem ? weightItem.weight * (overallMedianQuantity || 0) : 0;
      return {
        name,
        inBarGraph: chartData.some(item => item.name === name),
        purchaseStatus: getPurchaseStatusColor(data.totalQuantity, overallMedianQuantity || 0) === 'bg-red-100' ? 'red' :
                        getPurchaseStatusColor(data.totalQuantity, overallMedianQuantity || 0) === 'bg-yellow-100' ? 'orange' : 'green',
        hasTerritoryLookback: !!data.territoryLookback,
        opportunitySize,
        rank: 0 // This will be updated later
      };
    }).sort((a, b) => b.opportunitySize - a.opportunitySize);

    // Assign ranks based on sorted order
    data.forEach((item, index) => {
      item.rank = index + 1;
    });

    return data;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Excel File Processor</h1>
      <div className="mb-4">
        <Input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="w-full" />
      </div>
      <Button onClick={processExcel} className="mb-4 bg-black text-white hover:bg-gray-800">Process Excel File</Button>
      {processedData && (
        <div className="mb-4 space-y-2">
          <Input
            type="text"
            placeholder="Filter by Account Name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="w-full"
          />
          <Select value={selectedEE} onValueChange={setSelectedEE}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select End Equipment" />
            </SelectTrigger>
            <SelectContent>
              {eeOptions.map((ee) => (
                <SelectItem key={ee} value={ee}>
                  {ee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <TabsTrigger value="heatmap" className="data-[state=active]:bg-white data-[state=active]:text-black">Heatmap</TabsTrigger>
            <TabsTrigger value="weights" className="data-[state=active]:bg-white data-[state=active]:text-black">Weights</TabsTrigger>
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
                  <Card key={sbe2} className={getPurchaseStatusColor(data.totalQuantity, overallMedianQuantity || 0)}>
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
                          <p>Latest Activity Date: {data.territoryLookback.activityDate ? data.territoryLookback.activityDate.toLocaleString() : 'N/A'}</p>
                          <p>Contact Name: {data.territoryLookback.contactName}</p>
                          <p>Email: {data.territoryLookback.email}</p>
                          <p>GPN: {data.territoryLookback.gpn}</p>
                          <p>Activity Type: {data.territoryLookback.activityType}</p>
                          <p>Appearances in Territory Lookback: {data.territoryLookback.appearanceCount}</p>
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
                  Overall Average Quantity of Purchased Devices: {overallMedianQuantity.toFixed(2)}
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
              <SBE2Suggestions sbe2Data={prepareSBE2Data()} />
            </div>
          </TabsContent>
          <TabsContent value="alerts">
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4">New GPN Quote Alerts</h2>
              {filteredData && filteredData['Alerts'] &&  filteredData['Alerts'].length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {(filteredData['Alerts'] as AlertData[])
                    .filter((row) => row['Alert Description'] === 'New GPN Quote' && row['Account Name'].toLowerCase().includes(accountName.toLowerCase()))
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
          <TabsContent value="heatmap">
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4">SBE-2 Opportunity Size Heatmap</h2>
              <SBE2Heatmap sbe2Data={prepareSBE2Data()} />
            </div>
          </TabsContent>
          <TabsContent value="weights">
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4">SBE-2 Weights and Average Quantity</h2>
              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SBE-2</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Average Quantity</TableHead>
                        <TableHead>Opportunity Size</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weightData.map((item) => (
                        <TableRow key={item.sbe2}>
                          <TableCell>{item.sbe2}</TableCell>
                          <TableCell>{item.weight.toFixed(6)}</TableCell>
                          <TableCell>{overallMedianQuantity?.toFixed(2) || 'N/A'}</TableCell>
                          <TableCell>{(item.weight * (overallMedianQuantity || 0)).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}