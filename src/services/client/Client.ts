import { request } from 'umi';

// interact with Blockstack node API


export async function getNodeStatus(){
  return request('http://127.0.0.1:5000/getNodeStatus', {
    method: 'GET',
  }).then((resp) => {
    console.log(resp);
    return resp
  })
}

export async function startMining(){

  return request('http://127.0.0.1:5000/startMining', {
    method: 'GET',
  }).then((resp) => {
    console.log(resp);
    if (resp === "success")
      return true
    return false
  })
}


export async function stopMining(){
  return request('http://127.0.0.1:5000/stopMining', {
    method: 'GET',
  }).then((resp) => {
    console.log(resp);
    if (resp === "success")
      return true
    return false
  })
}
