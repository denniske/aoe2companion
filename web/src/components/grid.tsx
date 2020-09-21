import React, {Component, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {GridOptions, simpleHttpRequest} from "ag-grid-community";
import {Menu, Button} from "antd";
import {MailOutlined, AppstoreOutlined, SettingOutlined} from '@ant-design/icons';
import {Select} from 'antd';
import {fetchLeaderboard, formatAgo, parseUnixTimestamp} from "@nex/data";
import {Paper, Tabs} from "@material-ui/core";
import NameCellRenderer from "./cell-renderer/name.cell-renderer";

const {Option} = Select;

export default function Grid(props: any) {

    const dataSource = {
        rowCount: null, // behave as infinite scroll

        getRows: async function (params) {
            console.log('asking for ' + params.startRow + ' to ' + params.endRow);
            console.log(params);

            const data = await fetchLeaderboard('aoe2de', 3, {
                start: params.startRow + 1,
                count: params.endRow - params.startRow,
            });

            // At this point in your code, you would call the server, using $http if in AngularJS 1.x.
            // To make the demo look real, wait for 500ms before returning
            // take a slice of the total rows
            var rowsThisPage = data.leaderboard;
            // if on or after the last page, work out the last row.
            var lastRow = -1;
            if (data.length <= params.endRow) {
                lastRow = data.length;
            }
            // call the success callback
            params.successCallback(rowsThisPage, data.total);
        },
    };
    const defaultGridOptions: GridOptions = {
        datasource: dataSource,
        columnDefs: [
            {field: 'rank', sortable: false, valueFormatter: params => '#'+params.value },
            {field: 'rating', sortable: false},
            {field: 'name', minWidth: 150, sortable: false, cellRenderer:'nameRenderer'},
            {field: 'games', sortable: false},
            {field: 'wins', sortable: false},
            {field: 'streak', sortable: false},
            {field: 'last_match_time', sortable: false, valueFormatter: params => params.value && formatAgo(parseUnixTimestamp(params.value)) },
        ],
        frameworkComponents:{
            nameRenderer: NameCellRenderer,
        },
        defaultColDef: {
            flex: 1,
            resizable: true,
            minWidth: 100,
        },
        suppressMultiSort: true,
        components: {
            loadingRenderer: function (params) {
                if (params.value !== undefined) {
                    return params.value;
                } else {
                    return '<img src="https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/images/loading.gif">';
                }
            },
        },
        rowBuffer: 0,
        rowSelection: 'multiple',
        rowDeselection: true,
        // tell grid we want virtual row model type
        rowModelType: 'infinite',
        // how big each page in our page cache will be, default is 100
        paginationPageSize: 100,
        // how many extra blank rows to display to the user at the end of the dataset,
        // which sets the vertical scroll and then allows the grid to request viewing more rows of data.
        // default is 1, ie show 1 row.
        cacheOverflowSize: 2,
        // how many server side requests to send at a time. if user is scrolling lots, then the requests
        // are throttled down
        maxConcurrentDatasourceRequests: 1,
        // how many rows to initially show in the grid. having 1 shows a blank row, so it looks like
        // the grid is loading from the users perspective (as we have a spinner in the first col)
        infiniteInitialRowCount: 10000,
        // how many pages to store in cache. default is undefined, which allows an infinite sized cache,
        // pages are never purged. this should be set for large data to stop your browser from getting
        // full of data
        maxBlocksInCache: 10,
    };

    const [gridOptions, setGridOptions] = useState(defaultGridOptions);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            flexDirection: 'column',
            flex: 1,
            height: '100%',
        }}>

            <div
                className="ag-theme-alpine"
                style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    height: '100%'
                }}
            >
                <AgGridReact
                    gridOptions={gridOptions}>
                </AgGridReact>
            </div>
        </div>
    );
}





// {/*<div style={{display: 'flex', justifyContent: 'flex-end'}}>*/}
// {/*    <Select defaultValue="lucy" bordered={false}><Option value="china"*/}
// {/*                                                                              label="China">*/}
// {/*        <div className="demo-option-label-item">*/}
// {/*            <span role="img" aria-label="China">*/}
// {/*              🇨🇳*/}
// {/*            </span>*/}
// {/*            China (中国)*/}
// {/*        </div>*/}
// {/*    </Option>*/}
// {/*    </Select>*/}
// {/*</div>*/}
// {/*<br/>*/}
// {/*<br/>*/}


// {/*<Button type="primary">Button</Button>*/}
//
// {/*<Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">*/}
// {/*    <Menu.Item key="app" icon={<AppstoreOutlined/>}>*/}
// {/*        Following*/}
// {/*    </Menu.Item>*/}
// {/*    <Menu.Item key="mail" icon={<MailOutlined/>}>*/}
// {/*        Me*/}
// {/*    </Menu.Item>*/}
// {/*    <Menu.Item key="app2" icon={<AppstoreOutlined/>}>*/}
// {/*        Leaderboard*/}
// {/*    </Menu.Item>*/}
// {/*    <Menu.Item key="app3" icon={<AppstoreOutlined/>}>*/}
// {/*        Civs*/}
// {/*    </Menu.Item>*/}
// {/*</Menu>*/}
//
// {/*<br/>*/}
