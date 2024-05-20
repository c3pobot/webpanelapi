'use strict'
const log = require('logger')
const mongo = require('mongoclient')

module.exports = async()=>{
  let res = []
  let cmds = await mongo.find('botCmds', {}, { TTL: 0 })
  if(cmds?.length > 0) res = cmds
  return res
}
