import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'
import { OrderDto } from '../dto/order-dto'
import Ajv from 'ajv'
import schema from '../dto/order-schema.json'

const serviceMockedURL = 'https://backend.tallinn-learning.ee/test-orders'

// add test describe as test suite
test.describe('Simple solution API tests', () => {
  test('get order with correct id should receive code 200', async ({ request }) => {
    // Build and send a GET request to the server
    const response = await request.get(`${serviceMockedURL}/1`)
    // Log the response status, body and headers
    console.log('response body:', await response.json())
    console.log('response headers:', response.headers())
    expect(response.status()).toBe(StatusCodes.OK)
  })

  test('post order with correct data should receive code 200', async ({ request }) => {
    // prepare request body with dto pattern
    const requestBody = new OrderDto('OPEN', 0, 'John Doe', '+123456789', 'Urgent order', 0)
    const response = await request.post(serviceMockedURL, {
      data: requestBody,
    })
    expect.soft(response.status()).toBe(StatusCodes.OK)
    const responseBody = await response.json()
    expect.soft(responseBody.status).toBe('OPEN')
    expect.soft(responseBody.courierId).toBeDefined()
    expect.soft(responseBody.customerName).toBeDefined()
  })

  test('post order with correct data should receive code 200 - process full body', async ({
    request,
  }) => {
    // prepare request body with dto pattern
    const requestBody = OrderDto.createOrderWithoutId()
    const response = await request.post(serviceMockedURL, {
      data: requestBody,
    })
    expect.soft(response.status()).toBe(StatusCodes.OK)
    const responseBody = await response.json()
    expect.soft(responseBody.status).toBe(requestBody.status)
    expect.soft(responseBody.courierId).toBe(requestBody.courierId)
    expect.soft(responseBody.customerName).toBe(requestBody.customerName)
    expect.soft(responseBody.customerPhone).toBe(requestBody.customerPhone)
    expect.soft(responseBody.comment).toBe(requestBody.comment)
    // match the id with a regular expression
    expect.soft(String(responseBody.id)).toMatch(/\d+/)
  })

  test('validate API response against JSON schema', async ({ request }) => {
    const response = await request.get(`${serviceMockedURL}/1`)
    const responseBody = await response.json()

    // Validate response against the JSON schema
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const isValid = validate(responseBody)

    // Ensure the response matches the schema
    expect.soft(isValid).toBe(true)
    // validate the response body
    validateResponseBody(responseBody)
  })

  function validateResponseBody(responseBody: OrderDto): void {
    expect.soft(responseBody.status).toBeDefined()
    expect.soft(responseBody.courierId).toBeNull()
    expect.soft(responseBody.customerName).toMatch(/\w+/)
    expect.soft(responseBody.customerPhone).toMatch(/\w+/)
    expect.soft(responseBody.comment).toMatch(/\w+/)
    expect.soft(String(responseBody.id)).toMatch(/\d+/)
  }
})
