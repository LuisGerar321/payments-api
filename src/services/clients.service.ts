import { Op } from "sequelize";
import ErrorResponse from "../utils/errors";
import Clients from "../models/clients.model";
import { Mailer } from "./mailer.service";
import { newUserTemplate } from "../assets/templates";

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

export const createAClient = async (name: string, email: string, phone: string): Promise<Clients> => {
  try {
    const isEmailTaken = await Clients.findOne({
      where: {
        email,
      },
      attributes: [],
    });

    if (isEmailTaken) {
      throw new ErrorResponse({
        status: 400,
        message: "Error when triying to created a new user, email is in use! Try with other.",
        details: {},
      });
    }

    const newClient = await Clients.create({
      name,
      email,
      phone,
    });

    const mailer = Mailer.getInstance();
    await mailer.sendEmail({
      to: email,
      subject: "Bienvenido a Payments App",
      html: newUserTemplate,
    });

    return newClient;
  } catch (err) {
    console.error("Error creating client:", err);
    if (err instanceof ErrorResponse) throw err;
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
