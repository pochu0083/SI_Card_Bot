const http = require('http');
const { exec } = require('child_process');

http.createServer((req, res) => {
  if (req.headers['x-github-event'] === 'push' && req.body.ref === 'refs/heads/main') {
    exec('git pull origin main && pm2 restart index.js', (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        res.statusCode = 500;
        res.end('Error pulling code');
      } else {
        res.statusCode = 200;
        res.end('Code pulled and app restarted');
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
}).listen(3000);
