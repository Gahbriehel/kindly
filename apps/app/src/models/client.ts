import type { IBaseResponse, IPagination } from "./base";

export type ClientType = "INDIVIDUAL" | "MULTIPLE";

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
  categoryId?: string;
  isRecurring?: boolean;
  notes?: string;
  /** Applied to everyone in the submission; the backend saves new ones. */
  tags?: string[];
  individual?: ICreateClientItem | null;
  multiple?: ICreateClientItem[] | null;
}

export interface IUpdateClientPayload {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: string;
  tags?: string[];
  /** Event fields must be sent together: eventName and eventDate. */
  eventName?: string;
  eventDate?: string;
  categoryId?: string;
  isRecurring?: boolean;
  notes?: string;
}

export type IClientPayload = ICreateClientPayload;

export interface IClientEvent {
  id: string;
  title: string;
  date: string;
  isRecurring: boolean;
  categoryId?: string;
  category?: { id: string; name: string } | null;
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
  pagination: IPagination;
}

export interface ISingleClientResponse extends IBaseResponse {
  data: IClient;
}

export interface ITag {
  id: string;
  name: string;
  createdAt: string;
}

export interface ITagResponse extends IBaseResponse {
  data: ITag[];
  pagination: IPagination;
}
