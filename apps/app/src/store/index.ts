import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createTransform,
  type PersistConfig,
} from "redux-persist";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/auth";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: unknown) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const rootReducer = combineReducers({
  auth: authSlice,
});

// The access token lives in memory only. Strip it on write, and on read so a
// token persisted by an older version is dropped.
const dropAccessToken = createTransform(
  (state: Record<string, unknown>) => ({ ...state, accessToken: null }),
  (state: Record<string, unknown>) => ({ ...state, accessToken: null }),
  { whitelist: ["auth"] },
);

const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: "kindly-v1",
  storage,
  whitelist: ["auth"],
  transforms: [dropAccessToken],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
