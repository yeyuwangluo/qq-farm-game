/**
 * 响应工具函数
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp: number;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    timestamp: number;
  };
}

/**
 * API错误类
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors?: string[];

  constructor(
    message: string,
    statusCode: number = 500,
    errors?: string[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'AppError';
  }

  static badRequest(message: string, errors?: string[]): AppError {
    return new AppError(message, 400, errors);
  }

  static unauthorized(message: string = 'Unauthorized'): AppError {
    return new AppError(message, 401);
  }

  static forbidden(message: string = 'Forbidden'): AppError {
    return new AppError(message, 403);
  }

  static notFound(message: string = 'Not Found'): AppError {
    return new AppError(message, 404);
  }

  static conflict(message: string): AppError {
    return new AppError(message, 409);
  }

  static internal(message: string = 'Internal Server Error'): AppError {
    return new AppError(message, 500);
  }
}

/**
 * 成功响应
 */
export function successResponse<T>(
  message: string,
  data?: T
): {
  success: true;
  message: string;
  data?: T;
  timestamp: number;
} {
  return {
    success: true,
    message,
    data,
    timestamp: Date.now(),
  };
}

/**
 * 错误响应
 */
export function errorResponse(code: string, message: string): ErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      timestamp: Date.now(),
    },
  };
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  success: true;
  data: {
    items: T[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
  timestamp: number;
}

export function paginatedResponse<T>(
  items: T[],
  page: number,
  pageSize: number,
  total: number
): PaginatedResponse<T> {
  return {
    success: true,
    data: {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    },
    timestamp: Date.now(),
  };
}

/**
 * 无数据响应
 */
export function noDataResponse(): SuccessResponse<null> {
  return {
    success: true,
    data: null,
    timestamp: Date.now(),
  };
}
