const express = require('express');
const path = require('path');
const app = express();


const dir = __dirname.replace('server', '');

app.use(express.static(dir + 'dist'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(dir + 'dist/index.html'));
});

const port = process.env.PORT || 8082;

app.listen(port, function () {
  console.log('Example app listening on port '+port)
})
