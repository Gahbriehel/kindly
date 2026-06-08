import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUserData } from "../../models/auth";

interface authState {
  user: IUserData | null;
  accessToken: string | null;
  refreshToken: string | null;
  invalidSession: boolean;
  redirectUrl: string | null;
}

const initialState: authState = {
  user: null,
  accessToken: null,
  refreshToken: null,
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
      state.refreshToken = null;
      state.invalidSession = false;
      state.redirectUrl = null;
    },
    setUser: (
      state,
      {
        payload,
      }: PayloadAction<
        | IUserData
        | {
            user: IUserData;
            tokens: { accessToken: string; refreshToken: string };
          }
      >,
    ) => {
      if ("user" in payload) {
        state.user = payload.user;
        state.accessToken = payload.tokens.accessToken;
        state.refreshToken = payload.tokens.refreshToken;
      } else {
        state.user = payload;
      }
    },
    setToken: (state, { payload }: PayloadAction<string>) => {
      state.accessToken = payload;
    },
    setTokens: (
      state,
      { payload }: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) => {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
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
  },
});

export const {
  logOut,
  setUser,
  setToken,
  setTokens,
  invalidSession,
  setRedirectUrl,
  clearRedirectUrl,
} = auth.actions;
export default auth.reducer;
