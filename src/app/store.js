import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import { taskApi } from '../services/taskApi'
import { authApi } from '../services/authApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(taskApi.middleware)
      .concat(authApi.middleware),
})