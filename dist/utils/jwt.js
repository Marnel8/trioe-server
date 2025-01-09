// parse enviroment variables to integrates with the fallback value
const accessTokenExpires = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);
const refreshTokenExpires = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10);
// Update the options to use the new type
export const accessTokenOptions = {
    expires: new Date(Date.now() + 60 * 60 * 1000),
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    samesite: "lax",
};
export const refreshTokenOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    samesite: "lax",
};
export const sendToken = (user, statusCode, res) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();
    if (process.env.NODE_ENV === "production") {
        accessTokenOptions.secure = true;
    }
    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);
    const role = user.role;
    res.status(statusCode).json({
        success: true,
        role,
        user: user.toJSON(),
        accessToken,
    });
};
