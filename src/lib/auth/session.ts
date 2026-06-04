import { store } from "@/src/state/store"
import { logOut } from "@/src/state/authSlice"

const AUTH_TOKEN_KEY = "auth_token"

export const getAuthToken = () => {
  if (typeof window === "undefined") {
    return store.getState().auth.token
  }

  return store.getState().auth.token || localStorage.getItem(AUTH_TOKEN_KEY)
}

export const clearAuthSession = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }

  store.dispatch(logOut())
}

export const getAuthHeaders = () => {
  const token = getAuthToken()

  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const fetchWithAuth = async (input: RequestInfo | URL, init: RequestInit = {}) => {
  const headers = new Headers(init.headers || {})
  const token = getAuthToken()

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(input, {
    ...init,
    headers,
  })

  if (response.status === 401) {
    clearAuthSession()
  }

  return response
}
