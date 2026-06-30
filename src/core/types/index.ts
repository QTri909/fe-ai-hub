export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
  status?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
