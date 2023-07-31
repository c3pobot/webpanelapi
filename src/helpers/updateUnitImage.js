'use strict'
const fs = require('fs')
const path = require('path')

module.exports = async(obj = {})=>{
  try{
    if(obj?.baseId && obj.type){
      const unit = (await mongo.find(obj.type, { _id: obj.baseId}))[0]
      if(unit?.img){
        console.log('Saving '+unit.imgName+' '+obj.type+' to disk')
        await fs.writeFile(path.join(__dirname.replace('/helpers', '/expressServer'), 'webapp', obj.type, unit.imgName+'.png'), unit?.img, 'base64', function(err){
          if(err) console.error(err)
        })
      }
    }
  }catch(e){
    console.error(e);
  }
}
