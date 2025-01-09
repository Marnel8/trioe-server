import catchAsyncErrors from "./catchAsyncError";
import jwt from "jsonwebtoken";
import User from "../models/user/user.model";
import ErrorHandler from "../utils/errorHandler";
// Authenticated Users
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const access_token = req?.cookies.access_token;
    if (!access_token)
        return next(new ErrorHandler("Please login to access this resource", 401));
    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET || "");
    if (!decoded)
        return next(new ErrorHandler("Access token is not valid. Please try again.", 401));
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    req.user = user;
    next();
});
// Validate user roles
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req?.user.role || "")) {
            return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to access this resource`, 404));
        }
        next();
    };
};
