import { IBaseResponse, IPagination } from "./base";

export interface IEvent {
  id: string;
  title: string;
  date: string;
  isRecurring: boolean;
  notes?: string | null;
  categoryId?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string } | null;
  participants?: IEventParticipant[];
  occurrenceDate?: string;
  nextOccurrence?: string;
}

interface IEventParticipant {
  id: string;
  clientId: string;
  eventId: string;
  client: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
}

export interface IEventPayload {
  title: string;
  date: string;
  isRecurring: boolean;
  categoryId?: string;
  notes?: string;
  groupId?: string;
  participantClientIds?: string[];
}

export interface IEventResponse extends IBaseResponse {
  data: IEvent[];
  pagination: IPagination;
}
