import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {

    let token = req.headers["authorization"];

    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Token is required" });

    if (token.startsWith("Bearer ")) token = token.slice(7);

    let decodeToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decodeToken?.userId; // Pass userId for further use
    next();
    
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token has expired" });
    }
    return res.status(400).json({
      success: false,
      message: "Invalid JWT token",
      isAuthorized: false,
    });
  }
};
