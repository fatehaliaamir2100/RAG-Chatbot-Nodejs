const express = require('express');
const app = express();
const port = 3000;
const router = require('./routers/router');

app.use(router); //using the routers added

app.get('/', (req, res) => { //basic endpoint added to check server status
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});