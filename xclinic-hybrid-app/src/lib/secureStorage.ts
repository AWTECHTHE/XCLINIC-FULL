// Wrapper minimal para Secure Storage do Capacitor com fallback para web
import type { Plugins } from "@capacitor/core"

let CapacitorStorage: any = null
try {
  // Import dinâmico para não quebrar no Next server
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cap = require("@capacitor/core")
  CapacitorStorage = cap?.Plugins?.SecureStorage || cap?.SecureStorage || null
} catch (e) {
  CapacitorStorage = null
}

export async function setSecureItem(key: string, value: string) {
  if (typeof window !== "undefined" && CapacitorStorage && CapacitorStorage.set) {
    await CapacitorStorage.set({ key, value })
    return
  }
  if (typeof document !== "undefined") {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `${key}=${encodeURIComponent(value)};path=/;expires=${expires};SameSite=Lax`
  }
}

export async function getSecureItem(key: string) {
  if (typeof window !== "undefined" && CapacitorStorage && CapacitorStorage.get) {
    const r = await CapacitorStorage.get({ key })
    return r?.value ?? null
  }
  if (typeof document !== "undefined") {
    const match = document.cookie.match('(^|;)\\s*' + key + '\\s*=\\s*([^;]+)')
    return match ? decodeURIComponent(match[2]) : null
  }
  return null
}

export async function removeSecureItem(key: string) {
  if (typeof window !== "undefined" && CapacitorStorage && CapacitorStorage.remove) {
    await CapacitorStorage.remove({ key })
    return
  }
  if (typeof document !== "undefined") {
    document.cookie = `${key}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax`
  }
}
