import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ISignUpResponse, IUserData } from "../../models/auth";

interface authState {
  token: string | null;
  user: IUserData | ISignUpResponse["newUser"][number] | null;
  invalidSession: boolean;
  redirectUrl: string | null;
}

const initialState: authState = {
  token: null,
  user: null,
  invalidSession: false,
  redirectUrl: null,
};

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      state.token = null;
      state.user = null;
      state.invalidSession = false;
      state.redirectUrl = null;
    },
    setToken: (state, { payload }: PayloadAction<string>) => {
      state.token = payload;
    },
    setUser: (
      state,
      {
        payload,
      }: PayloadAction<IUserData | ISignUpResponse["newUser"][number]>,
    ) => {
      state.user = payload;
    },
    clearToken: (state) => {
      state.token = null;
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
  clearToken,
  invalidSession,
  setRedirectUrl,
  clearRedirectUrl,
} = auth.actions;
export default auth.reducer;
