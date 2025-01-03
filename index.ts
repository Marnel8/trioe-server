import express, { NextFunction, Request, Response } from "express";
import ErrorMiddleware from "./middleware/error";
import cookieParser from "cookie-parser";
import cors from "cors";
import colors from "colors";
import "./config";
import path from "path";

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

app.use(
	cors({
		origin: ["https://www.trioe.dev", `${process.env.FRONTEND_URL}`],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"],
	})
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/project", projectRoutes);
app.use("/api/v1/rfq", rfqRoutes);
app.use("/api/v1/subscriber", subscriberRoutes);

app.listen(PORT, () => {
	console.log(colors.cyan(`Trioe Server running on port: ${PORT}`));
});

// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		success: true,
		message: "API is working",
	});
});

// unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
	const err = new Error(`Route ${req.originalUrl} not found`) as any;
	err.statusCode = 404;
	next(err);
});

app.use(ErrorMiddleware);
