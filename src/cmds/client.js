'use strict'
module.exports = async(obj = {}, discordId)=>{
  try{
    const dObj = (await mongo.find('discordId', {_id: discordId}))[0]
    if(dObj?.allyCodes?.length > 0){
      if(obj.query && obj.payload) return await Client.post(obj.query, obj.payload)
    }else{
      return ({msg: {type: 'error', msg: 'Your discord account is not linked to the bot'}})
    }
  }catch(e){
    console.error(e);
    return {msg: {type: 'error', msg: 'Error getting data'}}
  }
}
