import { api } from '../http-client'

interface loginWithPasswordRequest {
  email: string
  password: string
}

interface loginWithPasswordResponse {
  token: string
}
export async function loginWithPassword({
  email,
  password,
}: loginWithPasswordRequest) {
  const result = await api
    .post('auth/login', {
      json: {
        email,
        password,
      },
    })
    .json<loginWithPasswordResponse>()

  return result
}
