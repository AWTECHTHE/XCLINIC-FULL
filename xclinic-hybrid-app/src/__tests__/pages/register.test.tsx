import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import Register from "../../pages/register"

const pushMock = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}))

const postMock = jest.fn()
jest.mock("../../lib/api", () => ({
  __esModule: true,
  default: { post: (...args: any[]) => postMock(...args) },
}))

describe("Register", () => {
  beforeEach(() => {
    postMock.mockReset()
    pushMock.mockReset()
  })

  it("envia username/email/password para POST /register/ (não /users/register/)", async () => {
    postMock.mockResolvedValueOnce({ data: { id: 1, username: "jdoe", email: "jdoe@example.com" } })

    render(<Register />)

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "jdoe" } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "jdoe@example.com" } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "Str0ng!Pass" } })
    fireEvent.click(screen.getByRole("button", { name: /register/i }))

    await waitFor(() => expect(postMock).toHaveBeenCalledTimes(1))
    expect(postMock).toHaveBeenCalledWith("/register/", {
      username: "jdoe",
      email: "jdoe@example.com",
      password: "Str0ng!Pass",
    })
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/login"))
  })

  it("mostra erro e não chama a API se algum campo estiver vazio", async () => {
    render(<Register />)
    fireEvent.click(screen.getByRole("button", { name: /register/i }))

    expect(await screen.findByText(/required/i)).toBeInTheDocument()
    expect(postMock).not.toHaveBeenCalled()
  })

  it("exibe a mensagem de erro vinda do backend em caso de falha (ex: usuário duplicado)", async () => {
    postMock.mockRejectedValueOnce({ response: { data: { detail: "User already exists" } } })

    render(<Register />)
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "jdoe" } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "jdoe@example.com" } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "Str0ng!Pass" } })
    fireEvent.click(screen.getByRole("button", { name: /register/i }))

    expect(await screen.findByText("User already exists")).toBeInTheDocument()
    expect(pushMock).not.toHaveBeenCalled()
  })
})
