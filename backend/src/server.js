// 1. Load environment variables from .env file into process.env
const dotenv = require('dotenv');
dotenv.config();

// 2. Import the Express application configuration
const app = require('./app');

// 3. Define the network port (defaults to 5000 if PORT is not specified in .env)
const PORT = process.env.PORT || 5000;

// 4. Start the HTTP server listener
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  XSHostel REST API Server is running!               `);
  console.log(`  Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Port        : ${PORT}`);
  console.log(`  Health API  : http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
