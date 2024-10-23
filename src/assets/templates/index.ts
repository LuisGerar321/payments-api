export const newUserTemplate = (username: string): string => {
  return `
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden; font-family: Arial, sans-serif; color: #333">
    
    <!-- Header -->
    <div style="background-color: #4CAF50; padding: 20px; text-align: center; color: white;">
      <h1 style="margin: 0; font-size: 24px;">🎉 ¡Bienvenido a Payments App 🪙! 🎉</h1>
    </div>
    
    <!-- Body -->
    <div style="padding: 20px; text-align: center;">
      <p style="font-size: 18px; line-height: 1.6;">
        👋 ¡Hola <strong>${username}</strong>!<br><br>
        Gracias por crear una cuenta con nosotros, estamos emocionados de tenerte!<br>
      </p>
      <p style="font-size: 16px; color: #777;">
        ¡Esperamos que disfrutes la app! 🚀
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 14px; color: #888;">
      <p style="margin: 0;">© 2024 Developed by Luis Gerardo Camara Salinas.</p>
            <p style="margin: 5px 0;">
        👨‍💻Visita mi GitHub: 
        <a target="_blank" href="https://github.com/LuisGerar321" style="color: #4CAF50; text-decoration: none;">
          LuisGerar321
        </a>
      </p>
    </div>
  
  </div>`;
};
