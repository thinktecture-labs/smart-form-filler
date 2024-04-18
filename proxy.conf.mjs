import 'dotenv/config';

export default {
  "/api/groq/openai/v1": {
    target: "https://api.groq.com",
    pathRewrite: {
      "^/api/groq": "",
    },
    changeOrigin: true,
    bypass(req) {
      req.headers["authorization"] = `Bearer ${process.env.GROQ_API_KEY}`;
    },
  },
  "/api/mistral/v1/chat/completions": {
    target: "https://api.mistral.ai",
    pathRewrite: {
      "^/api/mistral": "",
    },
    changeOrigin: true,
    bypass(req) {
      req.headers["authorization"] = `Bearer ${process.env.MISTRAL_API_KEY}`;
    },
  },
  "/api/openai/v1/audio/transcriptions": {
    target: "https://api.openai.com",
    pathRewrite: {
      "^/api/openai": "",
    },
    changeOrigin: true,
    bypass(req) {
      req.headers["authorization"] = `Bearer ${process.env.OPENAI_API_KEY}`;
    },
  },
};
