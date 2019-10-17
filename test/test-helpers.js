jest.setTimeout(500)
expect.extend({
  toHaveStatus (response, expectedStatus) {
    return {
      pass: response.status === expectedStatus,
      message: () => `expected ${expectedStatus} got ${response.status} with body: ${JSON.stringify(response.body)}`
    }
  }
})
