import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
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
