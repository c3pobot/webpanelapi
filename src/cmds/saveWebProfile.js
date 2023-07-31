'use strict'
const log = require('logger')
module.exports = async(obj, discordId)=>{
  try{
    if(obj && discordId) await mongo.set('discordId', {_id: discordId}, {webProfile: obj})
    return {status: "ok"}
  }catch(e){
    log.error(e)
    return {status: "error"}
  }
}
