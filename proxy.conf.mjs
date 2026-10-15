import 'dotenv/config';

// OVH AI Endpoints, OpenAI-compatible: /v1/chat/completions and /v1/audio/transcriptions
// on one host; the model is selected per request.
export default {
  '/api/openai': {
    target: 'https://oai.endpoints.kepler.ai.cloud.ovh.net',
    pathRewrite: {
      '^/api/openai': '',
    },
    changeOrigin: true,
    bypass(req) {
      req.headers['authorization'] = `Bearer ${process.env.OVH_API_KEY}`;
    },
  },
};
