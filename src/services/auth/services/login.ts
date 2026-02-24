import { oauthApi, CLIENT_ID, CLIENT_SECRET } from '../api'
import type { LoginCredentials, AuthTokens } from '../types'

export async function login(credentials: LoginCredentials): Promise<AuthTokens> {
  const { data } = await oauthApi.post<AuthTokens>('/oauth/token', {
    grant_type: 'password',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    username: credentials.username,
    password: credentials.password,
    scope: '',
  })

  return data
}
