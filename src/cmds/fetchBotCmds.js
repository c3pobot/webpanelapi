'use strict'
const log = require('logger')
module.exports = async()=>{
  try{
    let res = []
    const cmds = await mongo.find('botCmds', {}, { TTL: 0})
    if(cmds?.length > 0) res = cmds
    return res
  }catch(e){
    log.error(e)
    return []
  }
}
