'use strict'
module.exports = async(obj={}, dId)=>{
  try{
    if(obj.guildId && obj.collection?.startsWith('tb') && obj.tbId){
      const tempObj = (await mongo.find(obj.collection, {_id: obj.guildId}))[0]
      if(tempObj && tempObj[obj.tbId]) return tempObj[obj.tbId]
    }
  }catch(e){
    console.error(e);
  }
}
