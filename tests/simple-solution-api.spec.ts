import { expect, test } from '@playwright/test'
import { ProductDTO, Product } from '../src/DTO/ProductDTO'
import { StatusCodes } from 'http-status-codes'

test.describe('Lesson 11 -> Product API tests', () => {
  const BaseEndpointURL = 'https://backend.tallinn-learning.ee/products'
  const AUTH = { 'X-API-Key': 'my-secret-api-key' }

  test('GET /products - check API returns array with length >= 1', async ({ request }) => {
    const response = await request.get(BaseEndpointURL, {
      headers: AUTH,
    })

    const responseBody: Product[] = await response.json()
    expect(response.status()).toBe(StatusCodes.OK)
    expect(responseBody.length).toBeDefined()
    expect(responseBody.length).toBeGreaterThanOrEqual(1)
  })

  test('POST /products; GET /products/{id} - check product creation and product search by id', async ({
    request,
  }) => {
    const testProduct = ProductDTO.generateDefault()

    const createResponse = await request.post(BaseEndpointURL, {
      headers: AUTH,
      data: testProduct,
    })

    const createResponseBody: Product = await createResponse.json()
    expect(createResponse.status()).toBe(StatusCodes.OK) // На этом сервере POST возвращает 200
    expect(createResponseBody.id).toBeGreaterThan(0)

    const searchResponse = await request.get(`${BaseEndpointURL}/${createResponseBody.id}`, {
      headers: AUTH,
    })
    const searchResponseBody: Product = await searchResponse.json()
    expect(searchResponse.status()).toBe(StatusCodes.OK)
    expect.soft(searchResponseBody.id).toBe(createResponseBody.id)
    expect.soft(searchResponseBody.name).toBe(testProduct.name)
  })

  test('GET /products/{id} - should not return product with invalid API key', async ({
    request,
  }) => {
    const response = await request.get(`${BaseEndpointURL}/1`, {
      headers: { 'X-API-Key': 'invalid-key' },
    })
    expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
  })

  test('PUT /products/{id} - should update product', async ({ request }) => {
    const testProduct = ProductDTO.generateDefault()
    const createResponse = await request.post(BaseEndpointURL, {
      headers: AUTH,
      data: testProduct,
    })
    const createResponseBody: Product = await createResponse.json()

    const updatedProduct = ProductDTO.generateCustom('Updated Product', 999)
    const updateResponse = await request.put(`${BaseEndpointURL}/${createResponseBody.id}`, {
      headers: AUTH,
      data: updatedProduct,
    })

    const updateResponseBody: Product = await updateResponse.json()
    expect(updateResponse.status()).toBe(StatusCodes.OK)
    expect(updateResponseBody.name).toBe(updatedProduct.name)
    expect(updateResponseBody.price).toBe(updatedProduct.price)
  })

  test('DELETE /products - check product deletion', async ({ request }) => {
    const testProduct = ProductDTO.generateDefault()
    const createResponse = await request.post(BaseEndpointURL, {
      headers: AUTH,
      data: testProduct,
    })
    const createResponseBody: Product = await createResponse.json()

    const deleteResponse = await request.delete(`${BaseEndpointURL}/${createResponseBody.id}`, {
      headers: AUTH,
    })
    expect(deleteResponse.status()).toBe(StatusCodes.NO_CONTENT)

    const searchResponse = await request.get(`${BaseEndpointURL}/${createResponseBody.id}`, {
      headers: AUTH,
    })

    expect(searchResponse.status()).toBe(StatusCodes.BAD_REQUEST)
  })

  test('DELETE /products - check not existing product deletion', async ({ request }) => {
    const deleteResponse = await request.delete(`${BaseEndpointURL}/-1`, {
      headers: AUTH,
    })
    expect(deleteResponse.status()).toBe(StatusCodes.BAD_REQUEST)
  })
})
