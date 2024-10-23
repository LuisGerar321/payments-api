import sequelize from "../../src/database";
import { createTransactionSchema } from "../../src/validators/transactions.validator";

jest.mock("../../src/models/clients.model");
jest.mock("../../src/services/mailer.service");
jest.mock("../../src/database", () => ({
  __esModule: true,
  default: {
    transaction: jest.fn(),
  },
}));

describe("Transaction Payload Validation", () => {
  let mockTransaction: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTransaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };

    (sequelize.transaction as jest.Mock).mockResolvedValue(mockTransaction);
  });

  describe("Invalid Transaction Payloads", () => {
    it("should return an error when 'Add' transaction contains a forbidden recipientId", async () => {
      // Arrange
      const incorrectPayload = {
        senderId: 1,
        type: "add",
        recipientId: 2, // not allowed in 'Add' transactions
        amount: 1,
      };

      // Act
      const validatePayload = createTransactionSchema.validate(incorrectPayload);

      // Assert
      expect(validatePayload).toHaveProperty("error");
      expect(validatePayload.error?.message).toEqual('"recipientId" is not allowed');
    });

    it("should return an error when 'Pay' transaction is confirmed without email 2FA", async () => {
      // Arrange
      const incorrectPayload = {
        senderId: 1,
        type: "pay",
        recipientId: 2,
        amount: 1,
        status: "confirmed", // 'Pay' transactions require pending status until 2FA
      };

      // Act
      const validatePayload = createTransactionSchema.validate(incorrectPayload);

      // Assert
      expect(validatePayload).toHaveProperty("error");
      expect(validatePayload.error?.message).toEqual('"status" must be [pending]');
    });

    it("should return an error when 'External Payment' transaction is missing external payment reference", async () => {
      // Arrange
      const incorrectPayload = {
        senderId: 1,
        type: "external_payment",
        amount: 1, // missing 'externalPaymentRef'
      };

      // Act
      const validatePayload = createTransactionSchema.validate(incorrectPayload);

      // Assert
      expect(validatePayload).toHaveProperty("error");
      expect(validatePayload.error?.message).toEqual('"externalPaymentRef" is required');
    });
  });

  describe("Valid Transaction Payloads", () => {
    it("should validate successfully when the payload is for a valid 'Pay' transaction", async () => {
      // Arrange
      const validPayTransaction = {
        senderId: 1,
        type: "pay",
        recipientId: 2,
        amount: 1,
      };

      // Act
      const validatePayload = createTransactionSchema.validate(validPayTransaction);

      // Assert
      expect(validatePayload).not.toHaveProperty("error");
    });

    it("should validate successfully when the payload is for a valid 'External Payment' transaction", async () => {
      // Arrange
      const validExternalTransaction = {
        senderId: 1,
        type: "external_payment",
        externalPaymentRef: "123dsvc",
        amount: 1,
      };

      // Act
      const validatePayload = createTransactionSchema.validate(validExternalTransaction);

      // Assert
      expect(validatePayload).not.toHaveProperty("error");
    });

    it("should validate successfully when the payload is for a valid 'Add to my funds' transaction", async () => {
      // Arrange
      const validAddTransaction = {
        senderId: 1,
        type: "add",
        amount: 1,
      };

      // Act
      const validatePayload = createTransactionSchema.validate(validAddTransaction);

      // Assert
      expect(validatePayload).not.toHaveProperty("error");
    });
  });
});
