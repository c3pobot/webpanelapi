'use strict'
module.exports = async(allyCode)=>{
  try{
    let pObj = (await mongo.find('playerCache', {allyCode: allyCode}, {guildId: 1}))[0]
    if(!pObj?.guildId){
      pObj = await Client.post('player', {allyCode: allyCode?.toString()})
    }
    return pObj?.guildId
  }catch(e){
    console.error(e);
  }
}
