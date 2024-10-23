import { createAClient, isEmailInUse } from "../../src/services/clients.service";
import Clients from "../../src/models/clients.model";
import { Mailer } from "../../src/services/mailer.service";
import sequelize from "../../src/database";
import ErrorResponse from "../../src/utils/errors";
import { EStatus } from "../../src/utils/interfaces";

jest.mock("../../src/models/clients.model");
jest.mock("../../src/services/mailer.service");
jest.mock("../../src/database", () => ({
  __esModule: true,
  default: {
    transaction: jest.fn(),
  },
}));

describe("createAClient", () => {
  const clientMock = {
    name: "test",
    email: "test@example.com",
    phone: "99999999",
  };
  const clientSeqModelResponse = {
    id: 1,
    ...clientMock,
    updatedAt: "2024-10-23T17:12:58.065Z",
    createdAt: "2024-10-23T17:12:58.065Z",
  };

  let mockTransaction: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTransaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };

    (sequelize.transaction as jest.Mock).mockResolvedValue(mockTransaction);
  });

  it("should create a client and send an email", async () => {
    // Arrange
    (Clients.create as jest.Mock).mockResolvedValue(clientSeqModelResponse);
    (Clients.findOne as jest.Mock).mockResolvedValue(null);
    (Mailer.getInstance as jest.Mock).mockReturnValue({
      sendEmail: jest.fn().mockResolvedValue(""),
    });

    //Act
    const client = await createAClient(clientMock.name, clientMock.email, clientMock.phone);

    //Assert
    expect(client).toEqual(clientSeqModelResponse);
    expect(Clients.create).toHaveBeenCalledWith(clientMock, { transaction: mockTransaction });
    expect(Mailer.getInstance().sendEmail).toHaveBeenCalledWith({
      to: clientMock.email,
      subject: "Bienvenido a Payments App",
      html: expect.any(String),
    });

    expect(mockTransaction.commit).toHaveBeenCalled();
  });

  it("should throw an error if the email is already in use", async () => {
    try {
      //Arrenge
      (Clients.findOne as jest.Mock).mockResolvedValue({ id: 1 });

      //Act
      await createAClient(clientMock.name, clientMock.email, clientMock.phone);
    } catch (error) {
      //Assert
      expect(error).toBeInstanceOf(ErrorResponse);
      expect(Clients.create).not.toHaveBeenCalled();
    }
  });
});