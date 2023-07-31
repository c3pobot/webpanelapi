'use strict'
const Cmds = {}
Cmds.get = require('./get')
module.exports = async(obj = {}, discordId)=>{
  try{
    const dObj = (await mongo.find('discordId', {_id: discordId}))[0]
    if(dObj){
      if(obj.method && Cmds[obj.method]) return await Cmds[obj.method](obj, discordId)
    }else{
      return({msg: {openAlert: true, type: 'error', msg: 'Your discrod account is not linked to the bot'}})
    }
  }catch(e){
    console.error(e)
    return {msg: {openAlert: true, type: 'error', msg: 'Error getting data'}}
  }
}
