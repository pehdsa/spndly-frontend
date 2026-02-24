import { authApi, CLIENT_ID, CLIENT_SECRET } from '../api'
import type { RegisterData, RegisterResponse } from '../types'

export async function register(data: RegisterData): Promise<RegisterResponse> {
  const response = await authApi.post<RegisterResponse>('/auth/register', {
    ...data,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  })
  return response.data
}
