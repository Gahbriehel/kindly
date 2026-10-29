import { IBaseResponse } from "./base";

export interface IDashboardResponse extends IBaseResponse {
  data: {
    dashboard: {
      context: {
        type: string;
        role: string;
      };
      // Sections the user can't view come back as null.
      stats: {
        activeClients: number | null;
        totalTemplates: number | null;
        totalStaff: number | null;
        eventsThisMonth: number | null;
        upcomingEvents: number | null;
      };
      todaysOutreach: {
        date: string;
        total: number;
        events: {
          eventId: string;
          title: string;
          category: string;
          notes: string;
          clients: {
            id: string;
            fullName: string;
            email: string | null;
            phoneNumber: string | null;
          };
        }[];
      } | null;
      upcomingPreview:
        | {
            eventId: string;
            title: string;
            date: string;
            category: string;
            clientNames: string[];
          }[]
        | null;
      recentActivity: {
        type: string;
        label: string;
        refId: string;
        at: string;
      }[];
    };
  };
}
