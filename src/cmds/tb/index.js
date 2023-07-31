'use strict'
const Cmds = {}
Cmds.get = require('./get')
Cmds.save = require('./save')
module.exports = async(obj = {}, dId)=>{
  try{
    if(obj.method && Cmds[obj.method]) return await Cmds[obj.method](obj, dId)
  }catch(e){
    console.error(e);
  }
}
