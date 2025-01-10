"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_1 = __importDefault(require("./middleware/error"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const colors_1 = __importDefault(require("colors"));
require("./config");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// routes
const user_route_1 = __importDefault(require("./routes/user.route"));
const project_route_1 = __importDefault(require("./routes/project.route"));
const rfq_route_1 = __importDefault(require("./routes/rfq.route"));
const subs_route_1 = __importDefault(require("./routes/subs.route"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json({ limit: "50mb" }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use("/api/v1/user", user_route_1.default);
app.use("/api/v1/project", project_route_1.default);
app.use("/api/v1/rfq", rfq_route_1.default);
app.use("/api/v1/subscriber", subs_route_1.default);
app.listen(PORT, () => {
    console.log(colors_1.default.cyan(`Trioe Server running on port: ${PORT}`));
});
// testing api
app.get("/test", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "API is working",
    });
});
// unknown route
app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});
app.use(error_1.default);
