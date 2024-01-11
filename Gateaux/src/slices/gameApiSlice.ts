import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const gameApiSlice = createApi({
  reducerPath: "gameApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["game"],
  
  endpoints: (builder) => ({
    getPastries: builder.query({
      query: () => "/game/pastries",
      providesTags: ["game"],
    }),
   
    updatePastries: builder.mutation({
      query: (decrementBy: object) => ({
        url: "/game/win-pastries", 
        method: "PUT", 
        body: { decrementBy }, 
      })
    }),

    addPastries: builder.mutation({
      query: (addPastries: object) => ({
        url: "/api/pastrie", 
        method: "POST", 
        body:  addPastries , 
      }),
      invalidatesTags: [{ type: "game", id: "LIST" }],
    }),

      deletePastries: builder.mutation({
        query: (deletePastriesId) => ({
          url: `/api/pastrie/${deletePastriesId}`, 
          method: "DELETE", 
          body: { deletePastriesId }, 
        }),
        invalidatesTags: [{ type: "game", id: "LIST" }],
      }),
    }),
  });


export const { useGetPastriesQuery, useUpdatePastriesMutation, useDeletePastriesMutation,useAddPastriesMutation } = gameApiSlice;

