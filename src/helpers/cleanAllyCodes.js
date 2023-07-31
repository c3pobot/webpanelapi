'use strict'
module.exports = (array = [])=>{
  for(let i in array){
    delete array[i].uId
    delete array[i].playerId
  }
}
