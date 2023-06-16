import './Finally.css';
import React,{Fragment} from "react";
import {Button, Menu, Select,Tabs,Cascader,Input } from 'antd';
import { Icon } from '@ant-design/compatible'
import {GaodeMap} from '@antv/l7';
import {LarkMap} from '@antv/larkmap';
import {PointLayer,LineLayer} from "@antv/larkmap";
import {List, Space, Drawer,Grid} from 'antd';
import { registerImage } from '@antv/l7plot';
import InfiniteScroll from 'react-infinite-scroller';
import fetchJsonp from 'fetch-jsonp';

import svg from './fly.svg';
import SubMenu from "antd/es/menu/SubMenu";
// import Icon from "antd/es/icon";

const { Option ,OptGroup } = Select;
const { TabPane } = Tabs;
const images = [
    { id: '01', image: svg }];


const layerOptionsP = {
    autoFit: false,
    shape: '01',
    size : 12,
    state: {
        active: true, // 激活状态
    },
};

const layerOptionsL = {
    autoFit: false,
    shape: 'line',
    size : 1.5,
    color: '#4292C0',
    state: {
        active: true, // 激活状态
    },
}

let locVis = false;


const locationOptions = [
    {
      value: 'HBDQ',
      label: '华北地区',
      children: [
        {
            disabled: locVis,
            value: 'NMG',
            label: '内蒙古',
        },
        {
            disabled: locVis,
            value: 'BEIJIN',
            label: '北京',
        },
        {
            disabled: locVis,
            value: 'TIANJIN',
            label: '天津',
        },
        {
            disabled: locVis,
            value: 'HEBEI',
            label: '河北',
        },
        {
            disabled: locVis,
            value: 'SHANXI',
            label: '山西',
        },
      ],
    },
    {
      value: 'DBBQ',
      label: '东北地区',
      children: [
        {
            disabled: locVis,
            value: 'HLG',
            label: '黑龙江',
        },
        {
            disabled: locVis,
            value: 'JL',
            label: '吉林',
        },
        {
            disabled: locVis,
            value: 'LN',
            label: '辽宁',
        },
      ],
    },
    {
        value: 'HDDQ',
        label: '华东地区',
        children: [
            {
                disabled: locVis,
                value: 'SHANGHAI',
                label: '上海',
            },
            {
                disabled: locVis,
                value: 'JS',
                label: '江苏',
            },
            {
                disabled: locVis,
                value: 'ZJ',
                label: '浙江',
            },
            {
                disabled: locVis,
                value: 'AH',
                label: '安徽',
            },
            {
                disabled: locVis,
                value: 'FJ',
                label: '福建',
            },
            {
                disabled: locVis,
                value: 'JX',
                label: '江西',
            },
            {
                disabled: locVis,
                value: 'SD',
                label: '山东',
            },
        ],
    },
    {
        value: 'ZNDQ',
        label: '中南地区',
        children: [
            {
                disabled: locVis,
                value: 'HUB',
                label: '湖北',
            },
            {
                disabled: locVis,
                value: 'HUN',
                label: '湖南',
            },
            {
                disabled: locVis,
                value: 'GD',
                label: '广东',
            },
            {
                disabled: locVis,
                value: 'GX',
                label: '广西',
            },
            {
                disabled: locVis,
                value: 'HN',
                label: '海南',
            },
            {
                disabled: locVis,
                value: 'HEN',
                label: '河南',
            },
        ],
    },{
        value: 'XNDQ',
        label: '西南地区',
        children: [
            {
                disabled: locVis,
                value: 'CQ',
                label: '重庆',
            },
            {
                disabled: locVis,
                value: 'SC',
                label: '四川',
            },
            {
                disabled: locVis,
                value: 'GZ',
                label: '贵州',
            },
            {
                disabled: locVis,
                value: 'YN',
                label: '云南',
            },
            {
                disabled: locVis,
                value: 'XZ',
                label: '西藏',
            },
        ],
    },{
        value: 'XBDQ',
        label: '西北地区',
        children: [
            {
                disabled: locVis,
                value: 'SX',
                label: '陕西',
            },
            {
                disabled: locVis,
                value: 'GS',
                label: '甘肃',
            },
            {
                disabled: locVis,
                value: 'QH',
                label: '青海',
            },
            {
                disabled: locVis,
                value: 'NX',
                label: '宁夏',
            },
        ],
    },{
        value: 'XJDQ',
        label: '新疆地区',
        children: [
            {
                disabled: locVis,
                value: 'XJ',
                label: '新疆',
            },
        ],
    }
  ];

class Finally extends React.PureComponent {
    constructor(props) {
        super(props);
        // let DataLocal = JSON.parse(localStorage.getItem('sourceData')) || [];
        this.state = {
            nowData: {
                data: [],
                parser: {type: 'json', x: 'longitude', y: 'latitude'}
            },
            // nowData: DataLocal,
            visiable: false,
            locVis: true,
            source: {
                data: [],
                parser: {type: 'json', x: 'longitude', y: 'latitude'}
            },
            shape: '01',
            flightInfo: "",
            inputValue: '',
            queryType: '',
            queryResult: null,
            sourceL: {
                data: [{
                    path:[[]]
                }],
                parser: { type: 'json', coordinates: 'path'}
              },
              disabledLoc: false,
              disabledTop: false,
        }
        
    }

    getBack = () => {
        this.setState({
            nowData: this.state.source,
            queryResult: null,
            sourceL: {data: [{path:[[]]}]},
            disabledLoc: false,
            disabledTop: false,
        })
    }
    

    operations = <Button type="primary" style={{marginRight:"5px"}} onClick={this.getBack}>恢复地图</Button>;

    
    onSceneLoaded = (scene) => {
        Promise.all(images.map(({ id, image }) => scene?.addImage(id, image))).then(() => {
          this.setState({ loadedImages: true });
        });
      };
      
    mapInstance = new GaodeMap({
        center: [108.926305, 34.674118],
        zoom: 3.5,
    });

    componentDidMount() {
        registerImage(images);
        // let DataLocal = JSON.parse(localStorage.getItem('sourceData')) || [];
        // let data = DataLocal.data;
        // console.log('111111')
        // console.log(data);
        // this.setState({nowData:{...this.state.nowData,data},source: {...this.state.nowData,data}}, () => {
        //     console.log(this.state.nowData);
        // });
        // fetch("http://flightapi.xiexianbo.xin/airPort/listAll")
        //     .then(res => res.json())
        //     .then(newdata => {
        //         let data = newdata.data.data;
        //         this.setState({
        //             nowData: {...this.state.nowData, data},
        //             source: this.state.nowData
        //         }, () => {
        //             localStorage.setItem('sourceData', JSON.stringify(this.state.source));
        //         });
        //     })
        fetch("http://flightapi.xiexianbo.xin/airPort/listAll")
            .then(res => res.json())
            .then(newdata => {
                let data = newdata.data.data;
                this.setState({
                    nowData: {...this.state.nowData, data},
                    source: this.state.nowData
                });
            })
    }

    findIDByIATA = (IATACode) => {
        //找到this.state.source.data中IATACode对应的下标
        let id = 0;
        for(let i = 0; i < this.state.source.data.length; i++){
            
            if(this.state.source.data[i].IATACode === IATACode){
                id = i;
                return id;
            }
    }
        return -1;
}
    findIDByName = (Name) => {
    let id = 0;
    for(let i = 0; i < this.state.source.data.length; i++){
        
        if(this.state.source.data[i].aptCname === Name){
            id = i;
            return id;
        }
}
        return -1;
}

    findIDByCityName = (Name) => {
        let id = 0;
        for(let i = 0; i < this.state.source.data.length; i++){
        
        if(this.state.source.data[i].aptCcity === Name){
            id = i;
            return id;
        }
}
        return -1;
    }

    findIDByFlightNumber = (flightNumber) => {
        flightNumber = Number(flightNumber);
        let id = 0;
        for(let i = 0; i < this.state.source.data.length; i++){
            if(this.state.source.data[i].flightNumber === flightNumber){
                id = i;
                return id;
            }
        }
        return -1;
}

    getColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
            }
        return color;
    }

    handleGetTop = (num) => {
        fetch("http://flightapi.xiexianbo.xin/airPort/getTopAP")
            .then(res => res.json())
            .then(newdata => {
                let data = newdata.data.data;
                let dataTemp = [];
                for(let i = 0; i < num; i++){
                    let id = this.findIDByIATA(data[i].IATACode);
                    if(id === -1){
                        continue;
                    }
                    dataTemp.push(this.state.source.data[id]);
                    // console.log(id);
                }
                if(dataTemp.length === 0){
                    alert("未找到该机场");
                    return;
                }
                // console.log(dataTemp);
                this.setState({nowData: {...this.state.nowData, data: dataTemp}}, () => {
                    console.log(this.state.nowData);
                });
                // console.log(data);
            })
    }


    handleTopChange = (value) =>{
        this.setState({disabledLoc: true});
        switch(value){
            case "top10":
                this.handleGetTop(10);
                break;
            case "top5":
                this.handleGetTop(5);
                break;
            case "top3":
                this.handleGetTop(3);
                break;
            case "top1":
                this.handleGetTop(1);
                break;
            default:
                break;
      }
    }

    handleShowLeft = (event) => {
        console.log(event.target.innerText);
        let key = event.target.innerText.split("：")[0];
        let val = event.target.innerText.split("：")[1];
        let id = 0;
        switch(key){
            case "机场名称":
                id = this.findIDByName(val);
                break;
            case "IATA":
                id = this.findIDByIATA(val);
                break;
            case "FlightNumber":
                id = this.findIDByFlightNumber(val);
                break;
            case "所在城市":
                id = this.findIDByCityName(val);
                break;
            
        }
        this.setState({
            visible: true,
        });
        console.log(id);
        this.setState({
            flightInfo: {
                "IATACode": this.state.source.data[id].IATACode, "aptCcity": this.state.source.data[id].aptCcity,
                "aptCname": this.state.source.data[id].aptCname, "lat": this.state.source.data[id].latitude, "lng": this.state.source.data[id].longitude,
                "flightNumber": this.state.source.data[id].flightNumber
            }
        }, () => {
            console.log(this.state.flightInfo)
        })
    }
    
    handleShow = (event) => {
        console.log("----------------------------")
        console.log(event.target.id)
        console.log(event)
        this.setState({
            visible: true,
        });
        this.setState({
            flightInfo: {
                "IATACode": event.feature.IATACode, "aptCcity": event.feature.aptCcity,
                "aptCname": event.feature.aptCname, "lat": event.lngLat.lat, "lng": event.lngLat.lng,
                "flightNumber": event.feature.flightNumber
            }
        }, () => {
            console.log(this.state.flightInfo)
        })
    }
    handleClose=(e)=>{
        console.log(e)
        this.setState({
            visible: false,
        });
        // this.setState({nowData:this.state.source})
    }
    handleLocationChange = (e) => {
        console.log(e)
        this.setState({disabledTop:true})
        //将字符串数组e合并为一个字符串
        let loc = e.join("/");
        fetch(`http://8.130.109.165:8000/api/regLog/getFlight?location=${loc}`)
            .then(res => res.json())
            .then(newdata => {
                let data = newdata.data;
                let dataTemp = [];
                for(let i = 0; i < data.length; i++){
                    let id = this.findIDByName(data[i]);
                    if(id === -1){
                        continue;
                    }
                    dataTemp.push(this.state.source.data[id]);
                }
                if(dataTemp.length === 0){
                    alert("未找到该机场");
                    return;
                }
                this.setState({nowData: {...this.state.nowData, data: dataTemp}}, () => {
                    console.log(this.state.nowData);
                });
    })
    }

    handleInputChange = (event) => {
        this.setState({ inputValue: event.target.value });
      };
    
    handlequeryClick = () => {
        const inputValue = this.state.inputValue;
        //获取查询类型
        let dataTemp = [];
        let queryType = this.state.queryType;
        console.log(queryType, inputValue);
        let id = -1;
        switch(queryType){
            case "IATA":
                id = this.findIDByIATA(inputValue);
                dataTemp.push(this.state.source.data[id]);
                break;
            case "CityName":
                id = this.findIDByCityName(inputValue);
                dataTemp.push(this.state.source.data[id]);
                break;
            case "FlightNumber":
                id = this.findIDByFlightNumber(inputValue);
                dataTemp.push(this.state.source.data[id]);
                break;
            case "FlightName":
                id = this.findIDByName(inputValue);
                dataTemp.push(this.state.source.data[id]);
                break;
                }
        if(id === -1){
            alert("未找到该机场");
            return;
        }
        let loc = [this.state.source.data[id].latitude, this.state.source.data[id].longitude];
        loc = loc.join(",");
        // fetch(`https://apis.map.qq.com/ws/smart_address/place_analy/?key=HOABZ-SCFKG-4G7QQ-QJL4T-3X62S-GSF5N&location=${loc}&output=jsonp`)
        //     .then(res => {res.json()})
        //     .then(newdata => {
        //         let data = newdata.result.pois[0].address;
        //         console.log(data);
        //         const queryResult = { IATA: this.state.source.data[id].IATACode, flightNumber: this.state.source.data[id].flightNumber ,CityName: this.state.source.data[id].aptCcity, aptName:this.state.source.data[id].aptCname,address:data};
        //         this.setState({ queryResult });
        // })
        fetchJsonp(`https://apis.map.qq.com/ws/geocoder/v1/?key=HOABZ-SCFKG-4G7QQ-QJL4T-3X62S-GSF5N&location=${loc}&output=jsonp`)
            .then(res => 
                res.json()
            ).then(newdata => {
                console.log(newdata);
                let data = newdata.result.address;
                console.log(data);
                if(data === undefined){
                    data = "未知";
                }
                const queryResult = { IATAcode: this.state.source.data[id].IATACode, flightNumber: this.state.source.data[id].flightNumber ,CityName: this.state.source.data[id].aptCcity, aptCname:this.state.source.data[id].aptCname,address:data};
                this.setState({ queryResult });
            })
        this.setState({nowData: {...this.state.nowData, data: dataTemp}});
        
    }

    handleQueryChange = (e) => {
        this.setState({queryType: e});
}
    handleFrog = (e) => {

        let IATA = this.state.inputValue;
        let center = this.findIDByIATA(IATA);
        if(center === -1){
            alert("未找到该机场");
            return;
        }
        let path = [];
        fetch(`http://flightapi.xiexianbo.xin/flight/getDepFlightList/?forg=${IATA}&pageNo=1&pageSize=266`)
            .then(res => res.json())
            .then(newdata => {
                let data = newdata.data.data;
                let dataTemp = [];
                let path = [];
                for(let i = 0; i < data.length; i++){//找到所有起点
                    let id = this.findIDByName(data[i].fdstAptCname);
                    if(id === -1){
                        continue;
                    }
                    dataTemp.push(this.state.source.data[id]);
                }
                dataTemp.push(this.state.source.data[center]);//加入终点
                if(dataTemp.length === 1){//如果只有终点,则不显示
                    alert("未找到终点");
                    return;
                }
                this.setState({nowData: {...this.state.nowData, data: dataTemp}}, () => {//更新nowData
                    console.log(this.state.nowData);
                });

                for(let i = 0; i < dataTemp.length; i++){//找到所有起点终点坐标
                    path.push([dataTemp[i].longitude, dataTemp[i].latitude]);
                    path.push([this.state.source.data[center].longitude, this.state.source.data[center].latitude]);
                }

                this.setState({sourceL: {...this.state.sourceL, data: [{path:path}]}}, () => {//更新sourceL
                    console.log(this.state.sourceL);
                });
            })
    };

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
                >
                    <List size="middle"
                          bordered
                          dataSource={this.state.source.data}>
                        <List.Item>{"IATA："+this.state.flightInfo.IATACode}</List.Item>
                        <List.Item>{"FlightNumber："+this.state.flightInfo.flightNumber}</List.Item>
                        <List.Item>{"所在城市："+this.state.flightInfo.aptCcity}</List.Item>
                        <List.Item>{"机场名称："+this.state.flightInfo.aptCname}</List.Item>
                        <List.Item>{"经度："+this.state.flightInfo.lat}</List.Item>
                        <List.Item>{"纬度："+this.state.flightInfo.lng}</List.Item>
                    </List>
                </Drawer>

                <div id="main_div">
                <div id="left_div">
                    <div className="scroll-container">
                    <InfiniteScroll
                        initialLoad={false}
                        pageStart={0}
                        loadMore={this.handleInfiniteOnLoad}
                        hasMore={!this.state.loading && this.state.hasMore}
                        useWindow={false}
                        >
                        <List
                            size="large"
                            bordered
                            dataSource={this.state.nowData.data}
                            renderItem={(item) => (
                            <>
                            <div className='item_div' style={{border: `solid 1px ${this.getColor()}`}} onClick={this.handleShowLeft}>
                                <List.Item>{"IATA：" + item.IATACode}</List.Item>
                                <List.Item>{"FlightNumber：" + item.flightNumber}</List.Item>
                                <List.Item>{"所在城市：" + item.aptCcity}</List.Item>
                                <List.Item>{"机场名称：" + item.aptCname + "机场"}</List.Item>
                            </div>
                            </>)}
                        >
                        </List>
                        </InfiniteScroll>
                        </div>

                </div>
                <div id="right_div">
                <LarkMap id="container"  map={this.mapInstance} style={{height: '800px',width:'100%'}} onSceneLoaded={this.onSceneLoaded}>
                    <LineLayer {...layerOptionsL} source={this.state.sourceL} />
                    <PointLayer
                        {...layerOptionsP}
                        source={this.state.nowData}
                        onClick={(e)=>this.handleShow(e)}
                    />
                    
                </LarkMap>
                <div id="right_down_div">
                <Tabs defaultActiveKey="1" 
                tabBarExtraContent={this.operations}
                size="large" 
                // onChange={callback}
                style={{paddingLeft:10}}
                >
                    
                    <TabPane tab={<span><Icon type="search" />查找</span>} key="1" >
                        <div className="tab_div">
                        <div className="search_options">
                        <div style={{display:"flex",alignItems:"center",margin:"10px"}}>
                            <span>查找选项：</span>
                            <Select
                            style={{ width: 200,marginRight:"5px"}} 
                            onChange={this.handleQueryChange}>
                            <OptGroup label="编号">
                            <Option value="FlightNumber">FlightNumber号码</Option>
                            <Option value="IATA">IATA号码</Option>
                            </OptGroup>
                            <OptGroup label="名称">
                            <Option value="CityName">城市名称</Option>
                            <Option value="FlightName">机场名称</Option>
                            </OptGroup>
                        </Select> 
                        <Input placeholder="请输入查询的值" style={{width:"200px"}} onChange={this.handleInputChange}/>
                        <Button type="primary" style={{marginLeft:"5px"}} onClick={this.handlequeryClick}>查询</Button>
                            </div>
                            <div style={{display:"flex",alignItems:"center",margin:"10px"}}>
                            <span>终点查询：</span>
                            <Input placeholder="请输入始发地IATA" style={{width:"200px"}} onChange={this.handleInputChange}/>
                            <Button type="primary" style={{marginLeft:"5px"}} onClick={this.handleFrog}>查询</Button>
                            </div>
                        </div>
                        <div id="search">
                        {this.state.queryResult && (
                            <div id="searchResult_div">
                                <span>查找结果：</span>
                                <div className="result_head">
                                    <div className='searchResultItem_div'>{"机场名称："+this.state.queryResult.aptCname + "机场"}</div>
                                    <div className='searchResultItem_div'>{"机场IATA："+this.state.queryResult.IATAcode}</div>
                                </div>
                                <div className="result_head">
                                    <div className='searchResultItem_div'>{"机场FlightNumber："+this.state.queryResult.flightNumber}</div>
                                    <div className='searchResultItem_div'>{"所在地址："+this.state.queryResult.address }</div>
                                </div>
                             </div>
                            )}
                        </div>
                        </div>
                        {/*Content of Tab Pane 1*/}
                    </TabPane>
                    <TabPane tab={<span><Icon type="appstore" />地图选项</span>} key="2">
                        <div className="tab_div">
                        <div className="search_options">
                        <div style={{display:"flex",alignItems:"center",margin:"10px"}}>
                            <span>地区筛选：</span>
                                <Cascader options={locationOptions} changeOnSelect={true} onChange={this.handleLocationChange} disabled={this.state.disabledLoc}/>   
                            </div>
                            <div style={{display:"flex",alignItems:"center",margin:"10px"}}>
                            <span>流量筛选：</span>
                                <Select
                                    disabled = {this.state.disabledTop}
                                    style={{width: 90}}
                                    onChange={this.handleTopChange}
                                    >
                                    <Option value="top1">Top1</Option>
                                    <Option value="top3">Top3</Option>
                                    <Option value="top5">Top5</Option>
                                    <Option value="top10">Top10</Option>
                                    
                                    {/* <Option value="Yiminghe">yiminghe</Option> */}
                                </Select>
                            </div>
                        </div>
                            
                        
                        </div>
                    </TabPane>
                </Tabs>
                </div>
                
                </div>
                
                </div>
                
            </>
        )
    }

}


export default Finally;
