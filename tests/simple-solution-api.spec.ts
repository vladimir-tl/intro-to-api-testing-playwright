import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'

const BASE_URL = 'https://backend.tallinn-learning.ee'
const API_KEY = '1234567890123456'

test.describe('GET /test-orders/{id}', () => {
  test('get order with correct id should receive code 200', async ({ request }) => {
    // Build and send a GET request to the server
    const response = await request.get(`${BASE_URL}/test-orders/1`)

    // parse raw response body to json
    const responseBody = await response.json()
    const statusCode = response.status()

    // Log the response status, body and headers
    console.log('response body:', responseBody)
    // Check if the response status is 200
    expect(statusCode).toBe(200)
  })
})

test.describe('POST /test-orders', () => {
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
    const response = await request.post(`${BASE_URL}/test-orders`, {
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
})

test.describe('PUT /test-orders/{id}', () => {
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'string',
    customerPhone: 'string',
    comment: 'string',
    id: 0,
  }

  test('update order with correct id, API key and request body should receive code 200', async ({
    request,
  }) => {
    const response = await request.put(`${BASE_URL}/test-orders/1`, {
      headers: { api_key: API_KEY },
      data: requestBody,
    })

    const responseBody = await response.json()
    const statusCode = response.status()

    console.log('response body:', responseBody)
    expect(statusCode).toBe(200)
  })

  test('update order with non-existent ID should receive code 400', async ({ request }) => {
    const response = await request.put(`${BASE_URL}/test-orders/9999`, {
      headers: { api_key: API_KEY },
      data: requestBody,
    })

    const responseBody = await response.json()
    const statusCode = response.status()

    console.log('response body:', responseBody)
    expect(statusCode).toBe(400)
  })

  test('update order with invalid ID format should receive code 400', async ({ request }) => {
    const response = await request.put(`${BASE_URL}/test-orders/abc`, {
      headers: { api_key: API_KEY },
      data: requestBody,
    })

    const responseBody = await response.json()
    const statusCode = response.status()

    console.log('response body:', responseBody)
    expect(statusCode).toBe(400)
  })

  test('update order with empty request body should receive code 400', async ({ request }) => {
    const emptyRequestBody = {
      status: '',
      courierId: 0,
      customerName: '',
      customerPhone: '',
      comment: '',
      id: 0,
    }

    const response = await request.put(`${BASE_URL}/test-orders/1`, {
      headers: { api_key: API_KEY },
      data: emptyRequestBody,
    })

    const statusCode = response.status()

    expect(statusCode).toBe(400)
  })

  test('update order with invalid data in the request body should receive code 400', async ({
    request,
  }) => {
    const invalidRequestBody = {
      status: 'OPEN',
      courierId: 0,
      customerName: 'string',
      customerPhone: 'string',
      comment: 'string',
    }

    const response = await request.put(`${BASE_URL}/test-orders/1`, {
      headers: { api_key: API_KEY },
      data: invalidRequestBody,
    })

    const responseBody = await response.json()
    const statusCode = response.status()

    console.log('response body:', responseBody)
    expect(statusCode).toBe(400)
  })

  test('update order without API key should receive code 401', async ({ request }) => {
    const response = await request.put(`${BASE_URL}/test-orders/1`, {
      headers: { api_key: '' },
      data: requestBody,
    })

    const statusCode = response.status()

    expect(statusCode).toBe(401)
  })

  test('update order with invalid API key should receive code 401', async ({ request }) => {
    const response = await request.put(`${BASE_URL}/test-orders/1`, {
      headers: { api_key: '12345' },
      data: requestBody,
    })

    const statusCode = response.status()

    expect(statusCode).toBe(401)
  })

  test('update order with API key containing non-numeric characters should receive code 401', async ({
    request,
  }) => {
    const response = await request.put(`${BASE_URL}/test-orders/1`, {
      headers: { api_key: 'abcdefghijklmnop' },
      data: requestBody,
    })

    const statusCode = response.status()

    expect(statusCode).toBe(401)
  })
})

test.describe('DELETE /test-orders/{id}', () => {
  test('delete order with correct id and API key should receive code 204', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/test-orders/1`, {
      headers: { api_key: API_KEY },
    })

    const statusCode = response.status()

    expect(statusCode).toBe(204)
  })

  test('delete order with non-existent ID should receive code 400', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/test-orders/9999`, {
      headers: { api_key: API_KEY },
    })

    const statusCode = response.status()

    expect(statusCode).toBe(400)
  })

  test('delete order with invalid ID format should receive code 400', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/test-orders/abc`, {
      headers: { api_key: API_KEY },
    })

    const statusCode = response.status()

    expect(statusCode).toBe(400)
  })

  test('delete order without API key should receive code 401', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/test-orders/1`, {
      headers: { api_key: '' },
    })

    const statusCode = response.status()

    expect(statusCode).toBe(401)
  })

  test('delete order with invalid API key should receive code 401', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/test-orders/1`, {
      headers: { api_key: '12345' },
    })

    const statusCode = response.status()

    expect(statusCode).toBe(401)
  })

  test('delete order with API key containing non-numeric characters should receive code 401', async ({
    request,
  }) => {
    const response = await request.delete(`${BASE_URL}/test-orders/1`, {
      headers: { api_key: 'abcdefghijklmnop' },
    })

    const statusCode = response.status()

    expect(statusCode).toBe(401)
  })
})

test.describe('GET /test-orders/auth', () => {
  test('get successful authorization with valid credentials should receive code 200', async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}/test-orders/auth`, {
      params: { username: 'validUser', password: 'validPass' },
    })

    const responseBody = await response.json()
    const statusCode = response.status()

    console.log('response body:', responseBody)
    expect(statusCode).toBe(200)
  })

  test('failed authorization without login should receive code 500', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/test-orders/auth`, {
      params: { username: '', password: 'validPass' },
    })

    const responseBody = await response.json()
    const statusCode = response.status()

    console.log('response body:', responseBody)
    expect(statusCode).toBe(500)
  })

  test('failed authorization without password should receive code 500', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/test-orders/auth`, {
      params: { username: 'validUser', password: '' },
    })

    const responseBody = await response.json()
    const statusCode = response.status()

    console.log('response body:', responseBody)
    expect(statusCode).toBe(500)
  })

  test('failed authorization without username and password should receive code 500', async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}/test-orders/auth`)

    const responseBody = await response.json()
    const statusCode = response.status()

    console.log('response body:', responseBody)
    expect(statusCode).toBe(500)
  })
})
