import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'

test('get order with correct id should receive code 200', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/1')

  // parse raw response body to json
  const responseBody = await response.json()
  const statusCode = response.status()

  // Log the response status, body and headers
  console.log('response body:', responseBody)
  // Check if the response status is 200
  expect(statusCode).toBe(200)
})

test('post order with correct data should receive code 201', async ({ request }) => {
  // prepare request body
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'string',
    customerPhone: 'string',
    comment: 'string',
    id: 0,
  }
  // Send a POST request to the server
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: requestBody,
  })
  // parse raw response body to json
  const responseBody = await response.json()
  const statusCode = response.status()

  // Log the response status and body
  console.log('response status:', statusCode)
  console.log('response body:', responseBody)
  expect(statusCode).toBe(StatusCodes.OK)
  // check that body.comment is string type
  expect(typeof responseBody.comment).toBe('string')
  // check that body.courierId is number type
  expect(typeof responseBody.courierId).toBe('number')
})

// Homework 10

test('put order with correct data should receive code 200', async ({ request }) => {
  const requestBody = {
    status: 'OPEN',
    courierId: 1,
    customerName: 'Maksim',
    customerPhone: '123456',
    comment: 'updated',
    id: 1,
  }
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/1', {
    headers: { api_key: '1234567890123456' },
    data: requestBody,
  })

  const responseBody = await response.json()
  const statusCode = response.status()

  console.log('response status:', statusCode)
  console.log('response body:', responseBody)

  expect(statusCode).toBe(200)
})

test('put order with empty body should receive code 404', async ({ request }) => {
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/1', {
    headers: { api_key: '1234567890123456' },
    data: {},
  })

  const statusCode = response.status()
  console.log('response status for empty body:', statusCode)

  expect(statusCode).toBe(404)
})

test('delete order with correct key should receive code 204', async ({ request }) => {
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/1', {
    headers: { api_key: '1234567890123456' },
  })

  const statusCode = response.status()
  console.log('response status:', statusCode)

  expect(statusCode).toBe(204)
})

test('get auth with credentials should receive code 200', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/auth', {
    params: {
      username: 'mminajev',
      password: 'dhmus5qbYbfT2n',
    },
  })

  const responseBody = await response.text()
  const statusCode = response.status()

  console.log('auth response body:', responseBody)
  console.log('auth response status:', statusCode)

  expect(statusCode).toBe(200)
})

test('get auth without password should receive code 500', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/auth', {
    params: { username: 'mminajev' },
  })

  const statusCode = response.status()
  console.log('auth error status:', statusCode)

  expect(statusCode).toBe(500)
})

test('put order without API key should receive code 401', async ({ request }) => {
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/1', {
    headers: { api_key: '' },
    data: {
      status: 'OPEN',
      courierId: 1,
      customerName: 'Maksim',
      customerPhone: '123456',
      comment: 'updated',
      id: 1,
    },
  })

  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('delete order without API key should receive code 401', async ({ request }) => {
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/1', {
    headers: { api_key: '' },
  })

  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})