import { createSlice } from '@reduxjs/toolkit';

let initialState = { id: '', name: '' };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => action.payload,
  },
});

export const reducer = userSlice.reducer;
export const { setUser } = userSlice.actions;
