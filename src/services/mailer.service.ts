import { config } from "../config/index";
import nodemailer from "nodemailer";
import ErrorResponse from "../utils/errors";
import { IMailerSendEmail } from "../utils/interfaces";

const { email, enviroment } = config;

export class Mailer {
  private static instance: Mailer;
  protected transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: email.host,
      port: enviroment === "prod" ? 465 : 587,
      secure: enviroment === "prod",
      auth: {
        user: email.user,
        pass: email.pass,
      },
    });
  }

  public static getInstance() {
    if (!Mailer.instance) {
      Mailer.instance = new Mailer();
    }
    return Mailer.instance;
  }
  public async sendEmail({ to, subject, text, html }: IMailerSendEmail): Promise<void> {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail({ from: email.user, to, subject, text, html }, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);

          reject(
            new ErrorResponse({
              status: 500,
              message: `Error in sending a email: .${error?.message}`,
              details: error,
            }),
          );
        } else {
          console.info(`Email sent sucessfully:${info.response}`);
          resolve();
        }
      });
    });
  }
}
