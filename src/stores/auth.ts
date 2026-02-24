import { defineStore } from 'pinia'
import type { User, AuthTokens } from '@/services/auth'
import { getUser } from '@/services/auth'

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoadingUser: boolean
  isUserValidated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoadingUser: false,
    isUserValidated: false,
  }),

  getters: {
    userName: (state) => state.user?.name ?? 'Anônimo',
    userEmail: (state) => state.user?.email,
    userRole: (state) => state.user?.role,
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isClient: (state) => state.user?.role === 'CLIENT',
    accessToken: (state) => state.tokens?.access_token,
    refreshTokenValue: (state) => state.tokens?.refresh_token,
    isReady: (state) => !state.isLoadingUser && state.isUserValidated,
  },

  actions: {
    setAuth(user: User, tokens: AuthTokens) {
      this.user = user
      this.tokens = tokens
      this.isAuthenticated = true
      this.isUserValidated = true

      localStorage.setItem('access_token', tokens.access_token)
      localStorage.setItem('refresh_token', tokens.refresh_token)
    },

    setTokens(tokens: AuthTokens) {
      this.tokens = tokens
      localStorage.setItem('access_token', tokens.access_token)
      localStorage.setItem('refresh_token', tokens.refresh_token)
    },

    setUser(user: User) {
      this.user = user
      this.isAuthenticated = true
      this.isUserValidated = true
    },

    clearAuth() {
      this.user = null
      this.tokens = null
      this.isAuthenticated = false
      this.isLoadingUser = false
      this.isUserValidated = false

      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      // Clean up legacy user from localStorage
      localStorage.removeItem('user')
    },

    loadFromStorage() {
      const accessToken = localStorage.getItem('access_token')
      const refreshToken = localStorage.getItem('refresh_token')

      // Clean up legacy user from localStorage (security improvement)
      localStorage.removeItem('user')

      if (accessToken && refreshToken) {
        this.tokens = {
          access_token: accessToken,
          refresh_token: refreshToken,
          token_type: 'Bearer',
          expires_in: 0,
        }
        this.isAuthenticated = true
        // Note: user will be fetched from backend via fetchUser()
      }
    },

    async fetchUser() {
      const token = this.tokens?.access_token
      if (!token) {
        throw new Error('No access token')
      }

      this.isLoadingUser = true
      try {
        const user = await getUser(token)
        this.setUser(user)
      } catch (error) {
        this.clearAuth()
        throw error
      } finally {
        this.isLoadingUser = false
      }
    },
  },
})
