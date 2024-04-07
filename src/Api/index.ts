import axios from "axios";
import { StoryType } from "../types";

export const request = axios.create({
  // baseURL: 'http://sttdeployspider-production.up.railway.app',
  baseURL: 'http://danny10132024-olympic.nord:8050',
  // baseURL: 'https://stt-deploy-spider-test-nxw3hfm4da-uc.a.run.app',
});

export const testApi = async () => request.get('/');

export const testApi2 = async (TestData: string) => request.post('/mood_analyze', { TestData });

export const createCatelog = async (url: string) => request.post(
  '/Novel_catalog', { url }
);

export const createCatelogContent = async (url: string) => request.post(
  '/Novel_catalog_content', { url }
);

export const createMusic = async (texts: string, duration: number) => request.post(
  '/music_generate', { texts, duration }, {
    responseType: 'arraybuffer',
  }
);