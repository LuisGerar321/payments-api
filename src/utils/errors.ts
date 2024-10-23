import { EStatus } from "./interfaces";

export interface IError {
  code: number;
  status?: EStatus;
  message: string;
  details: any;
}

export default class ErrorResponse implements IError {
  code: number;
  status: EStatus;
  message: string;
  details: any;
  constructor({ code, message, details }: IError) {
    this.code = code;
    this.status = EStatus.ERROR;
    this.message = message;
    this.details = details;
  }
}
