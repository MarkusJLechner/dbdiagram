export function getConstName(object, value) {
  return Object.keys(object).find((key) => object[key] === value)
}

export const ToastType = {
  error: 'error',
  success: 'success',
  info: 'info',
}
