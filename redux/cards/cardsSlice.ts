import { createSlice } from "@reduxjs/toolkit";

const cardsSlice = createSlice({
  name: "cards",
  initialState: {
    refillRequests: [],
    checkRefillEligibity: [],
  },
  reducers: {
  },
});

export const { setRefillRequests, setRefillEligibity } = cardsSlice.actions;

export default cardsSlice.reducer;
