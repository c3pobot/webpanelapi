'use strict'
const log = require('logger')
module.exports = async(obj = {}, discordId)=>{
  try{
    let res = []
    const dObj = (await mongo.find('discordId',{_id: discordId}))[0]
    if(dObj?.allyCodes){
      await HP.CleanAllyCodes(dObj.allyCodes)
      res = dObj.allyCodes
    }
    return res
  }catch(e){
    log.error(e);
    return []
  }
}
