import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/common/types.ts';

type AuthenticatedUser = Omit<User, 'id'>;

interface AuthState {
  user?: AuthenticatedUser;
}

const initialState: AuthState = {
  // demo purpose only
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthenticatedUser>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload)); // demo purpose only
    },
    logout: (state) => {
      state.user = undefined;
      localStorage.removeItem('user'); // demo purpose only
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
