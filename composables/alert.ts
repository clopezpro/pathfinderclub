const [
  provideAlertErrorModal,
  useAlertErrorModal,
] = useSingleton<(e: Error | string | unknown, origin?: string | undefined) => void>()

const [
  provideAlert,
  useAlert,
] = useSingleton<(params: {
  typeShow?: 'info' | 'error' | 'warning' | 'success' | 'question' | undefined
  title: string
  message: string
  stack?: string | null | undefined
}) => void>()

export {
  provideAlertErrorModal,
  useAlertErrorModal,
  provideAlert,
  useAlert,
}

/* function useAlertErrorModal() {
  return inject(key2) as alertErrorFN
}

function provideAlertErrorModal(F: alertErrorFN) {
  const vm = getCurrentInstance()
  vm?.appContext.app.provide(key2, F)
} */

/* const [
  provideAlertModal,
  useAlertModal,
] = useSingleton<(title: string, message: string, stack?: String | null) => void >() */
