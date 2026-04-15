export class UserAlreadyExistsError extends Error {
  constructor() {
    super('E-mail is already in use')
  }
}
