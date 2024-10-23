import { Op } from "sequelize";
import ErrorResponse from "../utils/errors";
import Clients from "../models/clients.model";

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
    let newClient: Clients | null = null;

    newClient = await Clients.create({
      name,
      email,
      phone,
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
