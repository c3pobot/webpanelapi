'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const { CleanAllyCodes } = require('src/helpers')

module.exports = async(obj = {}, discordId)=>{
  try{
    let dObj = (await mongo.find('discordId',{_id: discordId}))[0]
    if(!dObj?.allyCodes || dObj?.allyCodes?.length == 0) return []
    await CleanAllyCodes(dObj.allyCodes)
    return dObj.allyCodes
  }catch(e){
    log.error(e);
    return []
  }
}
