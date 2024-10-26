# Payments API Collection Description

This API collection allows you to interact with a payment system where users (clients) can log in, manage transactions (send, receive, and verify payments), and query their account details like balance and transaction history.

## HTTPS HOST

This API is host in AWS EC2

- https://www.luis.payments.back.minideskdev.com

## Endpoints

### Authentication (Auth)

- **loginFirstClient:** Authenticates the first client by email and citizen identity document number. Retrieves and stores access and refresh tokens.
- **loginSecondClient:** Authenticates the second client and stores their access and refresh tokens similarly.

### Client Management (Clients)

- **firstClient:** Registers a new client with details like name, email, phone, and citizen identity document number. The client ID is stored after the response.
- **secondClient:** Registers another client with similar details.

### Transactions (Transactions)

- **addFounds:** Adds funds to a specified sender's account.
- **ExternalPayment:** Handles an external payment with reference and amount, storing the transaction ID upon response.
- **Payment:** Initiates a payment from one client to another, storing the transaction ID.
- **ConfirmPayment:** Confirms a transaction using a token.
- **SelfBalance:** Retrieves the balance of the currently authenticated user.
- **SelfTransactions:** Retrieves all transactions for the authenticated user.

## Variables

- **host:** Default value is set to `http://localhost`.
- **port:** Default value is set to `3001`.
- **clientId, transactionId, accessToken, refreshAccessToken:** Dynamic variables set during the API lifecycle for making authenticated requests and handling client-specific actions.

## Authentication

Bearer token authentication is used for transaction-related requests, with the access token dynamically set after login.

## Prerequisites for local running

Ensure you have the following installed on your system:

- Node.js
- PostgreSQL (database)
- Redis (For exp token cache)
- GMAIL credentials in .env getting in 'APP PASSWORD' (needed enabled 2fa google) [Nodemailer gmail tutorial: Stackoverflow](https://stackoverflow.com/questions/45478293/username-and-password-not-accepted-when-using-nodemailer)

## Getting Started

Follow the instructions below to set up the project.

### 1. Clone the Repository

```bash
git clone https://github.com/LuisGerar321/payments-api.git
cd payments-api
```

### 2. Environment Variables

Create a `.env` file in the root directory of the project and add your environment variables:

```
## EVARIMENT = dev | prod
ENVIROMENT = "dev"

HOST = "localhost"
HOST_PORT = "3001"


DB_HOST = "localhost"
DB_USER = "postgres"
DB_PASS = "postgres"
DB_NAME = "node-api"


## MAILER CONFIG
EMAIL_HOST = "smtp.gmail.com"
EMAIL_USER = "your_accout@gmail.com"
EMAIL_PASS = "*** **** **** ****"

## JWT
JWT_TOKEN_SECRET = "payments-api"
JWT_TOKEN_EXP = "1h"

## REDIS
# REDIS_URL = "redis://localhost:YOUR_REDIS_PORT"

```

### 3. Install Packages

This project utilizes Sequelize-TypeScript as the ORM, Express to handle server requests, and several other essential libraries. To install the required packages, run the following command:

```bash
npm install
```

### 4. Running the Application

Once the packages have been installed, ensure that your PostgreSQL database server is running and that your .env configuration is correctly set up. Then, start the application using:

```bash
npm run dev
```

### 5. Accessing the Application

The API includes CRUD operations available at the /comments endpoint. Additionally, I have shared my Postman collection in this repository as NODE-API.postman_collection.json. This collection includes predefined variables to facilitate the execution of the API methods from start to finish. To use it, simply import the file into your Postman collections.

### 5. Test APP

```bash
npm test
```

## Technologies Used

- Node.js
- Express
- Sequelize
- PostgreSQL
- TypeScript

## License

This project is licensed under the ISC License.

## Contact

### dojas64@gmail.com

#### Luis Gerardo Camara Salinas

[Linkedin](https://www.linkedin.com/in/luis-gerardo-camara-salinas321/)
