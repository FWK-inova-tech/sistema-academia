import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userToken = localStorage.getItem('userToken') ?? null as string | null

const initialState = {
  // true durante o desenvolvimento
  authenticated: true,
  token: userToken,
  status: 'none' as 'loading' | 'succeeded' | 'failed' | 'none',
  error: null as string | null
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string, password: string }, thunkAPI) => {
    try{
      const response = await axios.post('/login', credentials);
      const token = response.data.token
      localStorage.setItem('userToken', token)

    }catch(error){
      const message = error as Error
      return thunkAPI.rejectWithValue( message.message || "Erro ao tentar fazer a requisição do login")
    }
  } 
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.authenticated = false
      state.token = null
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state)=> {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state)=>{
        state.status = 'succeeded'
      })
      .addCase(loginUser.rejected, (state)=>{
        state.status = 'failed'
      })
  }
})