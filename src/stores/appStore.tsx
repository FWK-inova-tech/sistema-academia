import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./authStore";
import { alunosSlice } from "./alunosStore";
import { useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    alunos: alunosSlice.reducer
  }
})

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()