'use strict'
const log = require('logger')
const path = require('path');
const express = require('express')
const bodyParser = require('body-parser');
const compression = require('compression');
const { createProxyMiddleware } = require('http-proxy-middleware')

const PORT = process.env.PORT || 3000
const Cmds = require('../cmds')

const { DecryptId } = require('helpers')

const app = express()
const ASSET_URL = process.env.ASSET_URL
let imgProxy
if(ASSET_URL) imgProxy = createProxyMiddleware({
  target: ASSET_URL,
  secure: false,
  logLevel: 'debug'
})
app.use(bodyParser.json({
  limit: '1000MB',
  verify: (req, res, buf)=>{
    req.rawBody = buf.toString()
  }
}))
app.use(compression())

app.use(express.json({limit: '100MB'}));
if(imgProxy){
  app.use('/asset', imgProxy)
  app.use('/portrait', imgProxy)
  app.use('/thumbnail', imgProxy)
}
app.get('/healthz', (req, res)=>{
  res.json({status: 'health check success'}).status(200)
})

app.post('/api', (req, res)=>{
  handelRequest(req, res)
})

const server = app.listen(PORT, ()=>{
  log.info(`WebApi is listening on ${server.address().port}`)
})
require('./socket')(server)
const handelRequest = async(req, res)=>{
  try{
    let data, response = { message: 'No method provided' }, status = 400
    if(req?.body?.data) data = req.body.data
    let discordId = DecryptId(req?.body?.dId)
    if(req?.body?.method){
      response = {message: 'Unknown Comand : '+req.body.method}
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
