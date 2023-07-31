'use strict'
module.exports = async(obj = {})=>{
  try{
    let res = []
    if(obj.collection) res = await mongo.find(obj.collection, obj.query || {}, obj.projection || null)
    return res
  }catch(e){
    console.error(e)
    return []
  }
}
