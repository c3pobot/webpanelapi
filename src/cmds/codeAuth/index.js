'use strict'
const Cmds = {}
Cmds.request_otc = require('./request_otc')
Cmds.code_check = require('./code_check')
module.exports = async(obj = {}, dId)=>{
  try{
    if(obj.method && Cmds[obj.method]) return await Cmds[obj.method](obj, dId)
  }catch(e){
    console.error(e);
  }
}
