require('dotenv').config();
const app  = require('./app');
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log('');
  console.log('  ✅  AI Audit Gate — Backend running');
  console.log(`  🌐  http://localhost:${port}`);
  console.log(`  📋  API docs: http://localhost:${port}/api/health`);
  console.log('');
});
