'use strict'
const log = require('logger')
const mongo = require('mongoclient')

module.exports = async()=>{
  try{
    let res = []
    let cmds = await mongo.find('botCmds', {}, { TTL: 0})
    if(cmds?.length > 0) res = cmds
    return res
  }catch(e){
    log.error(e)
    return []
  }
}
