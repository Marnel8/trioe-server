import { Router } from "express";
import { createRFQ } from "../controllers/rfq.controller";
const router = Router();
router.post("/", createRFQ);
export default router;
