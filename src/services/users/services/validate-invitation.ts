import axios from 'axios'
import type { ApiResponse } from '@/services'
import type { Invitation } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function validateInvitation(token: string): Promise<Invitation> {
  const { data } = await axios.get<ApiResponse<Invitation>>(
    `${API_BASE_URL}/invitations/validate`,
    { params: { token } },
  )
  return data.data
}
