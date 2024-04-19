import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type InitialStateType = {
  themeMode: 'dark' | 'light' | null;
};

const initialState: InitialStateType = {
  themeMode: 'light',
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state, action) => {
      if (state.themeMode === 'dark') {
        state.themeMode = 'light';
      } else if (state.themeMode === 'light') {
        state.themeMode = 'dark';
      } else {
        state.themeMode = 'light';
      }
    }
  },
})



export const { toggleTheme } = themeSlice.actions

export default themeSlice.reducer