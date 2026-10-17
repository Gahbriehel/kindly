import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUserData, IClientLimit } from "../../models/auth";

interface authState {
  user: IUserData | null;
  accessToken: string | null;
  invalidSession: boolean;
  redirectUrl: string | null;
}

const initialState: authState = {
  user: null,
  accessToken: null,
  invalidSession: false,
  redirectUrl: null,
};

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      state.user = null;
      state.accessToken = null;
      state.invalidSession = false;
      state.redirectUrl = null;
    },
    setUser: (state, { payload }: PayloadAction<IUserData>) => {
      state.user = payload;
    },
    setToken: (state, { payload }: PayloadAction<string>) => {
      state.accessToken = payload;
    },
    invalidSession: (state) => {
      state.invalidSession = true;
    },
    setRedirectUrl: (state, { payload }: PayloadAction<string>) => {
      state.redirectUrl = payload;
    },
    clearRedirectUrl: (state) => {
      state.redirectUrl = null;
    },
    updateSubscriptionTier: (state, { payload }: PayloadAction<string>) => {
      if (state.user && state.user.company) {
        state.user.company.subscriptionTier = payload;
      }
    },
    updateCompany: (
      state,
      { payload }: PayloadAction<Partial<IUserData["company"]>>,
    ) => {
      if (state.user && state.user.company) {
        state.user.company = {
          ...state.user.company,
          ...payload,
        };
      }
    },
    updateClientLimit: (
      state,
      { payload }: PayloadAction<Partial<IClientLimit>>,
    ) => {
      if (state.user) {
        state.user.client_limit = {
          ...state.user.client_limit,
          ...payload,
        } as IClientLimit;
      }
    },
  },
});

export const {
  logOut,
  setUser,
  setToken,
  invalidSession,
  setRedirectUrl,
  clearRedirectUrl,
  updateSubscriptionTier,
  updateCompany,
  updateClientLimit,
} = auth.actions;
export default auth.reducer;
