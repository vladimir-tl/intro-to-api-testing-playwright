import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'
import { OrderDto } from '../dto/order-dto'

const serviceURL = 'https://backend.tallinn-learning.ee/test-orders'

test('get order with correct id should receive code 200', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get(serviceURL)
  // Log the response status, body and headers
  console.log('response body:', await response.json())
  console.log('response headers:', response.headers())

  expect(response.status()).toBe(StatusCodes.OK)
})

test('post order with correct data should receive code 200', async ({ request }) => {
  // prepare request body with dto pattern
  const requestBody = new OrderDto('OPEN', 0, 'John Doe', '+123456789', 'Urgent order', 0)
  const response = await request.post(serviceURL, {
    data: requestBody,
  })

  console.log('response body:', await response.json())
  expect.soft(response.status()).toBe(StatusCodes.OK)
  const responseBody = await response.json()
  expect.soft(responseBody.status).toBe('OPEN')
  expect.soft(responseBody.courierId).toBeDefined()
  expect.soft(responseBody.customerName).toBeDefined()
})

test('post order with correct data should receive code 200 - process full body', async ({ request }) => {
  // prepare request body with dto pattern
  const requestBody = OrderDto.createOrderWithRandomData()
  const response = await request.post(serviceURL, {
    data: requestBody,
  })
  expect.soft(response.status()).toBe(StatusCodes.OK)
  const responseBody = await response.json()
  expect.soft(responseBody.status).toBe(requestBody.status)
  expect.soft(responseBody.courierId).toBe(requestBody.courierId)
  expect.soft(responseBody.customerName).toBe(requestBody.customerName)
  expect.soft(responseBody.customerPhone).toBe(requestBody.customerPhone)
  expect.soft(responseBody.comment).toBe(requestBody.comment)
})


