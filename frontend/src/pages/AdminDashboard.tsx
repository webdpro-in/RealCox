import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Building2, MapPin, Plus, Edit, Trash2, LogOut, Users, Home, BarChart, MessageSquare, Phone } from 'lucide-react'
import { useAdmin } from '@/hooks/useAdmin'
import { useToast } from '@/hooks/use-toast'
import { getCompanies, createCompany, updateCompany, deleteCompany, getLands, createLand, updateLand, deleteLand, getRequirements } from '@/lib/api'

interface Company {
  _id: string
  name: string
  description: string
  location: string
  contact: string
  email: string
}

interface Land {
  _id: string
  title: string
  location: string
  priceRange: string
  features: string
  description: string
  type: string
  companyId: string
  companyName?: string
  whatsappNumber?: string
}

interface Requirement {
  _id: string
  name: string
  phone: string
  propertyType: string
  location: string
  budget: string
  requirements: string
  createdAt: string
}

const AdminDashboard = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [lands, setLands] = useState<Land[]>([])
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState('dashboard')
  
  // Company form states
  const [companyForm, setCompanyForm] = useState({
    name: '',
    description: '',
    location: '',
    contact: '',
    email: ''
  })
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false)
  
  // Land form states
  const [landForm, setLandForm] = useState({
    title: '',
    location: '',
    priceRange: '',
    features: '',
    description: '',
    type: '',
    companyId: '',
    whatsappNumber: ''
  })
  const [editingLand, setEditingLand] = useState<Land | null>(null)
  const [landDialogOpen, setLandDialogOpen] = useState(false)

  const navigate = useNavigate()
  const { logout } = useAdmin()
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [companiesRes, landsRes, requirementsRes] = await Promise.all([
        getCompanies(),
        getLands(),
        getRequirements()
      ])
      
      if (companiesRes.success) setCompanies(companiesRes.data)
      if (landsRes.success) setLands(landsRes.data)
      if (requirementsRes.success) setRequirements(requirementsRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let result
      if (editingCompany) {
        result = await updateCompany(editingCompany._id, companyForm)
      } else {
        result = await createCompany(companyForm)
      }
      
      if (result.success) {
        toast({
          title: 'Success',
          description: `Company ${editingCompany ? 'updated' : 'created'} successfully`
        })
        setCompanyDialogOpen(false)
        setCompanyForm({ name: '', description: '', location: '', contact: '', email: '' })
        setEditingCompany(null)
        fetchData()
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save company',
        variant: 'destructive'
      })
    }
  }

  const handleLandSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const selectedCompany = companies.find(c => c._id === landForm.companyId)
      const landData = {
        ...landForm,
        companyName: selectedCompany?.name || ''
      }
      
      let result
      if (editingLand) {
        result = await updateLand(editingLand._id, landData)
      } else {
        result = await createLand(landData)
      }
      
      if (result.success) {
        toast({
          title: 'Success',
          description: `Property ${editingLand ? 'updated' : 'created'} successfully`
        })
        setLandDialogOpen(false)
        setLandForm({ title: '', location: '', priceRange: '', features: '', description: '', type: '', companyId: '', whatsappNumber: '' })
        setEditingLand(null)
        fetchData()
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save property',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteCompany = async (id: string) => {
    try {
      const result = await deleteCompany(id)
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Company deleted successfully'
        })
        fetchData()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete company',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteLand = async (id: string) => {
    try {
      const result = await deleteLand(id)
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Property deleted successfully'
        })
        fetchData()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete property',
        variant: 'destructive'
      })
    }
  }

  const addSampleData = async () => {
    try {
      // Sample companies
      const sampleCompanies = [
        {
          name: "Green Valley Developers",
          description: "Premium residential and commercial development company specializing in eco-friendly projects",
          location: "Hyderabad, Telangana",
          contact: "+91 9876543210",
          email: "info@greenvalley.com"
        },
        {
          name: "Urban Spaces Ltd",
          description: "Modern urban development with focus on smart city solutions and luxury housing",
          location: "Bangalore, Karnataka", 
          contact: "+91 9876543211",
          email: "contact@urbanspaces.com"
        },
        {
          name: "Prime Properties Group",
          description: "Leading real estate developer with 20+ years of experience in residential and commercial projects",
          location: "Mumbai, Maharashtra",
          contact: "+91 9876543212", 
          email: "sales@primeproperties.com"
        }
      ]

      // Create sample companies
      for (const company of sampleCompanies) {
        await createCompany(company)
      }

      // Wait for companies to be created, then fetch them
      await fetchData()
      
      // Get the created companies for land creation
      const companiesResponse = await getCompanies()
      if (companiesResponse.success && companiesResponse.data.length > 0) {
        const createdCompanies = companiesResponse.data

        // Sample lands for each company
        const sampleLands = [
          // Green Valley Developers properties
          {
            title: "Green Valley Residency - Phase 1",
            location: "Gachibowli, Hyderabad",
            priceRange: "₹45 Lakhs - ₹85 Lakhs",
            features: "2/3 BHK Apartments, Swimming Pool, Gym, Children's Play Area",
            description: "Premium residential apartments with modern amenities and green spaces",
            type: "residential",
            companyId: createdCompanies[0]._id,
            companyName: createdCompanies[0].name,
            whatsappNumber: "+91 9876543210"
          },
          {
            title: "Eco Commercial Hub",
            location: "HITEC City, Hyderabad", 
            priceRange: "₹75 Lakhs - ₹2 Crores",
            features: "Office Spaces, Retail Outlets, Food Court, Parking",
            description: "Modern commercial complex with sustainable design and prime location",
            type: "commercial",
            companyId: createdCompanies[0]._id,
            companyName: createdCompanies[0].name,
            whatsappNumber: "+91 9876543210"
          },
          // Urban Spaces Ltd properties
          {
            title: "Urban Heights Tower",
            location: "Whitefield, Bangalore",
            priceRange: "₹65 Lakhs - ₹1.2 Crores", 
            features: "3/4 BHK Penthouses, Rooftop Garden, Club House, Security",
            description: "Luxury high-rise apartments with panoramic city views",
            type: "residential",
            companyId: createdCompanies[1]._id,
            companyName: createdCompanies[1].name,
            whatsappNumber: "+91 9876543211"
          },
          {
            title: "Tech Park Plaza",
            location: "Electronic City, Bangalore",
            priceRange: "₹50 Lakhs - ₹3 Crores",
            features: "IT Offices, Conference Rooms, Cafeteria, 24/7 Security",
            description: "State-of-the-art commercial space designed for tech companies",
            type: "commercial", 
            companyId: createdCompanies[1]._id,
            companyName: createdCompanies[1].name,
            whatsappNumber: "+91 9876543211"
          },
          // Prime Properties Group properties
          {
            title: "Prime Luxury Villas",
            location: "Juhu, Mumbai",
            priceRange: "₹3 Crores - ₹8 Crores",
            features: "4/5 BHK Villas, Private Garden, Swimming Pool, Servant Quarters",
            description: "Exclusive luxury villas near the beach with world-class amenities",
            type: "villa",
            companyId: createdCompanies[2]._id,
            companyName: createdCompanies[2].name,
            whatsappNumber: "+91 9876543212"
          },
          {
            title: "Prime Business Center",
            location: "BKC, Mumbai",
            priceRange: "₹1 Crore - ₹5 Crores",
            features: "Premium Offices, Meeting Rooms, Concierge Service, Valet Parking",
            description: "Premium commercial space in Mumbai's financial district",
            type: "commercial",
            companyId: createdCompanies[2]._id,
            companyName: createdCompanies[2].name,
            whatsappNumber: "+91 9876543212"
          }
        ]

        // Create sample lands
        for (const land of sampleLands) {
          await createLand(land)
        }
      }

      await fetchData()
      
      toast({
        title: 'Success',
        description: 'Sample data added successfully! Companies and properties have been created.'
      })
    } catch (error) {
      toast({
        title: 'Error', 
        description: 'Failed to add sample data',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            {/* Header with Logo and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  RealCox Admin
                </h1>
                <p className="text-sm text-muted-foreground">Admin Dashboard</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Button variant="outline" onClick={() => navigate('/')} size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">View Website</span>
                  <span className="sm:hidden">Website</span>
                </Button>
                <Button variant="outline" onClick={handleLogout} size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">Exit</span>
                </Button>
              </div>
            </div>
            
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={activeView === 'dashboard' ? 'default' : 'ghost'} 
                  onClick={() => setActiveView('dashboard')}
                  className="justify-start"
                  size="sm"
                >
                  <BarChart className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  variant={activeView === 'companies' ? 'default' : 'ghost'} 
                  onClick={() => setActiveView('companies')}
                  className="justify-start"
                  size="sm"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Companies
                </Button>
                <Button 
                  variant={activeView === 'lands' ? 'default' : 'ghost'} 
                  onClick={() => setActiveView('lands')}
                  className="justify-start"
                  size="sm"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Properties
                </Button>
                <Button 
                  variant={activeView === 'requirements' ? 'default' : 'ghost'} 
                  onClick={() => setActiveView('requirements')}
                  className="justify-start"
                  size="sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Requirements
                </Button>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Button 
                variant={activeView === 'dashboard' ? 'default' : 'ghost'} 
                onClick={() => setActiveView('dashboard')}
                className="flex items-center gap-2"
              >
                <BarChart className="w-4 h-4" />
                Dashboard
              </Button>
              <Button 
                variant={activeView === 'companies' ? 'default' : 'ghost'} 
                onClick={() => setActiveView('companies')}
                className="flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                Companies
              </Button>
              <Button 
                variant={activeView === 'lands' ? 'default' : 'ghost'} 
                onClick={() => setActiveView('lands')}
                className="flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Properties
              </Button>
              <Button 
                variant={activeView === 'requirements' ? 'default' : 'ghost'} 
                onClick={() => setActiveView('requirements')}
                className="flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Requirements
              </Button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Overview */}
        {activeView === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold">Dashboard Overview</h2>
              <Button onClick={addSampleData} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Sample Data
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{companies.length}</div>
                  <p className="text-xs text-muted-foreground">Active real estate companies</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{lands.length}</div>
                  <p className="text-xs text-muted-foreground">Listed properties</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Requirements</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{requirements.length}</div>
                  <p className="text-xs text-muted-foreground">Customer inquiries</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  {companies.slice(0, 3).map((company) => (
                    <div key={company._id} className="flex items-center gap-3 py-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{company.name}</p>
                        <p className="text-sm text-muted-foreground">{company.location}</p>
                      </div>
                    </div>
                  ))}
                  {companies.length === 0 && (
                    <p className="text-muted-foreground">No companies added yet</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  {lands.slice(0, 3).map((land) => (
                    <div key={land._id} className="flex items-center gap-3 py-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{land.title}</p>
                        <p className="text-sm text-muted-foreground">{land.location}</p>
                      </div>
                    </div>
                  ))}
                  {lands.length === 0 && (
                    <p className="text-muted-foreground">No properties added yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Companies Management */}
        {activeView === 'companies' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold">Manage Companies</h2>
              <Dialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingCompany(null)
                    setCompanyForm({ name: '', description: '', location: '', contact: '', email: '' })
                  }} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Company
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingCompany ? 'Edit Company' : 'Add New Company'}</DialogTitle>
                    <DialogDescription>
                      {editingCompany ? 'Update company information' : 'Create a new company profile'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCompanySubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Company Name</Label>
                      <Input
                        id="name"
                        value={companyForm.name}
                        onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={companyForm.description}
                        onChange={(e) => setCompanyForm({...companyForm, description: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={companyForm.location}
                        onChange={(e) => setCompanyForm({...companyForm, location: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact">Contact</Label>
                      <Input
                        id="contact"
                        value={companyForm.contact}
                        onChange={(e) => setCompanyForm({...companyForm, contact: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={companyForm.email}
                        onChange={(e) => setCompanyForm({...companyForm, email: e.target.value})}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      {editingCompany ? 'Update Company' : 'Create Company'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <Card key={company._id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span className="text-lg">{company.name}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingCompany(company)
                            setCompanyForm({
                              name: company.name,
                              description: company.description,
                              location: company.location,
                              contact: company.contact,
                              email: company.email
                            })
                            setCompanyDialogOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Company</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {company.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCompany(company._id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardTitle>
                    <CardDescription>{company.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {company.location}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {company.contact}
                      </p>
                      <p className="flex items-center gap-2">
                        <span>✉️</span>
                        {company.email}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {companies.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Companies Yet</h3>
                  <p className="text-muted-foreground mb-4">Start by adding your first company</p>
                  <Button onClick={addSampleData}>Add Sample Data</Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Properties Management */}
        {activeView === 'lands' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold">Manage Properties</h2>
              <Dialog open={landDialogOpen} onOpenChange={setLandDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingLand(null)
                    setLandForm({ title: '', location: '', priceRange: '', features: '', description: '', type: '', companyId: '', whatsappNumber: '' })
                  }} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Property
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingLand ? 'Edit Property' : 'Add New Property'}</DialogTitle>
                    <DialogDescription>
                      {editingLand ? 'Update property information' : 'Create a new property listing'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleLandSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Property Title</Label>
                      <Input
                        id="title"
                        value={landForm.title}
                        onChange={(e) => setLandForm({...landForm, title: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyId">Company</Label>
                      <Select 
                        value={landForm.companyId} 
                        onValueChange={(value) => setLandForm({...landForm, companyId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company._id} value={company._id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="type">Property Type</Label>
                      <Select 
                        value={landForm.type} 
                        onValueChange={(value) => setLandForm({...landForm, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">Residential</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="land">Land/Plot</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="office">Office</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={landForm.location}
                        onChange={(e) => setLandForm({...landForm, location: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="priceRange">Price Range</Label>
                      <Input
                        id="priceRange"
                        value={landForm.priceRange}
                        onChange={(e) => setLandForm({...landForm, priceRange: e.target.value})}
                        placeholder="e.g., ₹50 Lakhs - ₹1 Crore"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="features">Key Features</Label>
                      <Input
                        id="features"
                        value={landForm.features}
                        onChange={(e) => setLandForm({...landForm, features: e.target.value})}
                        placeholder="e.g., 3 BHK, Swimming Pool, Gym"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsappNumber">WhatsApp Contact</Label>
                      <Input
                        id="whatsappNumber"
                        value={landForm.whatsappNumber}
                        onChange={(e) => setLandForm({...landForm, whatsappNumber: e.target.value})}
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={landForm.description}
                        onChange={(e) => setLandForm({...landForm, description: e.target.value})}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      {editingLand ? 'Update Property' : 'Create Property'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lands.map((land) => (
                <Card key={land._id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span className="text-lg">{land.title}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingLand(land)
                            setLandForm({
                              title: land.title,
                              location: land.location,
                              priceRange: land.priceRange,
                              features: land.features,
                              description: land.description,
                              type: land.type || '',
                              companyId: land.companyId,
                              whatsappNumber: land.whatsappNumber || ''
                            })
                            setLandDialogOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Property</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {land.title}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteLand(land._id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-md text-xs mr-2">
                        {land.type || 'Property'}
                      </span>
                      {land.companyName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {land.location}
                      </p>
                      <p className="font-semibold text-primary">{land.priceRange}</p>
                      <p className="text-muted-foreground">{land.features}</p>
                      {land.whatsappNumber && (
                        <Button 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={() => {
                            const message = `Hi, I'm interested in ${land.title} located at ${land.location}. Can you provide more details?`
                            window.open(`https://wa.me/${land.whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
                          }}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contact via WhatsApp
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {lands.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
                  <p className="text-muted-foreground mb-4">Add companies first, then create property listings</p>
                  {companies.length === 0 ? (
                    <Button onClick={addSampleData}>Add Sample Data</Button>
                  ) : (
                    <Button onClick={() => setLandDialogOpen(true)}>Add First Property</Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Requirements Management */}
        {activeView === 'requirements' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold">Customer Requirements</h2>
              <Button variant="outline" onClick={fetchData} size="sm">
                Refresh
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {requirements.map((req) => (
                <Card key={req._id}>
                  <CardHeader>
                    <CardTitle className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <span>{req.name}</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </CardTitle>
                    <CardDescription>
                      Property Type: {req.propertyType || 'Not specified'} | Budget: {req.budget || 'Not specified'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Contact Details:</p>
                        <p className="text-sm">📞 {req.phone}</p>
                        <p className="text-sm">📍 {req.location || 'Location not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Requirements:</p>
                        <p className="text-sm text-muted-foreground">{req.requirements}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                      <Button 
                        size="sm"
                        onClick={() => {
                          const message = `Hi ${req.name}, thank you for your property requirement. We have received your request for ${req.propertyType || 'property'} in ${req.location || 'your preferred location'}. Our team will contact you soon with suitable options.`
                          window.open(`https://wa.me/${req.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contact via WhatsApp
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          window.open(`tel:${req.phone}`)
                        }}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {requirements.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Requirements Yet</h3>
                  <p className="text-muted-foreground">Customer property requirements will appear here</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard