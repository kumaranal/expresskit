// utils/customError.ts
export interface ErrorWithStatus extends Error {
    status?: number;
  }
  
  export function createCustomError(message: string, status: number ): ErrorWithStatus {
    const error = new Error(message) as ErrorWithStatus;
    error.status = status;
    return error;
  }
  