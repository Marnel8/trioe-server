import express from "express";
import ErrorMiddleware from "./middleware/error";
import cookieParser from "cookie-parser";
import cors from "cors";
import colors from "colors";
import "./config";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
// routes
import userRoutes from "./routes/user.route";
import projectRoutes from "./routes/project.route";
import rfqRoutes from "./routes/rfq.route";
import subscriberRoutes from "./routes/subs.route";
const app = express();
const PORT = process.env.PORT || 5001;
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors({
    origin: "https://www.trioe.dev",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/project", projectRoutes);
app.use("/api/v1/rfq", rfqRoutes);
app.use("/api/v1/subscriber", subscriberRoutes);
app.listen(PORT, () => {
    console.log(colors.cyan(`Trioe Server running on port: ${PORT}`));
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
app.use(ErrorMiddleware);
