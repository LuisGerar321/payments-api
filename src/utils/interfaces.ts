export interface IMailerSendEmail {
  to: string;
  subject: string;
  text?: string;
  html?: any;
}
