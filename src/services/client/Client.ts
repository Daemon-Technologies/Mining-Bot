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
    method: 'POST',
    data: {
      seed: "6041b7d216f9ac7744470bebe72c62382d153b9394ee78a16678e820791cf02401",
      burn_fee_cap: "70000"
    }
  }).then((resp) => {
    console.log(resp);
    return resp
  })
}


export async function stopMining() {
  return request(`${stackNodeAPIURL}/stopMining`, {
    method: 'GET',
  }).then((resp) => {
    console.log(resp);
    return resp
  })
}

export async function getMiningInfo() {
  return request('http://8.210.105.204:23456/minerList', {
    method: 'GET',
    timeout: 300000,
  }).then(data => {
    return { 'data': data };
  });
}
