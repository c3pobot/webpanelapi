'use strict'
const log = require('logger')
module.exports = async(obj = {}, dId)=>{
  try{
    if(obj.allyCode){
      const guildId = await Client.post('getGuildId', {id: +obj.allyCode})
      if(guildId) return {guildId: guildId}
    }
  }catch(e){
    log.error(e);
  }
}
