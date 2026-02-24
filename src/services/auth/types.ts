export interface User {
  id: number
  name: string
  email: string
  phone_number: string | null
  role: string
  status: string
  viewed_at: string | null
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  token: string
  name: string
  password: string
  password_confirmation: string
}

export interface RegisterResponse {
  user: User
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface AuthTokens {
  token_type: string
  expires_in: number
  access_token: string
  refresh_token: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  email: string
  token: string
  password: string
  password_confirmation: string
}
