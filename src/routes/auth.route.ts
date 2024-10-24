import { Router } from "express";
import { validateBodyMiddleware, validateTokenMiddleware } from "../middleware";
import { authClientSchema } from "../validators/auth.validator";
import { AuthController } from "../controllers/auth.controller";

const AuthsRouter = Router();

AuthsRouter.post("/", validateBodyMiddleware(authClientSchema), AuthController.handleLogin);

export default AuthsRouter;
