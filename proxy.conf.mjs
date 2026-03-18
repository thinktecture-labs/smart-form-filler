import 'dotenv/config';

export default {
  '/api/openai': {
    target: 'https://api.openai.com',
    pathRewrite: {
      '^/api/openai': '',
    },
    changeOrigin: true,
    bypass(req) {
      req.headers['authorization'] = `Bearer ${process.env.OPENAI_API_KEY}`;
    },
  },
};
