import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { generateMusicRequest } from "../types/api";

export const modelRequest = axios.create({
  baseURL: 'https://humbly-rich-cattle.ngrok-free.app/'
});

export const moodModelRequest = axios.create({
  baseURL: 'https://stt-deploy-mood-jxae3suiya-uc.a.run.app/',
});

export const climbRequest = axios.create({
  baseURL: 'https://stt-deploy-spider-jxae3suiya-uc.a.run.app/',
});

const WENKU8_URL = 'https://www.wenku8.net/modules/article/reader.php';

export const testApi = async () => modelRequest.get('/');

export const testApi2 = async (TestData: string) => moodModelRequest.post('/mood_analyze', { TestData }
);

export const createCatelog = async (url: string, config?: AxiosRequestConfig) => modelRequest.post(
  '/Novel_catalog', { url }, config
);

export const createCatelogContent = async (url: string) => modelRequest.post(
  '/Novel_page_content', { url }
);

export const createMusic = async (texts: string, duration: number) => modelRequest.post(
  '/music_generate', { texts, duration },
  { responseType: 'arraybuffer' }
);

export const generateMusic = async (request: generateMusicRequest, config?: AxiosRequestConfig ) => modelRequest.post(
  '/music_generate', request, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    },
    ...config
  }
);

export const createTTS = async (text: string, gender: boolean) => modelRequest.post(
  '/TTS', { text, gender }
);