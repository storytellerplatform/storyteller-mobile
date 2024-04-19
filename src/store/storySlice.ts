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

export const storySlice = createSlice({
  name: 'story',
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



export const { createStory } = storySlice.actions

export default storySlice.reducer