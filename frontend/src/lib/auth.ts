import { axios } from '@/utils/axios.util'

export const login = async ({
  identifier,
  password,
}: {
  identifier: string
  password: string
}) => {
  const { data } = await axios.post('/auth/login', { identifier, password })

  return data
}
