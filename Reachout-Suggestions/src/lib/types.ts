export type SheetData = {
  [key: string]: Record<string, string | number | boolean | null>[]
}

export type ChartData = {
  name: string
  'AA Projects %ID': number
  'AA Project %WIN': number
  'MyPPM Projects %Convert': number
}

export type TerritoryLookbackInfo = {
  activityDate: Date | null
  contactName: string
  email: string
  gpn: string
  activityType: string
} | null

export type PurchaseData = {
  [sbe2: string]: {
    isPurchased: boolean
    quantities: {
      [year: string]: number
    }
    totalQuantity: number
    territoryLookback: TerritoryLookbackInfo
  }
}

export type AlertData = {
  'Alert Description': string
  'Account Name': string
  'Activity Date': string
  'Contact Email': string
  GPN: string
  Detail: string
  'PPM Project List': string
}

export type SheetName = 'PPM Accel' | 'Alerts' | 'PPM' | 'Step 6' | 'Territory Lookback'