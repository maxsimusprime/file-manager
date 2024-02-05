export default class InvalidInputError extends Error {
  constructor(message) {
    super((message = "Invalid input"));
  }
}
