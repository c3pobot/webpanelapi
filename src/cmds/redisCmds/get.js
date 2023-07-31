'use strict'
module.exports = async(obj = {}, dId)=>{
  try{
    let res = {msg: {openAlert: true, type: 'error', msg: 'Error getting data'}}
    if(obj.key) res = await redis.get(obj.key)
    return res
  }catch(e){
    console.error(e)
    return {msg: {openAlert: true, type: 'error', msg: 'Error getting data'}}
  }
}
