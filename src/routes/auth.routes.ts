import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router: Router = Router();

router.post("/create-account", AuthController.createAccount);

export default router;
