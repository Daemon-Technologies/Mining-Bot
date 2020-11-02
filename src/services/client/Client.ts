import { request } from 'umi';
const { stackNodeAPIURL } = require('@/services/constants')

export async function getNodeStatus() {
  return request(`${stackNodeAPIURL}/getNodeStatus`, {
    method: 'GET',
  }).then((resp) => {
    console.log(resp);
    return resp
  })
}

export async function startMining() {

  return request(`${stackNodeAPIURL}/startMining`, {
    method: 'GET',
  }).then((resp) => {
    console.log(resp);
    if (resp === "success")
      return true
    return false
  })
}


export async function stopMining() {
  return request(`${stackNodeAPIURL}/stopMining`, {
    method: 'GET',
  }).then((resp) => {
    console.log(resp);
    if (resp === "success")
      return true
    return false
  })
}

export async function getMiningInfo() {
  return request('http://8.210.105.204:23456/minerList', {
    method: 'GET',
    timeout: 300000,
  });
}
