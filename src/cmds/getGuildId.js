'use strict'
module.exports = async(obj = {}, dId)=>{
  try{
    if(obj.allyCode){
      const guildId = await Client.post('getGuildId', {id: +obj.allyCode})
      console.log(guildId)
      if(guildId) return {guildId: guildId}
    }
  }catch(e){
    console.error(e);
  }
}
