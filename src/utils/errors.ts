export interface IError {
  status: number;
  message: string;
  details: any;
}

export default class ErrorResponse implements IError {
  status: number;
  message: string;
  details: any;
  constructor({ status, message, details }: IError) {
    this.status = status;
    this.message = message;
    this.details = details;
  }
}
