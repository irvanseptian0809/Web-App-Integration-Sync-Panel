export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export class ValidationError extends Error {
  public errors: any;

  constructor(message: string, errors?: any) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}
