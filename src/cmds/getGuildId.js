'use strict'
const log = require('logger')
const swgohClient = require('src/swgohClient')

module.exports = async(obj = {}, dId)=>{
  try{
    if(!obj.allyCode) return
    let pObj = (await mongo.find('guildIdCache', { allyCode: +obj.allyCode }))[0]
    if(!pObj?.guildId) pObj = await swgohClient('player', { allyCode: obj.allyCode?.toString() })
    if(pObj?.guildId) return { guildId: pObj.guildId }
  }catch(e){
    log.error(e);
  }
}
