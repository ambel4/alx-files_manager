import AppController from "../controllers/AppController.js";
import UsersController from "../controllers/UsersController.js";
import AuthController from "../controllers/AuthController.js";
import FilesController from "../controllers/FilesController.js";
import { Router } from "express";

const router = Router();

router.get("/status", AppController.getStatus);
router.get("/stats", AppController.getStats);
router.post("/users", UsersController.postNew);
router.get("/connect", AuthController.getConnect);
router.get("/disconnect", AuthController.getDisconnect);
router.get("/users/me", UsersController.getMe);
router.post("/files", FilesController.postUpload);

export default router;


