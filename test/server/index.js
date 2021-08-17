const express = require('express')
const http = require('http')
const https = require('https')
const path = require('path')
const fs = require('fs')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express();
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')
async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)
  const { host, port } = config.dev?nuxt.options.env.server:nuxt.options.pro.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // if(process.env.NODE_ENV === 'development') {
  //   const privateKey = fs.readFileSync(path.resolve(__dirname,'cert.key'),'utf8');
  //   const certificate = fs.readFileSync(path.resolve(__dirname,'cert.crt'), 'utf8');
  //   const credentials = {
  //     key: privateKey,
  //     cert: certificate,
  //   };
  //   const httpsServer = https.createServer(credentials, app);
  //   // Listen the server
  //   httpsServer.listen(port, host)
  //   consola.ready({
  //     message: `Server listening on https://${host}:${port}`,
  //     badge: true
  //   })
  // }else{
  //   // Listen the server
  //   app.listen(port, host)
  //   consola.ready({
  //     message: `Server listening on http://${host}:${port}`,
  //     badge: true
  //   })
  // }
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })

}
start()
