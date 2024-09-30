"use client"

import { useState, useMemo, ChangeEvent, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, ExternalLink, Trash, Download, Upload } from "lucide-react"

interface AccountCategory {
  name: string;
  color: string;
}

interface Account {
  accountName: string;
  accountCategory: string;
  contactsReachedOut: string;
  relevantSBE1: string;
  relevantSBE2: string;
  subFamily: string;
  newFamily: string;
  collateralLink: string;
  dateSent: string;
  accountSize: string;
  views: string;
  responses: string;
  translatedConverts: string;
  estimatedRevenue: string;
}

const accountCategories: AccountCategory[] = [
  { name: "All", color: "bg-gray-100 text-gray-800" },
  { name: "HVAC 1", color: "bg-blue-100 text-blue-800" },
  { name: "HVAC 2", color: "bg-blue-200 text-blue-800" },
  { name: "Fire Safety", color: "bg-red-100 text-red-800" },
  { name: "Sprinkler/Sanitation", color: "bg-green-100 text-green-800" },
  { name: "Elevator/Escalator", color: "bg-yellow-100 text-yellow-800" },
  { name: "Digital Signage", color: "bg-purple-100 text-purple-800" }
]

const getColorClass = (value: string, max: number): string => {
  const percentage = (Number(value) / max) * 100
  if (percentage < 33) return 'bg-red-100 text-red-800'
  if (percentage < 66) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

export default function AccountDataManager() {
  const [showForm, setShowForm] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>('All')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([
    {
      accountName: 'Acme Corp',
      accountCategory: 'HVAC 1',
      contactsReachedOut: '50',
      relevantSBE1: 'SBE-A',
      relevantSBE2: 'SBE-B',
      subFamily: 'Sub-1',
      newFamily: 'Yes',
      collateralLink: 'https://example.com',
      dateSent: '2023-05-15',
      accountSize: 'Large',
      views: '1000',
      responses: '150',
      translatedConverts: '75',
      estimatedRevenue: '50000'
    },
    {
      accountName: 'TechSolutions Inc',
      accountCategory: 'Digital Signage',
      contactsReachedOut: '30',
      relevantSBE1: 'SBE-C',
      relevantSBE2: 'SBE-D',
      subFamily: 'Sub-2',
      newFamily: 'No',
      collateralLink: 'https://example2.com',
      dateSent: '2023-05-20',
      accountSize: 'Medium',
      views: '500',
      responses: '80',
      translatedConverts: '40',
      estimatedRevenue: '30000'
    }
  ])
  const [formData, setFormData] = useState<Account>({
    accountName: '',
    accountCategory: '',
    contactsReachedOut: '',
    relevantSBE1: '',
    relevantSBE2: '',
    subFamily: '',
    newFamily: '',
    collateralLink: '',
    dateSent: '',
    accountSize: '',
    views: '',
    responses: '',
    translatedConverts: '',
    estimatedRevenue: ''
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingIndex !== null) {
      const updatedAccounts = [...accounts]
      updatedAccounts[editingIndex] = formData
      setAccounts(updatedAccounts)
      setEditingIndex(null)
    } else {
      setAccounts([...accounts, formData])
    }
    setFormData({
      accountName: '',
      accountCategory: '',
      contactsReachedOut: '',
      relevantSBE1: '',
      relevantSBE2: '',
      subFamily: '',
      newFamily: '',
      collateralLink: '',
      dateSent: '',
      accountSize: '',
      views: '',
      responses: '',
      translatedConverts: '',
      estimatedRevenue: ''
    })
    setShowForm(false)
  }

  const handleEdit = (index: number) => {
    setFormData(accounts[index])
    setEditingIndex(index)
    setShowForm(true)
  }

  const handleDelete = (index: number) => {
    const updatedAccounts = accounts.filter((_, i) => i !== index)
    setAccounts(updatedAccounts)
  }

  const handleSaveBackup = () => {
    const dataStr = JSON.stringify(accounts)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'account_data_backup.json'

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleUploadBackup = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result
        if (typeof content === 'string') {
          try {
            const parsedData = JSON.parse(content)
            setAccounts(parsedData)
          } catch (error) {
            console.error('Error parsing JSON:', error)
            alert('Invalid backup file')
          }
        }
      }
      reader.readAsText(file)
    }
  }

  const filteredAccounts = useMemo(() => {
    return accounts.filter(account => 
      account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeTab === 'All' || account.accountCategory === activeTab)
    )
  }, [accounts, searchTerm, activeTab])

  const maxValues = useMemo(() => {
    return {
      views: Math.max(...filteredAccounts.map(a => Number(a.views) || 0), 0),
      responses: Math.max(...filteredAccounts.map(a => Number(a.responses) || 0), 0),
      translatedConverts: Math.max(...filteredAccounts.map(a => Number(a.translatedConverts) || 0), 0),
      estimatedRevenue: Math.max(...filteredAccounts.map(a => Number(a.estimatedRevenue) || 0), 0)
    }
  }, [filteredAccounts])

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex justify-between items-center">
            Account Data
            <div className="space-x-2">
              <Button onClick={() => { setEditingIndex(null); setShowForm(true); }}>Add New Data</Button>
              <Button onClick={handleSaveBackup} variant="outline">
                <Download className="mr-2 h-4 w-4" /> Save Backup
              </Button>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                <Upload className="mr-2 h-4 w-4" /> Upload Backup
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUploadBackup}
                style={{ display: 'none' }}
                accept=".json"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search by account name..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              {accountCategories.map((category) => (
                <TabsTrigger key={category.name} value={category.name}>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                    {category.name}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
            {accountCategories.map((category) => (
              <TabsContent key={category.name} value={category.name}>
                {filteredAccounts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Account Name</TableHead>
                          <TableHead>Account Category</TableHead>
                          <TableHead>Contacts Reached</TableHead>
                          <TableHead>Relevant SBE-1</TableHead>
                          <TableHead>Relevant SBE-2</TableHead>
                          <TableHead>Sub Family</TableHead>
                          <TableHead>New Family?</TableHead>
                          <TableHead>Collateral Link</TableHead>
                          <TableHead>Date Sent</TableHead>
                          <TableHead>Account Size</TableHead>
                          <TableHead>Views</TableHead>
                          <TableHead>Responses</TableHead>
                          <TableHead>Translated Converts</TableHead>
                          <TableHead>Estimated Revenue</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAccounts.map((account, index) => (
                          <TableRow key={index}>
                            <TableCell>{account.accountName}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${accountCategories.find(c => c.name === account.accountCategory)?.color || 'bg-gray-100 text-gray-800'}`}>
                                {account.accountCategory}
                              </span>
                            </TableCell>
                            <TableCell>{account.contactsReachedOut}</TableCell>
                            <TableCell>{account.relevantSBE1}</TableCell>
                            <TableCell>{account.relevantSBE2}</TableCell>
                            <TableCell>{account.subFamily}</TableCell>
                            <TableCell>{account.newFamily}</TableCell>
                            <TableCell>
                              <a href={account.collateralLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                                Link <ExternalLink className="ml-1 h-4 w-4" />
                              </a>
                            </TableCell>
                            <TableCell>{account.dateSent}</TableCell>
                            <TableCell>{account.accountSize}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorClass(account.views, maxValues.views)}`}>
                                {account.views}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorClass(account.responses, maxValues.responses)}`}>
                                {account.responses}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorClass(account.translatedConverts, maxValues.translatedConverts)}`}>
                                {account.translatedConverts}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorClass(account.estimatedRevenue, maxValues.estimatedRevenue)}`}>
                                {account.estimatedRevenue}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(accounts.indexOf(account))}
                                  aria-label={`Edit ${account.accountName}`}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(accounts.indexOf(account))}
                                  aria-label={`Delete ${account.accountName}`}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground mt-4">No matching accounts found.</p>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {showForm && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{editingIndex !== null ? 'Edit Account Data' : 'Add New Account Data'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input id="accountName" name="accountName" value={formData.accountName} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountCategory">Account Category</Label>
                  <Select name="accountCategory" onValueChange={handleSelectChange('accountCategory')} value={formData.accountCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountCategories.slice(1).map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>{category.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactsReachedOut">Number of Contacts Reached Out To</Label>
                  <Input id="contactsReachedOut" name="contactsReachedOut" type="number" value={formData.contactsReachedOut} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relevantSBE1">Relevant SBE-1</Label>
                  <Input id="relevantSBE1" name="relevantSBE1" value={formData.relevantSBE1} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relevantSBE2">Relevant SBE-2</Label>
                  <Input id="relevantSBE2" name="relevantSBE2" value={formData.relevantSBE2} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subFamily">Sub Family</Label>
                  <Input id="subFamily" name="subFamily" value={formData.subFamily} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newFamily">New Family?</Label>
                  <Select name="newFamily" onValueChange={handleSelectChange('newFamily')} value={formData.newFamily}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collateralLink">Link to Collateral Sent</Label>
                  <Input id="collateralLink" name="collateralLink" type="url" value={formData.collateralLink} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateSent">Date Sent</Label>
                  <Input id="dateSent" name="dateSent" type="date" value={formData.dateSent} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountSize">Account Size?</Label>
                  <Input id="accountSize" name="accountSize" value={formData.accountSize} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="views"># of Views</Label>
                  <Input id="views" name="views" type="number" value={formData.views} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responses"># of Responses</Label>
                  <Input id="responses" name="responses" type="number" value={formData.responses} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="translatedConverts"># of Translated Converts</Label>
                  <Input id="translatedConverts" name="translatedConverts" type="number" value={formData.translatedConverts} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedRevenue">Estimated Revenue</Label>
                  <Input id="estimatedRevenue" name="estimatedRevenue" type="number" value={formData.estimatedRevenue} onChange={handleInputChange} />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingIndex(null); }}>Cancel</Button>
                <Button type="submit">{editingIndex !== null ? 'Update' : 'Submit'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}