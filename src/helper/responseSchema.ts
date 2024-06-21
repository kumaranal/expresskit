import { Response } from "express";

interface IErrorStack {
  name: string;
  message: string;
  status: number;
}

export async function successResponse(
  res: Response,
  data: object | unknown | string,
  statusCode: number,
  noChange: boolean = false
) {
  if (noChange) {
    return res
      .status(statusCode)
      .json({ data: data, message: "SUCCESS", status: statusCode });
  }

  if (typeof data === "string" && statusCode) {
    return res.status(statusCode).json({
      data: data.toLocaleLowerCase(),
      message: "SUCCESS",
      status: statusCode,
    });
  }
  return res.status(statusCode).json({
    data,
    message: "SUCCESS",
    status: statusCode,
  });
}

export async function failResponse(
  res: Response,
  data: object | string | unknown,
  statusCode: number
) {
  if (isIErrorStack(data)) {
    return res.status(data.status || 500).json({
      error: data.message.toLocaleLowerCase(),
      message: "FAIL",
      status: data.status || 500,
    });
  } else if (typeof data === "string" && statusCode) {
    return res.status(statusCode).json({
      error: data.toLocaleLowerCase(),
      message: "FAIL",
      status: statusCode,
    });
  } else {
    return res.status(500).json({
      error: "An unexpected error occurred",
      message: "FAIL",
      status: 500,
    });
  }
}

function isIErrorStack(error: unknown): error is IErrorStack {
  if (
    typeof error === "object" &&
    error !== null &&
    ("message" in error || "status" in error || "name" in error)
  ) {
    return true;
  }
  return false;
}
