import { Router } from "express";
import { addSubscriber } from "../controllers/subscribers.controller";
const router = Router();
router.post("/", addSubscriber);
export default router;
