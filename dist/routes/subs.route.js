"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscribers_controller_1 = require("../controllers/subscribers.controller");
const router = (0, express_1.Router)();
router.post("/", subscribers_controller_1.addSubscriber);
exports.default = router;
