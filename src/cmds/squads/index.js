'use strict'
const log = require('logger')
const mongo = require('mongoclient')

const Cmds = {}
Cmds.get = require('./get')
Cmds.save = require('./save')
module.exports = async(obj = {}, discordId)=>{
  let dObj = (await mongo.find('discordId', {_id: discordId}))[0]
  if(!dObj) return({msg: {openAlert: true, type: 'error', msg: 'Your discrod account is not linked to the bot'}})
  if(dObj && Cmds[obj.method]){
    return await Cmds[obj.method](obj.data, discordId)
  }else{
    return({msg: {openAlert: true, type: 'error', msg: 'Erroring with squad request'}})
  }
}
