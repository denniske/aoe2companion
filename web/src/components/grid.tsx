import React, {Component} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {simpleHttpRequest} from "ag-grid-community";
import {fetchLeaderboard} from "./helper";
import {Menu, Button} from "antd";
import {MailOutlined, AppstoreOutlined, SettingOutlined} from '@ant-design/icons';
import {Select} from 'antd';

const {Option} = Select;

export default class Grid extends Component {
    constructor(props) {
        super(props);

        var dataSource = {
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

        var gridOptions = {
            datasource: dataSource,
            columnDefs: [
                // this row shows the row index, doesn't use any data from the row
                {
                    headerName: 'ID',
                    maxWidth: 100,
                    // it is important to have node.id here, so that when the id changes (which happens
                    // when the row is loaded) then the cell is refreshed.
                    valueGetter: 'node.id',
                    cellRenderer: 'loadingRenderer',
                },
                {field: 'rank', minWidth: 150, sortable: true},
                {field: 'rating', sortable: true},
                {field: 'country', minWidth: 150, sortable: true},
                {field: 'name', sortable: true},
            ],
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

            // debug: true,
        };

        this.state = {gridOptions};
    }

    state = {
        current: 'mail',
    };

    handleClick = e => {
        console.log('click ', e);
        this.setState({current: e.key});
    };

    render() {
        const {current} = this.state;
        return (
            <div>
                {/*<Button type="primary">Button</Button>*/}

                <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
                    <Menu.Item key="app" icon={<AppstoreOutlined/>}>
                        Following
                    </Menu.Item>
                    <Menu.Item key="mail" icon={<MailOutlined/>}>
                        Me
                    </Menu.Item>
                    <Menu.Item key="app2" icon={<AppstoreOutlined/>}>
                        Leaderboard
                    </Menu.Item>
                    <Menu.Item key="app3" icon={<AppstoreOutlined/>}>
                        Civs
                    </Menu.Item>
                </Menu>

                <br/>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Select defaultValue="lucy" bordered={false}><Option value="china"
                                                                                              label="China">
                        <div className="demo-option-label-item">
                            <span role="img" aria-label="China">
                              🇨🇳
                            </span>
                            China (中国)
                        </div>
                    </Option>
                    </Select>
                </div>
                <br/>
                <br/>

                <div
                    className="ag-theme-alpine"
                    style={{
                        height: '800px',
                        width: '700px'
                    }}
                >
                    <AgGridReact
                        gridOptions={this.state.gridOptions}>
                    </AgGridReact>
                </div>
            </div>
        );
    }
}
