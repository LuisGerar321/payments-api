import { Op, Transaction } from "sequelize";
import ErrorResponse from "../utils/errors";
import Clients from "../models/clients.model";
import { Mailer } from "./mailer.service";
import { newUserTemplate } from "../assets/templates";
import { error } from "console";
import sequelize from "../database";

export const findAllClients = async () => {
  try {
    const clients = await Clients.findAll({
      where: { parentClientId: { [Op.eq]: null } },
    });
    return clients;
  } catch (err) {
    throw new ErrorResponse({
      status: 500,
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

export const createAClient = async (name: string, email: string, phone: string, transaction = undefined): Promise<Clients> => {
  let t = transaction ?? (await sequelize.transaction());
  try {
    const isEmailTaken = await isEmailInUse(email, t);

    if (isEmailTaken) {
      throw new ErrorResponse({
        status: 400,
        message: "Error when triying to created a new user, email is in use! Try with other.",
        details: {},
      });
    }

    const newClient = await Clients.create(
      {
        name,
        email,
        phone,
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
    console.error("Error creating client:", err);
    if (err instanceof ErrorResponse) throw err;

    if (err instanceof Error)
      throw new ErrorResponse({
        status: 500,
        message: "Error creating client.",
        details: {
          name: err?.name,
          message: err?.message,
          stack: err?.stack,
        },
      });

    throw new ErrorResponse({
      status: 500,
      message: "Error creating client.",
      details: err,
    });
  }
};

export const findClientsById = async () => {
  try {
  } catch (err) {
    throw new ErrorResponse({
      status: 500,
      message: "Error retrieving clients.",
      details: err,
    });
  }
};
