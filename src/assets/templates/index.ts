import Transactions from "../../models/transactions.model";
import { ETransactionType } from "../../utils/interfaces";

const emailTemplate = (header: string, body: string): string => {
  return `
  <div style="max-width: 600px; margin: auto; border: 1px solid gray; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden; font-family: Arial, sans-serif; color: #333">
    
    <!-- Header -->
    <div style="background-color: #4CAF50; padding: 20px; text-align: center; color: white;">
      <h1 style="margin: 0; font-size: 24px;">${header}</h1>
    </div>
    
    <!-- Body -->
    <div style="padding: 20px; text-align: center;">
      ${body}
    </div>
    
    <!-- Footer -->
    ${footerTemplate()}
  
  </div>`;
};

export const footerTemplate = () => {
  return `
    <div style="background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 14px; color: #888;">
      <p style="margin: 0;">© 2024 Developed by Luis Gerardo Camara Salinas.</p>
      <p style="margin: 5px 0;">
        👨‍💻Visita mi GitHub: 
        <a target="_blank" href="https://github.com/LuisGerar321" style="color: #4CAF50; text-decoration: none;">
          LuisGerar321
        </a>
      </p>
    </div>
  `;
};

export const newUserTemplate = (username: string): string => {
  const body = `
    <p style="font-size: 18px; line-height: 1.6;">
      👋 ¡Hola <strong>${username}</strong>!<br><br>
      Gracias por crear una cuenta con nosotros, estamos emocionados de tenerte!<br>
    </p>
    <p style="font-size: 16px; color: #777;">
      ¡Esperamos que disfrutes la app! 🚀
    </p>
  `;
  return emailTemplate("🎉 ¡Bienvenido a Payments App 🪙! 🎉", body);
};

export const pendingTransactionTemplate = (transactionDetails: Partial<Transactions>, token: string): string => {
  const { id, amount, type, sender, recipient, createdAt, externalPaymentRef } = transactionDetails;

  const recipientMessage = type === ETransactionType.EXTERNAL_PAYMENT ? "Envío a un destinatario externo" : "Destinatario Cliente";

  const body = `
    <p style="font-size: 18px; line-height: 1.6;">
      ¡Hola ${sender?.name || "Usuario"}!<br><br>
      Hemos recibido tu solicitud para realizar una transacción de fondos. Sin embargo, para completar este proceso, es necesario que confirmes tu identidad ingresando el siguiente token en la solicitud correspondiente.<br><br>
      Una vez que ingreses el token, procederemos con la transacción. Aquí están los detalles de tu operación:
    </p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <tr>
        <th style="text-align: center; border: 1px solid #ddd; padding: 8px;">Campo</th>
        <th style="text-align: center; border: 1px solid #ddd; padding: 8px;">Detalles</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">ID de Transacción</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${id}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Monto</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">$${amount}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Tipo de Transacción</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${type}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Estado</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Pendiente</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Envia</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${sender?.name}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${recipientMessage}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${type === ETransactionType.EXTERNAL_PAYMENT ? externalPaymentRef : recipient?.name}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">Fecha de Creación</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${new Date(createdAt).toLocaleString()}</td>
      </tr>
    </table>
    <p style="font-size: 16px; color: #777; margin-top: 20px;">
      Este es tu token de confirmación: <strong>${token}</strong><br>
      ¡Gracias por utilizar nuestra aplicación!
    </p>
  `;

  return emailTemplate("🪙 Confirmación de Transacción 🪙", body);
};
