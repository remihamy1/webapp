const express = require('express');
const path = require('path');
const jsonServer = require('json-server');
const { createProxyMiddleware } = require('http-proxy-middleware');
const apiPort = 4000;


const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.static(path.join(__dirname, '/')));

const jsonServerInstance = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
jsonServerInstance.use(middlewares);
jsonServerInstance.use(router);
jsonServerInstance.listen(apiPort, () => {
    console.log(`JSON Server is running on http://localhost:${apiPort}`);
});
app.use('/', createProxyMiddleware({ target: `http://localhost:${apiPort}`, changeOrigin: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
