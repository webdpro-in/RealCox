import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Building2, MapPin, Plus, Edit, Trash2, LogOut, Users, Home, BarChart, MessageSquare, Phone, Eye, EyeOff, Lock, Mail, Upload, X, Image } from 'lucide-react'
import { useAdmin } from '@/hooks/useAdmin'
import { useToast } from '@/hooks/use-toast'
import { adminLogin, getCompanies, createCompany, updateCompany, deleteCompany, getLands, createLand, updateLand, deleteLand, getRequirements, uploadImage } from '@/lib/api'

interface Company {
  _id?: string
  name: string
  description: string
  location: string
  contact: string
  email: string
  logoUrl?: string
}

interface Land {
  _id?: string
  title: string
  location: string
  priceRange: string
  features: string
  description: string
  type: string
  companyId: string
  companyName?: string
  whatsappNumber?: string
  images?: string[]
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

const AdminPanel = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading, login, logout } = useAdmin()
  const { toast } = useToast()

  // Login Form State
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Main Data State
  const [companies, setCompanies] = useState<Company[]>([])
  const [lands, setLands] = useState<Land[]>([])
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [loading, setLoading] = useState(false)
  const [activeView, setActiveView] = useState<'dashboard' | 'companies' | 'properties' | 'requirements'>('dashboard')

  // Form States
  const [companyForm, setCompanyForm] = useState<Company>({
    name: '',
    description: '',
    location: '',
    contact: '',
    email: '',
    logoUrl: '',
  })

const [landForm, setLandForm] = useState<Land>({
    title: '',
    location: '',
    priceRange: '',
    features: '',
    description: '',
    type: '',
    companyId: '',
    whatsappNumber: '',
    images: []
  })

  // Dialog States
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false)
  const [landDialogOpen, setLandDialogOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [editingLand, setEditingLand] = useState<Land | null>(null)

  // Image Upload States
  const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null)
  const [landImageFiles, setLandImageFiles] = useState<File[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchData()
    }
  }, [isAuthenticated, authLoading])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [companiesRes, landsRes, requirementsRes] = await Promise.all([
        getCompanies(),
        getLands(),
        getRequirements()
      ])
      
      if (companiesRes.success) setCompanies(companiesRes.data || [])
      if (landsRes.success) setLands(landsRes.data || [])
      if (requirementsRes.success) setRequirements(requirementsRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    try {
      const response = await adminLogin(loginForm.email, loginForm.password)
      
      if (response.success) {
        login(response.token)
        toast({
          title: "Success",
          description: "Admin login successful",
        })
      } else {
        setLoginError(response.message || 'Login failed')
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Success",
      description: "Logged out successfully",
    })
  }

  const handleCompanyLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        })
        return
      }
      setCompanyLogoFile(file)
    }
  }

  const handleLandImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (landImageFiles.length + files.length > 4) {
      toast({
        title: "Error", 
        description: "Maximum 4 images allowed",
        variant: "destructive",
      })
      return
    }
    
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: `File ${file.name} is too large. Maximum 5MB allowed.`,
          variant: "destructive",
        })
        return false
      }
      return true
    })

    setLandImageFiles([...landImageFiles, ...validFiles])
  }

  const removeLandImage = (index: number) => {
    setLandImageFiles(landImageFiles.filter((_, i) => i !== index))
  }

  const uploadImages = async (files: File[], bucket: string, folder?: string) => {
    const uploadPromises = files.map(file => uploadImage(file, bucket, folder))
    const results = await Promise.all(uploadPromises)
    
    const successfulUploads = results
      .filter(result => result.success)
      .map(result => result.data.url)
    
    const failedUploads = results.filter(result => !result.success)
    
    if (failedUploads.length > 0) {
      toast({
        title: "Warning",
        description: `${failedUploads.length} image(s) failed to upload`,
        variant: "destructive",
      })
    }

    return successfulUploads
  }

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setUploadingImages(true)
      let logoUrl = companyForm.logoUrl

      // Upload logo if file selected
      if (companyLogoFile) {
        const uploadedUrls = await uploadImages([companyLogoFile], 'company-logos')
        
        if (uploadedUrls.length > 0) {
          logoUrl = uploadedUrls[0]
        }
      }

      const companyData = { ...companyForm, logoUrl }
      
      if (editingCompany) {
        const response = await updateCompany(editingCompany._id!, companyData)
        if (response.success) {
          toast({ title: "Success", description: "Company updated successfully" })
          fetchData()
        } else {
          throw new Error(response.message)
        }
      } else {
        const response = await createCompany(companyData)
        if (response.success) {
          toast({ title: "Success", description: "Company created successfully" })
          fetchData()
        } else {
          throw new Error(response.message)
        }
      }

      // Reset form
      // setCompanyForm({ name: '', description: '', location: '', contact: '', email: '', logoUrl: '' })
      setCompanyLogoFile(null)
      setCompanyDialogOpen(false)
      setEditingCompany(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save company",
        variant: "destructive",
      })
    } finally {
      setUploadingImages(false)
    }
  }

  const handleLandSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!landForm.companyId) {
      toast({
        title: "Error",
        description: "Please select a company",
        variant: "destructive",
      })
      return
    }

    if (landImageFiles.length === 0 && (!landForm.images || landForm.images.length === 0)) {
      toast({
        title: "Error", 
        description: "At least 1 image is required",
        variant: "destructive",
      })
      return
    }

    try {
      setUploadingImages(true)
      let images = landForm.images || []

      // Upload new images if any
      if (landImageFiles.length > 0) {
        const uploadedUrls = await uploadImages(landImageFiles, 'property-images')
        images = [...images, ...uploadedUrls]
      }

      const landData = { 
        ...landForm, 
        images: images.slice(0, 4) // Ensure max 4 images
      }
      
      if (editingLand) {
        const response = await updateLand(editingLand._id!, landData)
        if (response.success) {
          toast({ title: "Success", description: "Property updated successfully" })
          fetchData()
        } else {
          throw new Error(response.message)
        }
      } else {
        const response = await createLand(landData)
        if (response.success) {
          toast({ title: "Success", description: "Property created successfully" })
          fetchData()
        } else {
          throw new Error(response.message)
        }
      }

      // Reset form
      // setLandForm({
      //   title: '',
      //   location: '',
      //   priceRange: '',
      //   features: '',
      //   description: '',
      //   type: '',
      //   companyId: '',
      //   whatsappNumber: '',
      //   images: []
      // })
      setLandImageFiles([])
      setLandDialogOpen(false)
      setEditingLand(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save property",
        variant: "destructive",
      })
    } finally {
      setUploadingImages(false)
    }
  }

  const handleDeleteCompany = async (id: string) => {
    try {
      const response = await deleteCompany(id)
      if (response.success) {
        toast({ title: "Success", description: "Company deleted successfully" })
        fetchData()
      } else {
        throw new Error(response.message)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete company",
        variant: "destructive",
      })
    }
  }

  const handleDeleteLand = async (id: string) => {
    try {
      const response = await deleteLand(id)
      if (response.success) {
        toast({ title: "Success", description: "Property deleted successfully" })
        fetchData()
      } else {
        throw new Error(response.message)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete property",
        variant: "destructive",
      })
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Lock className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription>
              Access RealCox Admin Dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loginError && (
              <Alert className="mb-4" variant="destructive">
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter admin email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter admin password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white" 
                disabled={loginLoading}
              >
                {loginLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">RealCox Admin</h1>
                <p className="text-sm text-muted-foreground">Property Management System</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: BarChart },
              { key: 'companies', label: 'Companies', icon: Building2 },
              { key: 'properties', label: 'Properties', icon: Home },
              { key: 'requirements', label: 'Requirements', icon: MessageSquare },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveView(key as any)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeView === key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Building2 className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Total Companies</p>
                      <p className="text-2xl font-bold text-foreground">{companies.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Home className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Total Properties</p>
                      <p className="text-2xl font-bold text-foreground">{lands.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <MessageSquare className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Requirements</p>
                      <p className="text-2xl font-bold text-foreground">{requirements.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold text-foreground">-</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {companies.slice(0, 5).map((company) => (
                      <div key={company._id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                        {company.logoUrl && (
                          <img src={company.logoUrl} alt={company.name} className="h-8 w-8 rounded object-cover" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{company.name}</p>
                          <p className="text-xs text-muted-foreground">{company.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lands.slice(0, 5).map((land) => (
                      <div key={land._id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                        {land.images && land.images[0] && (
                          <img src={land.images[0]} alt={land.title} className="h-8 w-8 rounded object-cover" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{land.title}</p>
                          <p className="text-xs text-muted-foreground">{land.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeView === 'companies' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Companies</h2>
              <Dialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingCompany(null)
                    setCompanyForm({ name: '', description: '', location: '', contact: '', email: '', logoUrl: '' })
                    setCompanyLogoFile(null)
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Company
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>{editingCompany ? 'Edit Company' : 'Add New Company'}</DialogTitle>
                    <DialogDescription>
                      {editingCompany ? 'Update company information' : 'Create a new company profile with logo'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCompanySubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input
                          id="company-name"
                          value={companyForm.name}
                          onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-email">Email</Label>
                        <Input
                          id="company-email"
                          type="email"
                          value={companyForm.email}
                          onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company-description">Description</Label>
                      <Textarea
                        id="company-description"
                        value={companyForm.description}
                        onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-location">Location</Label>
                        <Input
                          id="company-location"
                          value={companyForm.location}
                          onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-contact">Contact</Label>
                        <Input
                          id="company-contact"
                          value={companyForm.contact}
                          onChange={(e) => setCompanyForm({ ...companyForm, contact: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-logo">Company Logo</Label>
                      <div className="flex items-center space-x-4">
                        {(companyLogoFile || companyForm.logoUrl) && (
                          <img 
                            src={companyLogoFile ? URL.createObjectURL(companyLogoFile) : companyForm.logoUrl} 
                            alt="Logo preview" 
                            className="h-16 w-16 rounded object-cover border"
                          />
                        )}
                        <Input
                          id="company-logo"
                          type="file"
                          accept="image/*"
                          onChange={handleCompanyLogoUpload}
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Upload 1 logo image (max 5MB)</p>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setCompanyDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={uploadingImages}>
                        {uploadingImages ? 'Uploading...' : editingCompany ? 'Update' : 'Create'}
                      </Button>
                    </div>
                  </form> 
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <Card key={company._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {company.logoUrl && (
                          <img src={company.logoUrl} alt={company.name} className="h-12 w-12 rounded object-cover border" />
                        )}
                        <div>
                          <CardTitle className="text-lg">{company.name}</CardTitle>
                          <CardDescription>{company.location}</CardDescription>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingCompany(company)
                            setCompanyForm(company)
                            setCompanyDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
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
                              <AlertDialogAction onClick={() => handleDeleteCompany(company._id!)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{company.description}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 mr-1" />
                      {company.contact}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeView === 'properties' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Properties</h2>
              <Dialog open={landDialogOpen} onOpenChange={setLandDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingLand(null)
                    setLandForm({
                      title: '',
                      location: '',
                      priceRange: '',
                      features: '',
                      description: '',
                      type: '',
                      companyId: '',
                      whatsappNumber: '',
                      images: []
                    })
                    setLandImageFiles([])
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingLand ? 'Edit Property' : 'Add New Property'}</DialogTitle>
                    <DialogDescription>
                      {editingLand ? 'Update property information' : 'Create a new property listing with images'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleLandSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="property-title">Property Title</Label>
                        <Input
                          id="property-title"
                          value={landForm.title}
                          onChange={(e) => setLandForm({ ...landForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="property-company">Company</Label>
                        <Select
                          value={landForm.companyId}
                          onValueChange={(value) => setLandForm({ ...landForm, companyId: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select company" />
                          </SelectTrigger>
                          <SelectContent>
                            {companies.map((company) => (
                              <SelectItem key={company._id} value={company._id!}>
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="property-location">Location</Label>
                        <Input
                          id="property-location"
                          value={landForm.location}
                          onChange={(e) => setLandForm({ ...landForm, location: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="property-price">Price Range</Label>
                        <Input
                          id="property-price"
                          value={landForm.priceRange}
                          onChange={(e) => setLandForm({ ...landForm, priceRange: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="property-type">Property Type</Label>
                        <Select
                          value={landForm.type}
                          onValueChange={(value) => setLandForm({ ...landForm, type: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Land">Land</SelectItem>
                            <SelectItem value="House">House</SelectItem>
                            <SelectItem value="Apartment">Apartment</SelectItem>
                            <SelectItem value="Commercial">Commercial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="property-whatsapp">WhatsApp Number</Label>
                        <Input
                          id="property-whatsapp"
                          value={landForm.whatsappNumber}
                          onChange={(e) => setLandForm({ ...landForm, whatsappNumber: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="property-features">Features</Label>
                      <Input
                        id="property-features"
                        value={landForm.features}
                        onChange={(e) => setLandForm({ ...landForm, features: e.target.value })}
                        placeholder="e.g., 3 BHK, Parking, Garden"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="property-description">Description</Label>
                      <Textarea
                        id="property-description"
                        value={landForm.description}
                        onChange={(e) => setLandForm({ ...landForm, description: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="property-images">Property Images</Label>
                      <Input
                        id="property-images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleLandImagesUpload}
                      />
                      <p className="text-xs text-muted-foreground">Upload 1-4 property images (max 5MB each)</p>
                      
                      {/* Display existing images */}
                      {landForm.images && landForm.images.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-2">Existing Images:</p>
                          <div className="flex flex-wrap gap-2">
                            {landForm.images.map((imageUrl, index) => (
                              <div key={index} className="relative">
                                <img src={imageUrl} alt={`Property ${index + 1}`} className="h-16 w-16 rounded object-cover border" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Display new images to upload */}
                      {landImageFiles.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-2">New Images to Upload:</p>
                          <div className="flex flex-wrap gap-2">
                            {landImageFiles.map((file, index) => (
                              <div key={index} className="relative">
                                <img 
                                  src={URL.createObjectURL(file)} 
                                  alt={`Upload ${index + 1}`} 
                                  className="h-16 w-16 rounded object-cover border" 
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                  onClick={() => removeLandImage(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setLandDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={uploadingImages}>
                        {uploadingImages ? 'Uploading...' : editingLand ? 'Update' : 'Create'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Property listings were commented out - uncommenting to fix the issue */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {lands.map((land) => (
                <Card key={land._id} className="hover:shadow-lg transition-shadow">
                  {land.images && land.images.length > 0 && (
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img 
                        src={land.images[0]} 
                        alt={land.title}
                        className="w-full h-full object-cover"
                      />
                      {land.images.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          +{land.images.length - 1} more
                        </div>
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{land.title}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {land.location}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {companies.find(c => c._id === land.companyId)?.name}
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingLand(land)
                            setLandForm(land)
                            setLandDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
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
                              <AlertDialogAction onClick={() => handleDeleteLand(land._id!)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{land.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-primary">{land.priceRange}</span>
                      <span className="text-muted-foreground">{land.type}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeView === 'requirements' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Customer Requirements</h2>
            
            <div className="grid gap-6">
              {requirements.map((requirement) => (
                <Card key={requirement._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{requirement.name}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="h-4 w-4 mr-1" />
                            {requirement.phone}
                          </div>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{requirement.propertyType}</p>
                        <p className="text-xs text-muted-foreground">{new Date(requirement.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium">Location:</p>
                        <p className="text-sm text-muted-foreground">{requirement.location}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Budget:</p>
                        <p className="text-sm text-muted-foreground">{requirement.budget}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Requirements:</p>
                      <p className="text-sm text-muted-foreground">{requirement.requirements}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel