export default {
  '/api/inference': {
    'target': 'https://api.openai.com/v1', // https://api.groq.com/openai/v1
    'pathRewrite': {
      '^/api/inference': ''
    },
    'changeOrigin': true,
    'bypass': function (req) {
      req.headers['authorization'] = `Bearer ${process.env.OPENAI_API_KEY}`;
    }
  }
};
