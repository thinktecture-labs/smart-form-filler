import 'dotenv/config';

export default {
  "/api/inference": {
    target: "https://api.groq.com/openai/v1", // https://api.openai.com/v1
    pathRewrite: {
      "^/api/inference": "",
    },
    changeOrigin: true,
    bypass: function (req) {
      req.headers["authorization"] = `Bearer ${process.env.GROQ_API_KEY}`;
    },
  },
  "/api/transcription": {
    target: "https://api.openai.com/v1/audio/transcriptions",
    pathRewrite: {
      "^/api/whisper": "",
    },
    changeOrigin: true,
    bypass: function (req) {
      req.headers["authorization"] = `Bearer ${process.env.OPENAI_API_KEY}`;
    },
  },
};
