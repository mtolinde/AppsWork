import { SheetData } from './types'

export const cleanColumnName = (name: string): string => {
  return name.trim().replace(/\s+/g, ' ').toLowerCase()
}

export const convertToPercentage = (value: string | number): number => {
  const num = parseFloat(String(value))
  return isNaN(num) ? 0 : num * 100
}

export const parseDate = (dateString: string): Date | null => {
  if (!dateString || typeof dateString !== 'string') {
    return null
  }
  
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? null : date
}

export const filterDataByAccount = (data: SheetData, accountName: string, accountColumn: string): SheetData => {
  return Object.fromEntries(
    Object.entries(data).map(([sheetName, sheetData]) => [
      sheetName,
      sheetData.filter((row) => 
        String(row[accountColumn]).toLowerCase().includes(accountName.toLowerCase())
      )
    ])
  )
}