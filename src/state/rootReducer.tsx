import { combineReducers } from '@reduxjs/toolkit';
import { reducer as userReducer } from './userSlice';

const rootReducer = combineReducers({ user: userReducer });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
