'use strict'
const GetUnits = async()=>{
  try{
    let units = await mongo.find('units', {}, {portrait: 0, thumbnail: 0})
    let thumbnails = await mongo.find('thumbnail', {})
    if(units?.length > 0 && thumbnails?.length > 0){
      for(let i in units){
        const img = thumbnails.find(x=>x._id === units[i].baseId)
        if(img?.img) units[i].thumbnail = img.img
      }
    }
    return units
  }catch(e){
    console.error(e);
  }
}
module.exports = async(obj = {}, dId)=>{
  const dObj = (await mongo.find('discordId', {_id: dId}))[0]
  if(dObj){
    return await GetUnits()
  }else{
    return({msg: { type: 'error', msg: 'Your discrod account is not linked to the bot'}})
  }
}
