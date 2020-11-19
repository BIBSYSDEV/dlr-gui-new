import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Resource } from '../types/resource.types';

const resourceSlice = createSlice({
  name: 'resource',
  initialState: { identifier: '' },
  reducers: {
    setResource: (state, action: PayloadAction<Resource>) => action.payload,
  },
});

export const reducer = resourceSlice.reducer;
export const { setResource } = resourceSlice.actions;
