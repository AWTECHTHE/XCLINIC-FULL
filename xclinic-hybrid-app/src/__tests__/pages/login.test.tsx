import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import Login from "../../pages/login"

const pushMock = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}))

const postMock = jest.fn()
jest.mock("../../lib/api", () => ({
  __esModule: true,
  default: { post: (...args: any[]) => postMock(...args) },
  setToken: jest.fn(),
  setRefreshToken: jest.fn(),
}))

describe("Login", () => {
  beforeEach(() => {
    postMock.mockReset()
    pushMock.mockReset()
  })

  it("envia username/password para POST /login/ (não /users/login/, não 'email')", async () => {
    postMock.mockResolvedValueOnce({
      data: { access_token: "abc", refresh_token: "def", token_type: "bearer" },
    })

    render(<Login />)

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "jdoe" } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "Str0ng!Pass" } })
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => expect(postMock).toHaveBeenCalledTimes(1))
    expect(postMock).toHaveBeenCalledWith("/login/", {
      username: "jdoe",
      password: "Str0ng!Pass",
    })
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/dashboard"))
  })

  it("mostra erro e não chama a API se algum campo estiver vazio", async () => {
    render(<Login />)
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    expect(await screen.findByText(/required/i)).toBeInTheDocument()
    expect(postMock).not.toHaveBeenCalled()
  })

  it("exibe a mensagem de erro vinda do backend em caso de falha", async () => {
    postMock.mockRejectedValueOnce({ response: { data: { detail: "Invalid credentials" } } })

    render(<Login />)
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "jdoe" } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "wrong" } })
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument()
    expect(pushMock).not.toHaveBeenCalled()
  })
})
