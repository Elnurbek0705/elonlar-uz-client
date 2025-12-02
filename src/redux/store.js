import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import elonReducer from "./elonSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    elon: elonReducer,
  },
});
