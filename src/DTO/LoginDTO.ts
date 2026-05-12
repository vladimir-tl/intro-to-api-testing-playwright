import { z } from 'zod'
export class LoginDTO {
  username: string
  password: string

  constructor(username: string, password: string) {
    this.username = username
    this.password = password
  }
  static generateIncorrectPair(): LoginDTO {
    return new LoginDTO('', '')
  }
  static generateCorrectPair(): LoginDTO {
    return new LoginDTO(
      process.env.USER || 'missing USER env var',
      process.env.PASSWORD || 'missing PASSWORD env var',
    )
  }
}

export const LoginSchema = z.string()
export type Login = z.infer<typeof LoginSchema>
