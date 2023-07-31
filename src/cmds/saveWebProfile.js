'use strict'
module.exports = async(obj, discordId)=>{
  try{
    if(obj && discordId) await mongo.set('discordId', {_id: discordId}, {webProfile: obj})
    return {status: "ok"}
  }catch(e){
    console.error(e)
    return {status: "error"}
  }
}
