import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getToken, login, validateToken } from "../service/fetchAPI";
import { toast } from "react-toastify";

const initialToken = localStorage.getItem('userToken') ?? null as string | null

interface ICredentials {
  email: string;
  password: string;
}

const initialState = {
  authenticated: false as boolean | 'idle',  // Sempre começar como false até validar o token
  token: initialToken,
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message = error as Error
      toast.error(error.status == 400 ? "Credenciais erradas" : "Erro ao tentar fazer login")
      return thunkAPI.rejectWithValue(message.message || "Erro ao tentar fazer a requisição do login")
    }
  }
)

export const checkToken = createAsyncThunk<void, void, { rejectValue: string }>("auth/checkToken",
  async (_, thunkAPI) => {
    try {
      const token = getToken()
      await validateToken(token)
    } catch (err: any) {
      const message = err as Error
      return thunkAPI.rejectWithValue(message.message || "Erro ao validar token")

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
      // loginUser
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

      // checkToken
      .addCase(checkToken.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkToken.rejected, (state, action) => {
        state.status = 'failed';
        state.authenticated = false
        state.token = null;
        state.error = action.payload || "Token inválido"
      })
      .addCase(checkToken.fulfilled, (state) => {
        state.status = 'succeeded';
        state.authenticated = true;
      })



  }
})

export const { logout, setLoading, checkExistingToken } = authSlice.actions

