const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-railway-app.railway.app/api' 
  : 'http://localhost:5000/api'

// Admin Authentication
export const adminLogin = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  
  return response.json()
}

// Companies API
export const getCompanies = async () => {
  const response = await fetch(`${API_URL}/companies`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  return response.json()
}

export const createCompany = async (companyData: any) => {
  const response = await fetch(`${API_URL}/companies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(companyData),
  })
  
  return response.json()
}

export const updateCompany = async (id: string, companyData: any) => {
  const response = await fetch(`${API_URL}/companies`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ...companyData }),
  })
  
  return response.json()
}

export const deleteCompany = async (id: string) => {
  const response = await fetch(`${API_URL}/companies`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  })
  
  return response.json()
}

// Lands API
export const getLands = async (companyId?: string) => {
  const url = companyId 
    ? `${API_URL}/lands?companyId=${companyId}`
    : `${API_URL}/lands`
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  return response.json()
}

export const createLand = async (landData: any) => {
  const response = await fetch(`${API_URL}/lands`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(landData),
  })
  
  return response.json()
}

export const updateLand = async (id: string, landData: any) => {
  const response = await fetch(`${API_URL}/lands`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ...landData }),
  })
  
  return response.json()
}

export const deleteLand = async (id: string) => {
  const response = await fetch(`${API_URL}/lands`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  })
  
  return response.json()
}

// Requirements API
export const submitRequirement = async (requirementData: any) => {
  const response = await fetch(`${API_URL}/requirements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requirementData),
  })
  
  return response.json()
}

export const getRequirements = async () => {
  const response = await fetch(`${API_URL}/requirements`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  return response.json()
}

// Image Upload API
export const uploadImage = async (file: File, bucket: string, folder?: string) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('bucket', bucket)
  if (folder) {
    formData.append('folder', folder)
  }

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  })
  
  return response.json()
}