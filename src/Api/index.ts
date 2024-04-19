import axios from "axios";

export const request = axios.create({
  // baseURL: 'http://sttdeployspider-production.up.railway.app',
  // baseURL: 'http://danny10132024-olympic.nord:8050',
  // baseURL: 'https://stt-deploy-spider-jxae3suiya-uc.a.run.app',
  baseURL: 'https://humbly-rich-cattle.ngrok-free.app/'
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