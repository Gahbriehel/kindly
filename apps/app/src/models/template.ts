import type { IBaseResponse } from "./base";

export interface ITemplateResponse extends IBaseResponse {
  data: ITemplate[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: null;
    prevPage: null;
    links: {
      first: string;
      prev: null;
      next: null;
      last: string;
    };
  };
}

export interface ITemplate {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  message: string;
  type: string;
  isActive: boolean;
  categoryId: string;
  individualId: string;
  companyId: string | null;
  category: {
    id: string;
    name: string;
  };
}

export interface ITemplatePayload {
  title: string;
  message: string;
  type: string;
  categoryId: string;
}
