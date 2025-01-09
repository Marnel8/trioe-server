"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.refreshTokenOptions = exports.accessTokenOptions = void 0;
// parse enviroment variables to integrates with the fallback value
const accessTokenExpires = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);
const refreshTokenExpires = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10);
// Update the options to use the new type
exports.accessTokenOptions = {
    expires: new Date(Date.now() + 60 * 60 * 1000),
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    samesite: "lax",
};
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    samesite: "lax",
};
const sendToken = (user, statusCode, res) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();
    if (process.env.NODE_ENV === "production") {
        exports.accessTokenOptions.secure = true;
    }
    res.cookie("access_token", accessToken, exports.accessTokenOptions);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
    const role = user.role;
    res.status(statusCode).json({
        success: true,
        role,
        user: user.toJSON(),
        accessToken,
    });
};
exports.sendToken = sendToken;
