const express = require('express');
const path = require('path');
const jsonServer = require('json-server');
const { createProxyMiddleware } = require('http-proxy-middleware');
const apiPort = 4000;
const host = process.env.HOST || 'http://localhost'

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
    console.log(`JSON Server is running on ${host}:${apiPort}`);
});
app.use('/', createProxyMiddleware({ target: `${host}:${apiPort}`, changeOrigin: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on ${host}:${port}`);
});