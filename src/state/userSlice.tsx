import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { emptyUser, User } from '../types/user.types';

const userSlice = createSlice({
  name: 'user',
  initialState: emptyUser,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => action.payload,
  },
});

export const reducer = userSlice.reducer;
export const { setUser } = userSlice.actions;
