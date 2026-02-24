import { oauthApi, CLIENT_ID, CLIENT_SECRET } from '../api'
import type { AuthTokens } from '../types'

export async function refreshToken(token: string): Promise<AuthTokens> {
  const { data } = await oauthApi.post<AuthTokens>('/oauth/token/refresh', {
    grant_type: 'refresh_token',
    refresh_token: token,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: '',
  })

  return data
}
