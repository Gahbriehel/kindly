export interface IBaseResponse {
  status: string;
  message: string;
  errors?: string[];
}

export interface IQueryParams {
  startDate?: string;
  endDate?: string;
  approved?: string;
  staff?: string;
  status?: string;
  paymentType?: string;
  ref?: string;
  category?: string;
  name?: string;
  page?: number;
  limit?: number;
  role?: string;
  purchaseRef?: string;
  expired?: boolean;
  signal?: AbortSignal;
  source?: string;
  delivered?: "pending" | "complete";
  viewed?: boolean;
  enabled?: boolean;
  productionId?: string;
}
