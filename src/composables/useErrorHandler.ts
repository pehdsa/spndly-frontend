import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import type { AxiosError } from 'axios'
import { type Ref, watch } from 'vue'

export interface ErrorResponse {
  error?: {
    message?: string
    errors?: Record<string, string[]>
  }
  message?: string
}

interface ErrorHandlerOptions {
  /** Se deve redirecionar automaticamente */
  redirect?: boolean
  /** Rota customizada para redirecionar */
  redirectTo?: string
  /** Se deve exibir toast (padrão: true) */
  showToast?: boolean
  /** Se deve mostrar botão de reload (padrão: false) */
  showReload?: boolean
  /** Se deve exibir toast para erro 422 (padrão: true) */
  showValidationToast?: boolean
  /** Callback customizado */
  onError?: (error: AxiosError<ErrorResponse>) => void
  /** Callback para validação (422) */
  onValidationError?: (errors: Record<string, string[]>) => void
}

const ERROR_MESSAGES = {
  400: {
    title: 'Erro 400',
    description: 'Requisição inválida. Verifique os dados enviados.',
  },
  401: {
    title: 'Sessão expirada',
    description: 'Faça login novamente para continuar.',
  },
  403: {
    title: 'Sem permissão',
    description: 'Você não tem permissão para realizar esta ação.',
  },
  404: {
    title: 'Não encontrado',
    description: 'O recurso solicitado não foi encontrado.',
  },
  409: {
    title: 'Conflito',
    description: 'Este recurso já existe ou está em uso.',
  },
  422: {
    title: 'Dados inválidos',
    description: 'Verifique os campos e tente novamente.',
  },
  429: {
    title: 'Muitas requisições',
    description: 'Você fez muitas requisições. Aguarde alguns instantes.',
  },
  500: {
    title: 'Erro no servidor',
    description: 'Ocorreu um erro no servidor. Tente novamente mais tarde.',
  },
  default: {
    title: 'Atenção',
    description: 'Algo deu errado. Tente novamente.',
  },
} as const

export function useErrorHandler() {
  const router = useRouter()

  /**
   * Recarrega a página atual
   */
  const reloadPage = () => {
    window.location.reload()
  }

  /**
   * Exibe um toast de erro
   */
  const showErrorToast = (title: string, description: string, showReloadButton = false) => {
    toast.error(title, {
      description,
      action: showReloadButton
        ? {
            label: 'Recarregar',
            onClick: reloadPage,
          }
        : undefined,
    })
  }

  /**
   * Exibe um toast de aviso
   */
  const showWarningToast = (title: string, description: string, showReloadButton = false) => {
    toast.warning(title, {
      description,
      action: showReloadButton
        ? {
            label: 'Recarregar',
            onClick: reloadPage,
          }
        : undefined,
    })
  }

  /**
   * Exibe um toast de sucesso
   */
  const showSuccessToast = (title: string, description?: string) => {
    toast.success(title, {
      description,
    })
  }

  /**
   * Extrai a mensagem de erro da resposta
   */
  const extractErrorMessage = (error: AxiosError<ErrorResponse>): string | undefined => {
    return error.response?.data?.error?.message || error.response?.data?.message
  }

  /**
   * Extrai os erros de validação da resposta
   */
  const extractValidationErrors = (error: AxiosError<ErrorResponse>): Record<string, string[]> | undefined => {
    return error.response?.data?.error?.errors
  }

  /**
   * Trata erros HTTP de forma padronizada
   */
  const handleError = (error: AxiosError<ErrorResponse>, options: ErrorHandlerOptions = {}) => {
    const {
      redirect = false,
      redirectTo,
      showToast: shouldShowToast = true,
      showReload = false,
      showValidationToast = true,
      onError,
      onValidationError,
    } = options

    // Callback customizado tem prioridade
    if (onError) {
      onError(error)
      return
    }

    const status = error.response?.status
    const errorMessage = extractErrorMessage(error)

    switch (status) {
      case 400:
        if (shouldShowToast) {
          showErrorToast(
            ERROR_MESSAGES[400].title,
            errorMessage || ERROR_MESSAGES[400].description,
            showReload,
          )
        }
        break

      case 401:
        if (shouldShowToast) {
          showErrorToast(ERROR_MESSAGES[401].title, ERROR_MESSAGES[401].description, showReload)
        }
        break

      case 403:
        if (shouldShowToast) {
          showErrorToast(
            ERROR_MESSAGES[403].title,
            errorMessage || ERROR_MESSAGES[403].description,
            showReload,
          )
        }
        break

      case 404:
        if (shouldShowToast) {
          showErrorToast(
            ERROR_MESSAGES[404].title,
            errorMessage || ERROR_MESSAGES[404].description,
            showReload,
          )
        }

        if (redirect && !error.config?.url?.includes('?')) {
          router.push(redirectTo || '/404')
        }
        break

      case 409:
        if (shouldShowToast) {
          showWarningToast(
            ERROR_MESSAGES[409].title,
            errorMessage || ERROR_MESSAGES[409].description,
            showReload,
          )
        }
        break

      case 422:
        if (onValidationError) {
          const errors = extractValidationErrors(error)
          if (errors) {
            onValidationError(errors)
          }
        }

        if (shouldShowToast && showValidationToast) {
          showWarningToast(
            ERROR_MESSAGES[422].title,
            errorMessage || ERROR_MESSAGES[422].description,
            showReload,
          )
        }
        break

      case 429:
        if (shouldShowToast) {
          showWarningToast(
            ERROR_MESSAGES[429].title,
            errorMessage || ERROR_MESSAGES[429].description,
            showReload,
          )
        }
        break

      case 500:
      case 502:
      case 503:
        if (shouldShowToast) {
          showErrorToast(
            ERROR_MESSAGES[500].title,
            errorMessage || ERROR_MESSAGES[500].description,
            showReload,
          )
        }

        if (redirect) {
          router.push(redirectTo || '/500')
        }
        break

      default:
        if (shouldShowToast) {
          showWarningToast(
            ERROR_MESSAGES.default.title,
            errorMessage || ERROR_MESSAGES.default.description,
            showReload,
          )
        }
    }
  }

  /**
   * Watch para tratar erros automaticamente quando o ref mudar
   */
  const watchError = (
    error: Ref<Error | null>,
    options: ErrorHandlerOptions = {},
  ) => {
    watch(error, (err) => {
      if (err) {
        handleError(err as AxiosError<ErrorResponse>, options)
      }
    })
  }

  return {
    handleError,
    watchError,
    showErrorToast,
    showWarningToast,
    showSuccessToast,
    extractErrorMessage,
    extractValidationErrors,
  }
}
