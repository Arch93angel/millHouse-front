import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


const apiUrl = import.meta.env.VITE_API_URL;

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: 'register/',
        method: 'POST',
        body: userData,
      }),
    }),
    getUsers: builder.query({
      query: () => 'users/',
      transformResponse: (response) => 
        response.map(user => ({
          id: user.id,
          username: user.username,
          displayName: [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username
        }))
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useGetUsersQuery } = authApi
