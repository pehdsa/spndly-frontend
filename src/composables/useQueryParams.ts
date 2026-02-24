import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * Hook tipado para sincronizar um objeto de parâmetros com a URL.
 * - Lê os valores iniciais da URL IMEDIATAMENTE (síncrono).
 * - Atualiza a URL manualmente via syncToUrl().
 *
 * @example
 * const { params, syncToUrl } = useQueryParams({
 *   page: 1,
 *   per_page: 10,
 *   sort: undefined,
 *   filter: '',
 * })
 *
 * // Atualizar parâmetros e sincronizar
 * params.page = 2
 * syncToUrl()
 *
 * // Sincronizar sem atualizar componente (só muda URL)
 * syncToUrl({ updateComponent: false })
 */
export function useQueryParams<T extends Record<string, string | number | undefined>>(defaults: T) {
  const route = useRoute()
  const router = useRouter()

  // Inicializa com valores da URL se existirem, senão usa defaults
  const initialValues = { ...defaults }
  ;(Object.keys(defaults) as Array<keyof T>).forEach((key) => {
    const queryValue = route.query[key as string]
    if (queryValue !== undefined && queryValue !== null && queryValue !== '') {
      const parsed = Number(queryValue)
      initialValues[key] = (isNaN(parsed) ? String(queryValue) : parsed) as T[keyof T]
    }
  })

  const params = reactive(initialValues) as T

  /**
   * Sincroniza os parâmetros com a URL
   * @param options.updateComponent - true: usa Vue Router (componente atualiza), false: muda só a URL
   */
  function syncToUrl(options?: { updateComponent?: boolean }): void {
    const shouldUpdate = options?.updateComponent ?? true

    const query: Record<string, string> = {}

    ;(Object.entries(params) as [keyof T, T[keyof T]][]).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query[String(key)] = String(value)
      }
    })

    if (shouldUpdate) {
      void router.replace({ query })
      return
    }

    const searchParams = new URLSearchParams(query)
    const { pathname, hash } = window.location

    const newUrl = searchParams.toString() ? `${pathname}?${searchParams}${hash}` : `${pathname}${hash}`

    window.history.replaceState(window.history.state, '', newUrl)
  }

  return { params, syncToUrl }
}
