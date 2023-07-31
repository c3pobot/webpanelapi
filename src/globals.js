'use strict'
const { RedisWrapper, SvcSocket, SocketWrapper, MongoWrapper } = require('dbwrapper')
global.apiReady = 0
global.debugMsg = +process.env.DEBUG || 0
global.gameData = {}
global.gameVersion = ''
global.BotSocket = new SocketWrapper({
  id: process.env.SHARD_NUM,
  service: 'websocket',
  type: 'client',
  url: process.env.SOCKET_SVC_URI
})
//global.mongo = require('./mongo')

global.mongo = new MongoWrapper({
  url: 'mongodb://'+process.env.MONGO_USER+':'+process.env.MONGO_PASS+'@'+process.env.MONGO_HOST+'/',
  authDb: process.env.MONGO_AUTH_DB,
  appDb: process.env.MONGO_DB,
  repSet: process.env.MONGO_REPSET
})

global.redis = new RedisWrapper({
  host: process.env.REDIS_SERVER,
  port: process.env.REDIS_PORT,
  passwd: process.env.REDIS_PASS
})
global.metaConfig = []
global.modDefData = []
global.HP = require('./helpers')
global.MSG = require('discordmsg')
global.Client = require('stub')
