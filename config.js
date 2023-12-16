module.exports = {
    apps: [
      {
        name: 'server',
        script: 'server.js'
      },
      {
        name: 'json-server',
        script: 'json-server',
        args: '--watch db.json --port 4000'
      }
    ]
  };
  