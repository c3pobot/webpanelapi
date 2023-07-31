'use strict'
const express = require('express')
const path = require('path');
const Cmds = require('src/cmds')
const app = express()
app.use(express.json({limit: '100MB'}))
app.use(express.static(path.join(__dirname, 'webapp')));
app.use(express.static(path.join(__dirname, 'public')))
/*
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
*/
app.get('/healthz', (req, res)=>{
  res.json({status: 'health check success'}).status(200)
})
app.post('/api', async(req, res)=>{
  let data, discordId
  if(debugMsg) console.log(req.body)
  if(req?.body?.data) data = req.body.data
  if(req?.body?.dId) discordId = await HP.DecryptId(req.body.dId)
  if(req.body && req.body?.method){
    if(Cmds[req.body.method]){
      res.json(await Cmds[req.body.method](data, discordId))
    }else{
      res.json({message: 'Unknown Coomand : '+req.body.method}).status(400)
    }
  }else{
    res.json({message: 'No method provided'}).status(400)
  }
})

app.get('/*', (req, res)=>{
  res.sendFile(path.join(__dirname, 'webapp', 'index.html'));
})

const server = app.listen(process.env.HEALTH_PORT || 3000, ()=>{
  console.log('WebApi is listening on ', server.address().port)
})
require('./socket')(server)
