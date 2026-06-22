import type { IBaseResponse } from "./base";

export interface ICategoryResponse extends IBaseResponse {
  data: {
    total: number;
    categories: ICategory[];
  };
}

export interface ICategory {
  id: string;
  name: string;
  isSystem: boolean;
  templateCount: number;
  eventCount: number;
  createdAt: string;
  updatedAt: string;
}
