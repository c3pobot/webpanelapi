'use strict'
const RedisWrapper = require('rediswrapper')
global.apiReady = 0
global.debugMsg = +process.env.DEBUG || 0
global.gameData = {}
global.gameVersion = ''

//global.mongo = require('./mongo')

global.mongo = require('mongoapiclient')

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
