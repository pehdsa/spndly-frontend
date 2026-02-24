import axios from 'axios'
import { API_BASE_URL } from '../api'

export async function logout(token: string): Promise<void> {
  await axios.post(
    `${API_BASE_URL}/auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}
