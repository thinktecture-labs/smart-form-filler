export default {
  '/api/openai': {
    'target': 'https://api.openai.com/v1',
    'pathRewrite': {
      '^/api/openai': ''
    },
    'changeOrigin': true,
    'bypass': function (req) {
      req.headers['authorization'] = `Bearer ${process.env.OPENAI_API_KEY}`;
    }
  }
};
