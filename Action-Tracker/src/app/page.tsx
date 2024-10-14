'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog"
import { AlertTriangle, Pencil, Check, X, Search, Download, Upload, ArrowUpDown } from 'lucide-react'

interface EntryData {
  id: string
  account: string
  contactName: string
  projectName: string
  estimatedVolume: string
  estimatedDesignWindow: string
  whosAction: 'Me' | 'Customer' | 'BU' | 'TSR'
  actionCategory: 'Testing and Sampling' | 'Initial Reachouts' | 'Set Up Meeting' | 'Device Recommendations' | 'E2E/Troubleshooting' | 'C2R' | 'Miscellaneous'
  lastContactDate: string
}

const whosActionColors = {
  Me: 'bg-blue-100 text-blue-800',
  Customer: 'bg-green-100 text-green-800',
  BU: 'bg-yellow-100 text-yellow-800',
  TSR: 'bg-purple-100 text-purple-800',
}

const actionCategories = [
  'Testing and Sampling',
  'Initial Reachouts',
  'Set Up Meeting',
  'Device Recommendations',
  'E2E/Troubleshooting',
  'C2R',
  'Miscellaneous'
] as const

function calculateDaysSinceAction(lastContactDate: string) {
  const today = new Date()
  const contactDate = new Date(lastContactDate)
  const diffTime = Math.abs(today.getTime() - contactDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

function getColorForDays(days: number) {
  const maxDays = 30 // Adjust this value to change the scale
  const ratio = Math.min(days / maxDays, 1)
  const red = Math.round(255 * ratio)
  const green = Math.round(255 * (1 - ratio))
  return `rgb(${red}, ${green}, 0)`
}

function EditableCell({ value, onSave, type }: { value: string, onSave: (value: string) => void, type: 'date' | 'whosAction' | 'actionCategory' }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedValue, setEditedValue] = useState(value)

  const handleSave = () => {
    onSave(editedValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedValue(value)
    setIsEditing(false)
  }

  const renderValue = () => {
    if (type === 'date') {
      const days = calculateDaysSinceAction(value)
      return <span style={{ color: getColorForDays(days) }}>{days} days</span>
    } else if (type === 'whosAction') {
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${whosActionColors[value as keyof typeof whosActionColors]}`}>
          {value}
        </span>
      )
    } else {
      return value
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        {type === 'whosAction' ? (
          <Select value={editedValue} onValueChange={setEditedValue}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="Me">Me</SelectItem>
              <SelectItem value="Customer">Customer</SelectItem>
              <SelectItem value="BU">BU</SelectItem>
              <SelectItem value="TSR">TSR</SelectItem>
            </SelectContent>
          </Select>
        ) : type === 'actionCategory' ? (
          <Select value={editedValue} onValueChange={setEditedValue}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {actionCategories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            type="date"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className="w-full"
          />
        )}
        <Button size="sm" variant="default" onClick={handleSave}><Check className="h-4 w-4" /></Button>
        <Button size="sm" variant="outline" onClick={handleCancel}><X className="h-4 w-4" /></Button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between">
      {renderValue()}
      <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  )
}

function AlertsDialog({ entries }: { entries: EntryData[] }) {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Me' | 'Customer' | 'BU' | 'TSR'>('All')
  const alertEntries = entries.filter(entry => calculateDaysSinceAction(entry.lastContactDate) > 5)
  
  const filteredAlertEntries = selectedFilter === 'All' 
    ? alertEntries 
    : alertEntries.filter(entry => entry.whosAction === selectedFilter)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Show Alerts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alerts: Entries with over 5 days since last action</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <Label htmlFor="filter-whosAction">Filter by Who's Action</Label>
          <Select value={selectedFilter} onValueChange={(value) => setSelectedFilter(value as typeof selectedFilter)}>
            <SelectTrigger id="filter-whosAction">
              <SelectValue placeholder="Select filter" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Me">Me</SelectItem>
              <SelectItem value="Customer">Customer</SelectItem>
              <SelectItem value="BU">BU</SelectItem>
              <SelectItem value="TSR">TSR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredAlertEntries.length > 0 ? (
            <ul className="space-y-4">
              {filteredAlertEntries.map(entry => {
                const days = calculateDaysSinceAction(entry.lastContactDate)
                return (
                  <li key={entry.id} className="border-b pb-4">
                    <p><strong>Account:</strong> {entry.account}</p>
                    <p><strong>Contact:</strong> {entry.contactName}</p>
                    <p>
                      <strong>Days Since Action:</strong>{' '}
                      <span style={{ color: getColorForDays(days), fontWeight: 'bold' }}>
                        {days} days
                      </span>
                    </p>
                    <p><strong>Who's Action:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${whosActionColors[entry.whosAction]}`}>
                        {entry.whosAction}
                      </span>
                    </p>
                    <p><strong>Action Category:</strong> {entry.actionCategory}</p>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p>No alerts at this time for the selected filter.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EditEntryDialog({ entry, onSave, onClose }: { entry: EntryData, onSave: (updatedEntry: EntryData) => void, onClose: () => void }) {
  const [editedEntry, setEditedEntry] = useState<EntryData>(entry)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedEntry(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: 'whosAction' | 'actionCategory', value: string) => {
    setEditedEntry(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(editedEntry)
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(editedEntry).map(([key, value]) => {
              if (key === 'id') return null
              if (key === 'whosAction') {
                return (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>Who's Action</Label>
                    <Select onValueChange={(value) => handleSelectChange('whosAction', value)} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select who's action" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Me">Me</SelectItem>
                        <SelectItem value="Customer">Customer</SelectItem>
                        <SelectItem value="BU">BU</SelectItem>
                        <SelectItem value="TSR">TSR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )
              } else if (key === 'actionCategory') {
                return (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>Action Category</Label>
                    <Select onValueChange={(value) => handleSelectChange('actionCategory', value)} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select action category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {actionCategories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )
              }
              return (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>
                    {key === 'lastContactDate' ? 'Last Contact Date' : key.charAt(0).toUpperCase() + key.slice(1)}
                  </Label>
                  <Input
                    type={key === 'lastContactDate' ? 'date' : 'text'}
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )
            })}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DataEntryList({ entries, setEntries }: { entries: EntryData[], setEntries: React.Dispatch<React.SetStateAction<EntryData[]>> }) {
  const [editingEntry, setEditingEntry] = useState<EntryData | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [whosActionFilter, setWhosActionFilter] = useState<'All' | 'Me' | 'Customer' | 'BU' | 'TSR'>('All')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleCellEdit = (id: string, key: keyof EntryData, value: string) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, [key]: value } : entry
    ))
  }

  const handleEditEntry = (entry: EntryData) => {
    setEditingEntry(entry)
  }

  const handleSaveEdit = (updatedEntry: EntryData) => {
    setEntries(prev => prev.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ))
    setEditingEntry(null)
  }

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setEntries(prev => prev.filter(entry => entry.id !== id))
    }
  }

  const filteredAndSortedEntries = useMemo(() => {
    return entries
      .filter(entry =>
        entry.account.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (whosActionFilter === 'All' || entry.whosAction === whosActionFilter)
      )
      .sort((a, b) => {
        const daysA = calculateDaysSinceAction(a.lastContactDate)
        const daysB = calculateDaysSinceAction(b.lastContactDate)
        return sortOrder === 'asc' ? daysA - daysB : daysB - daysA
      })
  }, [entries, searchTerm, whosActionFilter, sortOrder])

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Data Entries</CardTitle>
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search by account name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="whosActionFilter">Filter by Who's Action:</Label>
            <Select value={whosActionFilter} onValueChange={(value) => setWhosActionFilter(value as typeof whosActionFilter)}>
              <SelectTrigger id="whosActionFilter" className="w-[180px]">
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Me">Me</SelectItem>
                <SelectItem value="Customer">Customer</SelectItem>
                <SelectItem value="BU">BU</SelectItem>
                <SelectItem value="TSR">TSR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredAndSortedEntries.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Contact Name</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Estimated Volume</TableHead>
                <TableHead>Estimated Design Window</TableHead>
                <TableHead>Who's Action</TableHead>
                <TableHead>Action Category</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={toggleSortOrder} className="flex items-center">
                    Days Since Action
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.account}</TableCell>
                  <TableCell>{entry.contactName}</TableCell>
                  <TableCell>{entry.projectName}</TableCell>
                  <TableCell>{entry.estimatedVolume}</TableCell>
                  <TableCell>{entry.estimatedDesignWindow}</TableCell>
                  <TableCell>
                    <EditableCell
                      value={entry.whosAction}
                      onSave={(value) => handleCellEdit(entry.id, 'whosAction', value)}
                      type="whosAction"
                    />
                  </TableCell>
                  <TableCell>
                    <EditableCell
                      value={entry.actionCategory}
                      onSave={(value) => handleCellEdit(entry.id, 'actionCategory', value)}
                      type="actionCategory"
                    />
                  </TableCell>
                  <TableCell>
                    <EditableCell
                      value={entry.lastContactDate}
                      onSave={(value) => handleCellEdit(entry.id, 'lastContactDate', value)}
                      type="date"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEditEntry(entry)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteEntry(entry.id)}>Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No entries found. Add some data using the Data Entry form or adjust your search.</p>
        )}
      </CardContent>
      {editingEntry && (
        <EditEntryDialog
          entry={editingEntry}
          onSave={handleSaveEdit}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </Card>
  )
}

function DataEntryForm({ addEntry }: { addEntry: (entry: Omit<EntryData, 'id'>) => void }) {
  const [newEntry, setNewEntry] = useState<Omit<EntryData, 'id'>>({
    account: '',
    contactName: '',
    projectName: '',
    estimatedVolume: '',
    estimatedDesignWindow: '',
    whosAction: 'Me',
    actionCategory: 'Testing and Sampling',
    lastContactDate: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEntry(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: 'whosAction' | 'actionCategory', value: string) => {
    setNewEntry(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addEntry(newEntry)
    setNewEntry({
      account: '',
      contactName: '',
      projectName: '',
      estimatedVolume: '',
      estimatedDesignWindow: '',
      whosAction: 'Me',
      actionCategory: 'Testing and Sampling',
      lastContactDate: '',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(newEntry).map(([key, value]) => {
              if (key === 'whosAction') {
                return (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>Who's Action</Label>
                    <Select onValueChange={(value) => handleSelectChange('whosAction', value)} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select who's action" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Me">Me</SelectItem>
                        <SelectItem value="Customer">Customer</SelectItem>
                        <SelectItem value="BU">BU</SelectItem>
                        <SelectItem value="TSR">TSR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )
              } else if (key === 'actionCategory') {
                return (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>Action Category</Label>
                    <Select onValueChange={(value) => handleSelectChange('actionCategory', value)} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select action category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {actionCategories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )
              }
              return (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>
                    {key === 'lastContactDate' ? 'Last Contact Date' : key.charAt(0).toUpperCase() + key.slice(1)}
                  </Label>
                  <Input
                    type={key === 'lastContactDate' ? 'date' : 'text'}
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )
            })}
          </div>
          <Button type="submit" variant="default" className="w-full">Add Entry</Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function OfflineDataManagementApp() {
  const [entries, setEntries] = useState<EntryData[]>([])
  const [showDataEntry, setShowDataEntry] = useState(false)

  useEffect(() => {
    const storedEntries = localStorage.getItem('offlineEntries')
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('offlineEntries', JSON.stringify(entries))
  }, [entries])

  const addEntry = (newEntry: Omit<EntryData, 'id'>) => {
    const id = Date.now().toString()
    setEntries(prev => [...prev, { id, ...newEntry }])
  }

  const handleBackup = () => {
    const dataStr = JSON.stringify(entries)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'data_backup.json'

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result
        if (typeof content === 'string') {
          try {
            const parsedData = JSON.parse(content)
            setEntries(parsedData)
          } catch (error) {
            console.error('Error parsing JSON:', error)
            alert('Invalid backup file')
          }
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Offline Data Management App</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-2">
          <Button variant="default" onClick={() => setShowDataEntry(!showDataEntry)}>
            {showDataEntry ? 'Back to Data Management' : 'Go to Data Entry'}
          </Button>
          <Button variant="outline" onClick={handleBackup}>
            <Download className="mr-2 h-4 w-4" />
            Backup Data
          </Button>
          <Label htmlFor="restore-backup" className="cursor-pointer">
            <Input
              id="restore-backup"
              type="file"
              className="hidden"
              onChange={handleRestore}
              accept=".json"
            />
            <Button variant="outline" asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Restore Backup
              </span>
            </Button>
          </Label>
        </div>
        <AlertsDialog entries={entries} />
      </div>
      {showDataEntry ? (
        <DataEntryForm addEntry={addEntry} />
      ) : (
        <DataEntryList entries={entries} setEntries={setEntries} />
      )}
    </div>
  )
}