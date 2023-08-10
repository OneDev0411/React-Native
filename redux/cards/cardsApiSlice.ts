import { apiSlice } from "../api/apiSlice";
export const cardsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    requestRefillCards: builder.mutation({
      query: (data) => ({
        url: "/cards/requestRefillCards",
        method: "POST",
        body: { ...data },
      }),
    }),
    getRefillRequests: builder.query({
      
      query: () => ({
        url: `/cards/refillRequests?limit=100`,
        method: "GET",
      }),
    }),
    checkRefillEligibity: builder.query({
      query: () => ({
        url: `/cards/checkRefillEligibity`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useRequestRefillCardsMutation,
  useGetRefillRequestsQuery,
  useCheckRefillEligibityQuery,
} = cardsApiSlice;
