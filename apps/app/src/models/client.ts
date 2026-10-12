import type { IBaseResponse } from "./base";

export type ClientType = "INDIVIDUAL" | "MULTIPLE";
export type ClientEventType = "BIRTHDAY" | "WEDDING" | "ANNIVERSARY";

export interface ICreateClientItem {
  clientId?: string;
  name?: string;
  phoneNumber?: string;
  email?: string;
  birthDate?: string;
}

export interface ICreateClientPayload {
  type: ClientType;
  eventName?: string;
  eventDate?: string;
  eventType?: ClientEventType;
  individual?: ICreateClientItem | null;
  multiple?: ICreateClientItem[] | null;
}

export interface IUpdateClientPayload {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: string;
  tags?: string[];
}

export type IClientPayload = ICreateClientPayload;

export interface IClientEvent {
  id: string;
  title: string;
  date: string;
  isRecurring: boolean;
  categoryId?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IClientGroup {
  id: string;
  name: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IClient {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  birthDate: string | null;
  isActive: boolean;
  tags: string[];
  companyId: string;
  createdAt: string;
  updatedAt: string;
  events?: IClientEvent[];
  groups?: IClientGroup[];
}

export interface IClientResponse extends IBaseResponse {
  data: IClient[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
    links: {
      first: string;
      prev: string | null;
      next: string | null;
      last: string;
    };
  };
}

export interface ISingleClientResponse extends IBaseResponse {
  data: IClient;
}
