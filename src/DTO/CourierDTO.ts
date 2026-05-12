import { z } from 'zod'
export class CourierDTO {
  id: number
  login: string
  password: string
  name: string

  constructor(id: number, login: string, password: string, name: string) {
    this.id = id
    this.login = login
    this.password = password
    this.name = name
  }
  static generateValid(): CourierDTO {
    const unique = Date.now().toString().slice(-5)
    return new CourierDTO(Number(`34${unique}`), `Vasili${unique}`, `abc123${unique}`, 'Vasja')
  }
}
export const CourierResponseSchema = z.object({
  id: z.number(),
  login: z.string(),
  name: z.string(),
})
export type CourierResponse = z.infer<typeof CourierResponseSchema>
