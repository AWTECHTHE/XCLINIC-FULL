import { setToken, clearToken, getRefreshToken, setRefreshToken, clearRefreshToken } from "../api"

function clearAllCookies() {
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim()
    if (name) document.cookie = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`
  })
}

describe("api.ts - armazenamento de tokens (cookie)", () => {
  beforeEach(() => {
    clearAllCookies()
  })

  it("setToken grava o access token no cookie xclinic_token", () => {
    setToken("meu-access-token")
    expect(document.cookie).toContain("xclinic_token=meu-access-token")
  })

  it("setRefreshToken/getRefreshToken fazem round-trip corretamente", () => {
    expect(getRefreshToken()).toBeNull()
    setRefreshToken("meu-refresh-token")
    expect(getRefreshToken()).toBe("meu-refresh-token")
  })

  it("clearToken remove tanto o access token quanto o refresh token", () => {
    setToken("access")
    setRefreshToken("refresh")
    clearToken()
    expect(document.cookie).not.toContain("xclinic_token=access")
    expect(getRefreshToken()).toBeNull()
  })

  it("clearRefreshToken remove só o refresh token", () => {
    setToken("access")
    setRefreshToken("refresh")
    clearRefreshToken()
    expect(document.cookie).toContain("xclinic_token=access")
    expect(getRefreshToken()).toBeNull()
  })
})
