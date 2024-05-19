'use strict'
const log = require('logger')
const swgohClient = require('swgohClient')

module.exports = async(obj = {}, dId)=>{
  try{
    if(obj.allyCode){
      let pObj = await swgohClient('player', {allyCode: obj.allyCode?.toString()})
      if(pObj?.guildId) return { guildId: pObj.guildId}

    }
  }catch(e){
    log.error(e);
  }
}
