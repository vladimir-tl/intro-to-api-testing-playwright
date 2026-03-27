export class LoginDto {
  username: string | undefined
  password: string | undefined

  constructor(username: string, password: string) {
    this.username = username
    this.password = password
  }

  static createLoginDto(): LoginDto {
    return new LoginDto(process.env.USER || '', process.env.PASSWORD || '')
  }
}
