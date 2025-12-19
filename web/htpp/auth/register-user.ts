import { api } from '../http-client'

interface registerUserRequest {
  name: string
  email: string
  password: string
}

export async function registerUser({
  name,
  email,
  password,
}: registerUserRequest) {
  const result = await api
    .post('users', {
      json: {
        name,
        email,
        password,
      },
    })
    .json()

  return result
}
