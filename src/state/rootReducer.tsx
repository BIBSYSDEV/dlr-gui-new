import { combineReducers } from '@reduxjs/toolkit';
import { reducer as userReducer } from './userSlice';
import { reducer as resourceReducer } from './resourceSlice';

const rootReducer = combineReducers({ user: userReducer, resource: resourceReducer });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
