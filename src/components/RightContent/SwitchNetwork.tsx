import React, {useState, useEffect} from 'react';

import { Menu, Dropdown, Button, message, Avatar } from 'antd';
import styles from './index.less';
import { networkState, ConnectProps, Loading, connect} from 'umi';

interface PageProps extends ConnectProps {
    index: networkState;
}
  
const SwitchNetwork: React.FC<PageProps> = ({ network, dispatch }) => {
    const [networkName, setNetworkName] = useState("network")
    //console.log(network, dispatch)

    const changeNetwork = (newNetwork:any) => {
        dispatch({
            type: 'network/save',
            payload: {
                network: newNetwork
            }
        })
    }

    const changeNetworkDAO = (newNetwork:any) => {
        localStorage.setItem("network", newNetwork)
    }


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
    

    
    const onClick = ({ key }) => {
        switch (key){
            case "krypton": setNetworkName("Krypton")
                            changeNetwork("Krypton")
                            changeNetworkDAO("Krypton")
                            message.info(`Switch to Krypton network`);
                            break;
            case "xenon": setNetworkName("Xenon")
                          changeNetwork("Xenon")
                          changeNetworkDAO("Xenon")
                          message.info(`Switch to Xenon network`);
                          break;
        }
        
    };
    
    const menu = (
        <Menu onClick={onClick}>
          <Menu.Item key="krypton">
              Krypton Testnet
          </Menu.Item>
          <Menu.Item key="xenon">
              Xenon Testnet
          </Menu.Item>
        </Menu>
    );

    

    return (<div> 
                <Dropdown overlay={menu} placement="bottomRight" >
                    <Button type="text" style={{color: "white"}} size="large">{networkName}</Button>
                </Dropdown>
            </div>)
}

export default connect(({ network }: { network: networkState;}) => ({
    network
  }))(SwitchNetwork);