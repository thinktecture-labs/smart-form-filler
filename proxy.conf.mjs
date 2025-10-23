import 'dotenv/config';

export default {
  '/api/openai/v1/chat/completions': {
    target:
      'https://mistral-small-3-2-24b-instruct-2506.endpoints.kepler.ai.cloud.ovh.net/api/openai_compat',
    pathRewrite: {
      '^/api/openai': '',
    },
    changeOrigin: true,
    bypass(req) {
      req.headers['authorization'] = `Bearer ${process.env.OVH_API_KEY}`;
    },
  },
  '/api/openai/v1/audio/transcriptions': {
    target: 'https://whisper-large-v3.endpoints.kepler.ai.cloud.ovh.net/api/openai_compat',
    pathRewrite: {
      '^/api/openai': '',
    },
    changeOrigin: true,
    bypass(req) {
      req.headers['authorization'] = `Bearer ${process.env.OVH_API_KEY}`;
    },
  },
};
