import React, { useState, useEffect } from 'react';

import { Menu, Dropdown, Button, message, Tag } from 'antd';
import { networkState, ConnectProps, connect } from 'umi';
import logo from '@/assets/stacks_icon.png';
import { getNetworkFromStorage } from '@/utils/utils'

interface PageProps extends ConnectProps {
    index: networkState;
}

const SwitchNetwork: React.FC<PageProps> = () => {
    const [networkName, setNetworkName] = useState("Xenon");
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
    const changeNetworkDAO = (newNetwork: any) => {
        localStorage.setItem("network", newNetwork)
    }


    useEffect(() => {
        switch (getNetworkFromStorage()) {
            case "Xenon": setNetworkName("Xenon"); break;
            case "Mainnet": setNetworkName("Mainnet"); break;
        }
    }, [])


    const onClick = ({ key }) => {
        switch (key) {
            case "Xenon": {
                setNetworkName("Xenon");
                message.info(`Switch to Xenon network`);
                changeNetworkDAO("Xenon");
		localStorage.removeItem("pooledBtcAddress")
                window.location.reload();
                // switchPage('Xenon');
                break;
            }
            case "Mainnet": {
                setNetworkName("Mainnet");
                message.info(`Switch to Mainnet network`);
		localStorage.removeItem("pooledBtcAddress")
                changeNetworkDAO("Mainnet");
                window.location.reload();
                // switchPage('Xenon');
                break;
            }
        }

    };

    const menu = (
        <Menu onClick={onClick} style={{ fontSize: 12 }}>
            <Menu.Item key="Xenon">
                Xenon
          </Menu.Item>
            <Menu.Item key="Mainnet">
                Mainnet
          </Menu.Item>
        </Menu>
    );



    return (<div>
        <Dropdown overlay={menu} placement="bottomRight" >
            <Button type="text" size="large" style={{ color: "white" }}>
                <img alt="logo" style={{ height: 18, marginRight: 10 }} src={logo} />
            </Button>
        </Dropdown>
        {
        networkName === 'Xenon' ?
            <Tag color='pink'>
                {networkName}
            </Tag>
            :
            <Tag color='orange'>
                {networkName}
            </Tag>}

    </div>)
}

export default connect(({ network }: { network: networkState; }) => ({
    network
}))(SwitchNetwork);