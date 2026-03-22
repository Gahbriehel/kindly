import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  online: true,
};

export const network = createSlice({
  name: "network",
  initialState,
  reducers: {
    setOnline: (state, { payload }: PayloadAction<boolean>) => {
      state.online = payload;
    },
  },
});

export const { setOnline } = network.actions;
export default network.reducer;
