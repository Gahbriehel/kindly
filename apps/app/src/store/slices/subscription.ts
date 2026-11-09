import { createSlice } from "@reduxjs/toolkit";

interface SubscriptionUiState {
  expiredModalOpen: boolean;
}

const initialState: SubscriptionUiState = { expiredModalOpen: false };

// UI-only state; deliberately not persisted (see the store's whitelist).
export const subscriptionUi = createSlice({
  name: "subscriptionUi",
  initialState,
  reducers: {
    openExpiredModal: (state) => {
      state.expiredModalOpen = true;
    },
    closeExpiredModal: (state) => {
      state.expiredModalOpen = false;
    },
  },
});

export const { openExpiredModal, closeExpiredModal } = subscriptionUi.actions;
export default subscriptionUi.reducer;
