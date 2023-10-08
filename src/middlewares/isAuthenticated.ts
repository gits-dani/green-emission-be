import { Request, Response, NextFunction } from "express";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    status: "error",
    message: "Unauthorized",
  });
};

export { isAuthenticated };
