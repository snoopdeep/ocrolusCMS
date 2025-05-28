import jwt from "jsonwebtoken";
import { errorHandler } from "./errorHandler.js";

export const verifyAndRefreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    
    if (!token) {
      return next(errorHandler(401, "Unauthorized! Please log in."));
    }
    jwt.verify(token, process.env.JWT_SECRET_STRING, (err, decoded) => {
      if (err) {
        // clear the expired cookie
        res.clearCookie("access_token");
        return next(errorHandler(403, "Session expired. Please log in again."));
      }
      try {
        // token is valid, generate new token
        const newToken = jwt.sign(
          { id: decoded.id },
          process.env.JWT_SECRET_STRING,
          { expiresIn: "1d" }
        );
        // set new cookie
        res.cookie("access_token", newToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 5,
        });
        req.user = decoded;
        next();
      } catch (tokenError) {
        console.log('Token generation error:', tokenError);
        return next(errorHandler(500, "Token refresh failed"));
      }
    });
    
  } catch (error) {
    console.log('Middleware error:', error);
    return next(errorHandler(500, "Authentication middleware failed"));
  }
};