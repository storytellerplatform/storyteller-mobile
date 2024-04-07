import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { StoryType } from '../types';

type InitialStateType = {
  stories: StoryType[]
};

const initialState: InitialStateType = {
  stories: [
    {
      id: "",
      title: "",
      img: "",
      brife_content: "",
      content: "",
    },
  ]
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
   createStory: (state, action: PayloadAction<StoryType>) => {
      // 添加一个新故事
      state.stories.push(action.payload);
    },
    deleteStory: (state, action: PayloadAction<string>) => {
      // 删除一个特定的故事
      state.stories = state.stories.filter(story => story.id !== action.payload);
    }
  },
})



export const { createStory } = counterSlice.actions

export default counterSlice.reducer