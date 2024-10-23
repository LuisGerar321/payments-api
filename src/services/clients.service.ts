import { Op, Transaction } from "sequelize";
import ErrorResponse from "../utils/errors";
import Clients from "../models/clients.model";
import { Mailer } from "./mailer.service";
import { newUserTemplate } from "../assets/templates";
import sequelize from "../database";
import { EStatus } from "../utils/interfaces";

export const findAllClients = async () => {
  try {
    const clients = await Clients.findAll({
      where: { parentClientId: { [Op.eq]: null } },
    });
    return clients;
  } catch (err) {
    throw new ErrorResponse({
      code: 500,
      message: "Error retrieving clients.",
      details: err,
    });
  }
};

export const isEmailInUse = async (email: string, transaction: Transaction | undefined = undefined) => {
  let t = transaction ?? (await sequelize.transaction());
  try {
    const isEmailInUse = await Clients.findOne({
      where: {
        email,
      },
      attributes: ["id"],
      transaction: t,
    });

    if (transaction === undefined) await t.commit();
    return isEmailInUse !== null;
  } catch (error) {
    if (transaction === undefined) await t.rollback();
    throw error;
  }
};

export const createAClient = async (name: string, email: string, phone: string, citizenIdentityDocumentNumber: string, transaction = undefined): Promise<Clients> => {
  let t = transaction ?? (await sequelize.transaction());
  try {
    const isEmailTaken = await isEmailInUse(email, t);

    if (isEmailTaken) {
      throw new ErrorResponse({
        code: 400,
        status: EStatus.ERROR,
        message: "Error when trying to create a new user, email is in use! Try with another.",
        details: {},
      });
    }

    const newClient = await Clients.create(
      {
        name,
        email,
        phone,
        citizenIdentityDocumentNumber,
      },
      { transaction: t },
    );

    const mailer = Mailer.getInstance();
    await mailer.sendEmail({
      to: email,
      subject: "Bienvenido a Payments App",
      html: newUserTemplate(name),
    });

    if (transaction === undefined) await t.commit();
    return newClient;
  } catch (err) {
    if (transaction === undefined) await t.rollback();
    if (err instanceof ErrorResponse) throw err;

    if (err instanceof Error)
      throw new ErrorResponse({
        code: 500,
        message: "Error creating client.",
        details: {
          name: err?.name,
          message: err?.message,
          stack: err?.stack,
        },
      });

    throw new ErrorResponse({
      code: 500,
      message: "Error creating client.",
      details: err,
    });
  }
};

export const findClientsById = async () => {
  try {
  } catch (err) {
    throw new ErrorResponse({
      code: 500,
      message: "Error retrieving clients.",
      details: err,
    });
  }
};
