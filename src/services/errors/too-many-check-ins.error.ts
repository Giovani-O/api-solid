export class TooManyCheckInsError extends Error {
  constructor() {
    super('Max daily check ins reached.')
  }
}
