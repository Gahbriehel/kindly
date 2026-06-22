import type { IBaseResponse } from "./base";

export interface ITemplateResponse extends IBaseResponse {
  data: { templates: ITemplate[] };
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
  title: string;
  message: string;
  type: string;
  categoryId: string;
}
