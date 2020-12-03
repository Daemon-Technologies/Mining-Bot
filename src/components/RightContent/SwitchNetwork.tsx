import React, {useState, useEffect} from 'react';
import { useModel } from 'umi';
import { Menu, Dropdown, Button, message, Avatar } from 'antd';
import styles from './index.less';




  
const SwitchNetwork: React.FC<{}> = () => {
    const [networkName, setNetworkName] = useState("testnet")
    const model = useModel('useNetworkModel');
    const { network, switchNetwork } = model;

    const onClick = ({ key }) => {
        switch (key){
            case "krypton": setNetworkName("Krypton")
                            switchNetwork("Krypton")
                            message.info(`Switch to Krypton network`);
                            break;
            case "xenon": setNetworkName("Xenon")
                          switchNetwork("Xenon")
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

    useEffect(()=>{
        setNetworkName(network)
    } ,[])

    return (<div> 
                <Dropdown overlay={menu} placement="bottomRight" >
                    <Button type="text" style={{color: "white"}} size="large">{networkName}</Button>
                </Dropdown>
            </div>)
}

export default SwitchNetwork;