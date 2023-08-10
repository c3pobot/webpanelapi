'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const { CleanAllyCodes } = require('helpers')

module.exports = async(obj = {}, discordId)=>{
  try{
    let res = []
    const dObj = (await mongo.find('discordId',{_id: discordId}))[0]
    if(dObj?.allyCodes){
      await CleanAllyCodes(dObj.allyCodes)
      res = dObj.allyCodes
    }
    return res
  }catch(e){
    log.error(e);
    return []
  }
}
