"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rfq_controller_1 = require("../controllers/rfq.controller");
const router = (0, express_1.Router)();
router.post("/", rfq_controller_1.createRFQ);
exports.default = router;
