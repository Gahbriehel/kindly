export interface IBaseResponse {
  responseCode: string;
  responseMessage: string;
  status: boolean;
}

export interface IQueryParams {
  startDate?: string;
  endDate?: string;
  staff?: string;
  status?: string;
  ref?: string;
  name?: string;
  page?: number;
  limit?: number;
  role?: string;
  expired?: boolean;
  enabled?: boolean;
  type?: string;
  search?: string;

  staffId?: string;
  approved?: string;
  productionId?: string;
  category?: string;
  purchaseRef?: string;
  viewed?: boolean;
  paymentType?: string;
}
