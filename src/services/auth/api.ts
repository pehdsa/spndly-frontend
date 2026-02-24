import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID
export const CLIENT_SECRET = import.meta.env.VITE_OAUTH_CLIENT_SECRET

/**
 * Instância Axios para chamadas autenticadas
 */
export const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

/**
 * Instância Axios para chamadas OAuth (login, refresh)
 * baseURL vazio para requests relativas ao localhost, passando pelo proxy do Vite
 */
export const oauthApi = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
