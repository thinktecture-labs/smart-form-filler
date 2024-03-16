export default {
  '/api/openai': {
    'target': 'https://api.groq.com/openai/v1', // Using Groq API here - it is THE FASTEST to date
    'pathRewrite': {
      '^/api/inference': ''
    },
    'changeOrigin': true,
    'bypass': function (req) {
      req.headers['authorization'] = `Bearer ${process.env.OPENAI_API_KEY}`;
    }
  }
};
