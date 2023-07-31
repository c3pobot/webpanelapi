'use strict'
const log = require('logger')
module.exports = async(obj={}, dId)=>{
  try{
    if(obj.guildId && obj.collection?.startsWith('tb') && obj.data > 0 && obj.allyCode, obj.tbId){
      let memberLevel = await Client.post('getGuildMemberLevel', {allyCode: obj.allyCode})
      if(memberLevel?.level > 2){
        const dObj = (await mongo.find('discordId', {_id: dId}))[0]
        if(dObj?.allyCodes.filter(x=>x.allyCode === +obj.allyCode).length > 0){
          await mongo.set(obj.collection, {_id: obj.guildId}, {[obj.tbId]: {id: obj.tbId, data: obj.data, savedBy: obj.allyCode}})
          const tempObj = (await mongo.find(obj.collection, {_id: obj.guildId}))[0]
          if(tempObj && tempObj[obj.tbId]) return tempObj[obj.tbId]
        }
      }else{
        return {type: 'error', msg: 'Only guild leader or officers can save tb platoon configuration'}
      }
    }
  }catch(e){
    log.error(e);
  }
}
