import type { AxiosError } from 'axios'
import type { ErrorResponse } from '@/composables/useErrorHandler'

declare module '@tanstack/vue-query' {
  interface Register {
    defaultError: AxiosError<ErrorResponse>
  }
}
