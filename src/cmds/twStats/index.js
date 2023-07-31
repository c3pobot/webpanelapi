'use strict'
const GetGuildId = require('./getGuildId')
module.exports = async(obj = {}, dId)=>{
  try{
    let guildId = obj.guildId, allyCode, twData
    if(!guildId){
      const dObj = (await mongo.find('discordId', {_id: dId}))[0]
      if(dObj?.allyCodes?.length > 0) allyCode = dObj.allyCodes[0]?.allyCode
      if(allyCode) guildId = await GetGuildId(allyCode)
    }
    if(guildId) twData = await mongo.find('twStats', {guildId: guildId})
    if(twData?.length > 0){
      for(let i in twData){
        twData[i].date = new Date(+twData[i].endTime).toLocaleDateString('en-US', {
          timeZone: 'America/New_York',
          month: 'numeric',
          day: 'numeric',
          year: 'numeric'
        })
      }
      return {data: twData}
    }
  }catch(e){
    console.error(e);
  }
}
