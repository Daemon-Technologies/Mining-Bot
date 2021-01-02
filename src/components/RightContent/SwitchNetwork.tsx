import React, {useState, useEffect} from 'react';

import { Menu, Dropdown, Button, message, Avatar, Tag } from 'antd';
import styles from './index.less';
import { networkState, ConnectProps, Loading, connect} from 'umi';
import logo from '@/assets/stacks_icon.png';
import {switchPage, getCurrentNetwork, getNetworkFromStorage} from '@/utils/utils'
import access from '@/access'

interface PageProps extends ConnectProps {
    index: networkState;
}
  
const SwitchNetwork: React.FC<PageProps> = ({ network, dispatch }) => {
    const [networkName, setNetworkName] = useState("Krypton")
    //console.log(network, dispatch)
/*
    const changeNetwork = (newNetwork:any) => {
        dispatch({
            type: 'network/save',
            payload: {
                network: newNetwork
            }
        })
    }
*/
    const changeNetworkDAO = (newNetwork:any) => {
        localStorage.setItem("network", newNetwork)
    }

    /*
    useEffect((()=>{
        let networkDAO = localStorage.getItem("network");
        if (networkDAO == undefined){
            localStorage.setItem("network", network.network)
            setNetworkName(network.network)
        }
        else if(networkDAO!=network.network){
            changeNetwork(networkDAO)
            setNetworkName(networkDAO)
        }
        else setNetworkName(network.network)
        
    }), [])
    */
    /*
    useEffect(()=>{
        dispatch({
            type: 'network/save',
            payload: {
                network: "xenon"
            }
        })
    } ,[])
    */

   useEffect(()=>{
        switch(getNetworkFromStorage()){
            case "Krypton": setNetworkName("Krypton");  break;
            case "Xenon": setNetworkName("Xenon"); break;
        }
   } ,[])

    
    const onClick = ({ key }) => {
        switch (key){
            case "Krypton": setNetworkName("Krypton")
                            message.info(`Switch to Krypton network`);
                            changeNetworkDAO("Krypton")
                            switchPage('Krypton')
                            break;
            case "Xenon": setNetworkName("Xenon")
                          message.info(`Switch to Xenon network`);
                          changeNetworkDAO("Xenon")
                          switchPage('Xenon')
                          break;
        }
        
    };
    
    const menu = (
        <Menu onClick={onClick} style={{fontSize:12}}>
          <Menu.Item key="Krypton" >
              Krypton
          </Menu.Item>
          <Menu.Item key="Xenon">
              Xenon
          </Menu.Item>
          <Menu.Item key="Mainnet" disabled>
              Mainnet
          </Menu.Item>
        </Menu>
    );

    

    return (<div> 
                <Dropdown overlay={menu} placement="bottomRight" >
                    <Button type="text"  size="large" style={{color: "white"}}>
                        <img alt="logo" style={{ height: 18, marginRight: 10}} src={logo} /> 
                    </Button>
                </Dropdown>
                <Tag color="cyan">
                    {networkName}
                </Tag>
                
            </div>)
}

export default connect(({ network }: { network: networkState;}) => ({
    network
  }))(SwitchNetwork);