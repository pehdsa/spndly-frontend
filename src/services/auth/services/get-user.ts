import axios from 'axios'
import { API_BASE_URL } from '../api'
import type { User } from '../types'

interface GetUserResponse {
  data: User
}

export async function getUser(token: string): Promise<User> {
  const { data } = await axios.get<GetUserResponse>(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return data.data
}
