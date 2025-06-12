export class OrderDto {
  // define fields of the class
  status: string
  courierId: number
  customerName: string
  customerPhone: string
  comment: string
  id: number

  // create a constructor Ctrl + N or Cmd + N (Mac)
  constructor(
    status: string,
    courierId: number,
    customerName: string,
    customerPhone: string,
    comment: string,
  ) {
    this.status = status
    this.courierId = courierId
    this.customerName = customerName
    this.customerPhone = customerPhone
    this.comment = comment
    this.id = 0
  }
}
