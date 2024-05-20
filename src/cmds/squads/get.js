'use strict'
const log = require('logger')
const mongo = require('mongoclient')

module.exports = async(obj = {}, dId)=>{
  if(!obj.id || !dId) return ({msg: {type:'error', msg: 'Error occured'}})
  let id = obj.id
  if(id === 'player') id = dId
  let res = { squads: [], msg:{ openAlert: true, type:'info', msg: 'No '+obj.type+' squads saved' } }
  let tempObj = await mongo.find('squadTemplate', { id: id }, {TTL: 0})
  if(tempObj?.length > 0){
    res.squads = tempObj
    res.msg = { type:'success', msg: 'Squads pulled successful' }
  }
  return res
}
