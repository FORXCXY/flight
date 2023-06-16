import './App.css';
import React from "react";
import {Button} from 'antd';
import {GaodeMap} from '@antv/l7';
import {LarkMap} from '@antv/larkmap';
import {PointLayer} from "@antv/larkmap";
import {List, Space, Drawer} from 'antd';


const layerOptions = {
    autoFit: true,
    shape: 'circle',
    size : 12,

    color: {
        field: 'flightNumber',
        value: ['#0f9960', '#33a02c', '#377eb8'],
    },
    state: {
        active: true, // 激活状态
    },
};


class flightMap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            visiable: false,
            source: {
                data: [],
                parser: {type: 'json', x: 'longitude', y: 'latitude'}
            },
            flightInfo: ""

        }
    }
    mapInstance = new GaodeMap({
        center: [120.210792, 30.246026],
        zoom: 20,
    });

    componentDidMount() {
            fetch("http://flightapi.xiexianbo.xin/airPort/listAll")
                .then(res => res.json())
                .then(newdata => {
                    let data = newdata.data.data;
                    this.setState({     
                        source: {...this.state.source, data}
                    }, () => {
                        console.log('yes');
                    });
                })
    }

    handleShow = (event) => {
        console.log(event)
        this.setState({
            visible: true,
        });
        this.setState({
            flightInfo: {
                "IATACode": event.feature.IATACode, "aptCcity": event.feature.aptCcity,
                "aptCname": event.feature.aptCname, "lat": event.lngLat.lat, "lng": event.lngLat.lng
            }
        }, () => {
            console.log(this.state.flightInfo)
        })
    }
    handleClose=()=>{
        this.setState({
            visible: false,
        });
    }

    render() {
        return (
            <>
                <Drawer
                    id = "Flight"
                    title="机场信息"
                    placement="right"
                    closable={false}
                    onClose={this.handleClose}
                    open={this.state.visible}
                    width={500}
                    style={{textAlign:"center"}}
                    // extra={
                    //     <Space>
                    //         <Button type="primary" onClick={this.handleShow}>
                    //             Clean
                    //         </Button>
                    //     </Space>
                    // }
                >
                    {/*<List*/}
                    {/*    size="small"*/}
                    {/*    bordered*/}
                    {/*    dataSource={this.state.historyData}*/}
                    {/*    renderItem={(item) => <List.Item>{item}</List.Item>}*/}
                    {/*/>*/}
                    <List size="middle"
                          bordered
                          dataSource={this.state.source.data}>
                        <List.Item>{"IATA："+this.state.flightInfo.IATACode}</List.Item>
                        <List.Item>{"城市名称："+this.state.flightInfo.aptCcity}</List.Item>
                        <List.Item>{"机场名称："+this.state.flightInfo.aptCname}</List.Item>
                        <List.Item>{"经度："+this.state.flightInfo.lat}</List.Item>
                        <List.Item>{"纬度："+this.state.flightInfo.lng}</List.Item>
                    </List>


                </Drawer>
                <LarkMap id="container"  map={this.mapInstance} style={{height: '800px'}}>
                <PointLayer
                    {...layerOptions}
                            source={this.state.source}
                            onClick={(e)=>this.handleShow(e)}
                />
                </LarkMap>
                
            </>
        )
    }

}


export default flightMap;
