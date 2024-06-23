import { Request, Response, NextFunction } from "express";

interface ErrorWithStatus extends Error {
  status?: number;
}

const errorHandlerfn = (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message.toLowerCase() || "An unexpected error occurred";
  
  res.status(status).json({ message: "FAIL", error: message });
};

export default errorHandlerfn;
