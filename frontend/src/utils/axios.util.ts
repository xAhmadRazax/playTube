import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.BASE_API_URL || 'http://localhost:8000/api/v1/',
  withCredentials: true,
  headers: {
    'Content-Type': 'Application/json',
  },
})
export { axiosInstance as axios }
