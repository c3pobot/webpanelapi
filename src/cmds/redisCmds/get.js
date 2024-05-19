'use strict'
const log = require('logger')
const redis = require('redisclient')

module.exports = async(obj = {}, dId)=>{
  try{
    let res = {msg: {openAlert: true, type: 'error', msg: 'Error getting data'}}
    if(obj.key) res = await redis.get(obj.key)
    return res
  }catch(e){
    log.error(e)
    return {msg: {openAlert: true, type: 'error', msg: 'Error getting data'}}
  }
}
