import { configureStore } from '@reduxjs/toolkit'
import storeReducer from './storySlice'

const store = configureStore({
  reducer: {
    storySlice: storeReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;