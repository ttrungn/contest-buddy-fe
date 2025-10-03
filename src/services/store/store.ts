import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/users/userSlice";
import communityReducer from "../features/community/communitySlice";
import organizerReducer from "../features/organizer/organizerSlice";
import competitionsReducer from "../features/competitions/competitionsSlice";
import plansReducer from "../features/plans/plansSlice";

const presistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

// Create a hook for using TypedUseSelectorHook
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  community: communityReducer,
  organizer: organizerReducer,
  competitions: competitionsReducer,
  plans: plansReducer,
});

const persistedReducer = persistReducer(presistConfig, rootReducer);

// Combine all reducers
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Persist the store
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export hooks for using TypedUseSelectorHook
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
