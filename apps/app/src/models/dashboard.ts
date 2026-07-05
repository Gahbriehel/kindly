import { IBaseResponse } from "./base";

export interface IDashboardResponse extends IBaseResponse {
  data: {
    dashboard: {
      context: {
        type: string;
        role: string;
      };
      stats: {
        activeClients: number;
        totalTemplates: number;
        totalModerators: number;
        eventsThisMonth: number;
        upcomingEvents: number;
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
            email: string;
            phoneNumber: string;
          };
        }[];
      };
      upcomingPreview: {
        eventId: string;
        title: string;
        date: string;
        category: string;
        clientNames: string[];
      }[];
      recentActivity: {
        type: string;
        label: string;
        refId: string;
        at: string;
      }[];
    };
  };
}
