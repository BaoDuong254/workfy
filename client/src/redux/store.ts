import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import accountReducer from "./slice/accountSlice";
import companyReducer from "./slice/companySlice";
import userReducer from "./slice/userSlice";
import jobReducer from "./slice/jobSlice";
import resumeReducer from "./slice/resumeSlice";
import permissionReducer from "./slice/permissionSlice";
import roleReducer from "./slice/roleSlice";

export const store = configureStore({
  reducer: {
    account: accountReducer,
    company: companyReducer,
    user: userReducer,
    job: jobReducer,
    resume: resumeReducer,
    permission: permissionReducer,
    role: roleReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
