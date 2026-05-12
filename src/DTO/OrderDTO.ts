import { z } from 'zod'

export class OrderDTO {
  status: string
  courierId: number
  customerName: string
  customerPhone: string
  comment: string
  id: number

  constructor(
    status: string,
    courierId: number,
    customerName: string,
    customerPhone: string,
    comment: string,
    id: number,
  ) {
    this.status = status
    this.courierId = courierId
    this.customerName = customerName
    this.customerPhone = customerPhone
    this.comment = comment
    this.id = id
  }

  static generateDefaultBody(): OrderDTO {
    return new OrderDTO('OPEN', 0, 'string', 'string', 'string', 0)
  }
}

export const OrderSchema = z
  .object({
    status: z.string(),
    courierId: z.number().nullable(),
    customerName: z.string(),
    customerPhone: z.string(),
    comment: z.string(),
    id: z.number(),
  })
  .strict()

//export const OrderSchemaResponse
