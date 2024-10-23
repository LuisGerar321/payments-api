import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import Clients from "./clients.model";
import { ETransactionStatus, ETransactionType } from "../utils/interfaces";

@Table
export default class Transactions extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;

  @ForeignKey(() => Clients)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  senderId!: number;

  @BelongsTo(() => Clients, { foreignKey: "senderId" })
  sender?: Clients;

  @ForeignKey(() => Clients)
  @Column({
    type: DataType.INTEGER,
    allowNull: true, // true when is an external payment (means that amount is not sended for a client for this app) or is an ADD found.
  })
  recipientId!: number;

  @BelongsTo(() => Clients, { foreignKey: "recipientId" })
  recipient?: Clients;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  externalPaymentRef?: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    validate: {
      isIn: [Object.values(ETransactionType)],
    },
  })
  transactionType!: ETransactionType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: ETransactionStatus.PENDING,
    validate: {
      isIn: [Object.values(ETransactionStatus)],
    },
  })
  status!: ETransactionStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;
}
