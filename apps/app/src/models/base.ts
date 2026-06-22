export interface IBaseResponse {
  success?: boolean;
  status?: string;
  statusCode: number;
  message: string;
  errors?: string[];
  timestamp: string;
  path: string;
}

export interface IQueryParams {
  startDate?: string;
  endDate?: string;
  staff?: string;
  status?: string;
  ref?: string;
  name?: string;
  role?: string;
  expired?: boolean;
  enabled?: boolean;
  type?: string;
  search?: string;

  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";

  category?: string;
  purchaseRef?: string;
  viewed?: boolean;
  paymentType?: string;
}
