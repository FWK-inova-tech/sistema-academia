import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { login } from "../service/fetchAPI";
import { toast } from "react-toastify";

const userToken = localStorage.getItem('userToken') ?? null as string | null

interface ICredentials {
  email: string;
  password: string;
}

const initialState = {
  authenticated: false, // Sempre começar como false até validar o token
  token: userToken,
  status: 'none' as 'loading' | 'succeeded' | 'failed' | 'none',
  error: null as string | null,
  loading: false as false | string
}

export const loginUser = createAsyncThunk<string, ICredentials, { rejectValue: string }>("auth/login",
  async (credentials, thunkAPI) => {
    try {
      const res = await login(credentials)
      const token = res
      localStorage.setItem('userToken', token)
      return token

    } catch (error: any) {
      const message = error as Error
      toast.error(error.status == 400 ? "Credenciais erradas" : "Erro ao tentar fazer login")
      return thunkAPI.rejectWithValue(message.message || "Erro ao tentar fazer a requisição do login")
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
      localStorage.removeItem('userToken')
    },
    setLoading: (state, action: PayloadAction<false | string>) => {
      state.loading = action.payload
    },
    checkExistingToken: (state) => {
      const token = localStorage.getItem('userToken')
      if (token) {
        state.authenticated = true
        state.token = token
      } else {
        state.authenticated = false
        state.token = null
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.authenticated = true
        state.token = action.payload
        state.status = 'succeeded'
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = 'failed'
      })
  }
})

export const { logout, setLoading, checkExistingToken } = authSlice.actions

