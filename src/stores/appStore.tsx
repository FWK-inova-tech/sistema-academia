import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./authStore";
import { alunosSlice } from "./alunosStore";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    alunos: alunosSlice.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch