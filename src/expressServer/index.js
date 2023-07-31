'use strict'
const log = require('logger')
const path = require('path');
const express = require('express')
const bodyParser = require('body-parser');
const compression = require('compression');
const { createProxyMiddleware } = require('http-proxy-middleware')

const Cmds = require('src/cmds')
const S3_PUBLIC_URL = process.env.S3_PUBLIC_URL
const PORT = process.env.PORT || 3000

const app = express()
let imgProxy
if(S3_PUBLIC_URL) imgProxy = createProxyMiddleware({
  target: path.join(S3_PUBLIC_URL, 'thumbnail'),
  secure: false
})
app.use(bodyParser.json({
  limit: '1000MB',
  verify: (req, res, buf)=>{
    req.rawBody = buf.toString()
  }
}))
app.use(compression())

if(imgProxy) app.use('/thumbnail', imgProxy)

app.use(express.json({limit: '100MB'}))
app.use(express.static(path.join(__dirname, 'webapp')));
/*
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
*/
app.get('/healthz', (req, res)=>{
  res.json({status: 'health check success'}).status(200)
})

app.post('/api', (req, res)=>{
  handelRequest(req, res)
})

app.get('/*', (req, res)=>{
  res.sendFile(path.join(__dirname, 'webapp', 'index.html'));
})

const server = app.listen(PORT, ()=>{
  log.info(`WebApi is listening on ${server.address().port}`)
})
require('./socket')(server)
const handelRequest = async(req, res)=>{
  try{
    let data, response = { message: 'No method provided' }, status = 400
    if(req?.body?.data) data = req.body.data
    let discordId = HP.DecryptId(req?.body?.dId)
    if(req?.body?.method){
      response = {message: 'Unknown Coomand : '+req.body.method}
      if(Cmds[req.body.method]){
        status = 200
        response = await Cmds[req.body.method](data, discordId)
      }
    }
    res.status(status).json(response)
  }catch(e){
    log.error(e)
    res.status(400).json({message: 'No method provided'})
  }
}
