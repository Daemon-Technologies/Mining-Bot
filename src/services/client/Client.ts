import { request } from 'umi';

// interact with Blockstack node API


export async function getNodeStatus(){
  return "Node Running Status"
}

export async function startMining(){
  return "Start Mining"
}

export async function stopMining(){
  return "Shut Down Mining Node"
}
