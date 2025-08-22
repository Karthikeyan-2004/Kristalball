// Absolute minimal test - no external dependencies
const http = require('http');
const url = require('url');

const handler = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/health') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: 'Minimal serverless function working!',
        timestamp: new Date().toISOString(),
        path: parsedUrl.pathname,
        method: req.method
      }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({
        success: false,
        message: 'Not found',
        path: parsedUrl.pathname
      }));
    }
  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }));
  }
};

module.exports = handler;
