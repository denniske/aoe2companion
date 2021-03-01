import React, {useEffect, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {
    ColumnApi, GridApi, GridOptions, ModelUpdatedEvent, RowClickedEvent, RowDataUpdatedEvent
} from "ag-grid-community";
import {
    Country, fetchLeaderboard, fetchMatch, fetchPlayerMatches, fetchPlayerMatchesNew, formatAgo, parseUnixTimestamp,
    setMatchChecked,
    triggerMatchRefetch
} from "@nex/data";
import NameCellRenderer from "./cell-renderer/name.cell-renderer";
import RatingCellRenderer from "./cell-renderer/rating.cell-renderer";
import {useRouter} from "next/router";
import {usePrevious} from "@nex/data/hooks";
import {getMapName} from '../helper/maps';
import {getLeaderboardOrGameType} from '@nex/data';
import {differenceInSeconds} from 'date-fns';
import { Button } from '@material-ui/core';
import {flatten} from 'lodash';
import {IMatch} from '../../util/api.types';


interface Props {
    leaderboardId: number;
    country?: Country | null;
    search?: string;
}

const formatDuration = (start: Date, finish: Date) => {
    const diffTime = differenceInSeconds(finish, start);
    if (!diffTime) return '00:00'; // divide by 0 protection
    const minutes = Math.abs(Math.floor(diffTime / 60) % 60).toString();
    const hours = Math.abs(Math.floor(diffTime / 60 / 60)).toString();
    return `${hours.length < 2 ? hours : hours}:${minutes.length < 2 ? 0 + minutes : minutes} h`;
};

const promiseAllSequential = (functions) => (
    functions.reduce((promise, func) => (
        promise.then((result) => (
            func().then(Array.prototype.concat.bind(result))
        ))
    ), Promise.resolve([]))
);

export default function Grid2(props: Props) {
    const router = useRouter();

    const { leaderboardId, country, search } = props;

    const previousLeaderboardId = usePrevious(leaderboardId);
    const [gridApi, setGridApi] = useState<GridApi>();
    const [gridColumnApi, setGridColumnApi] = useState<ColumnApi>();

    useEffect(() => {
        if (!gridApi) return;

        if (gridApi.getInfiniteRowCount() > 0) {
            gridApi.ensureIndexVisible(0);
        }
        // gridApi.onFilterChanged();
        gridApi.purgeInfiniteCache();
        gridApi.hideOverlay();

    }, [leaderboardId, country, search]);

    const dataSource = {
        rowCount: null, // behave as infinite scroll

        getRows: async function (params) {
            console.log('asking for ' + params.startRow + ' to ' + params.endRow);
            // console.log('context', params.context);

            // const args: any = {
            //     start: params.startRow + 1,
            //     count: params.endRow - params.startRow,
            // };
            //
            // if (params.context.country) {
            //     args.country = params.context.country;
            // }
            // if (params.context.search) {
            //     args.search = params.context.search;
            // }

            console.log('params.context', params.context);

            const args: any = {
                start: 1,
                count: 1 + 100,
            };
            const leaderboard = await fetchLeaderboard('aoe2de', params.context.leaderboardId, args);

            const matchesArray = await promiseAllSequential(
                [0, 1, 2, 3, 4].map(i => {
                // [0, 1].map(i => {
                    console.log(i);
                        return () => fetchPlayerMatchesNew('aoe2de', 0, 30, leaderboard.leaderboard.filter((x, j) => j > i * 20 && j < (i+1) * 20).map(l => ({profile_id: l.profile_id})));
                    }
                )
            );
            const matches = flatten(matchesArray) as IMatch[];

            for (const m of matches.filter(m => !m.finished)) {
                if (m.checked == null || m.checked.getTime() < new Date().getTime() - 60 * 1000) {
                    const legacyMatch = await fetchMatch('aoe2de', { match_id: m.match_id });
                    if (legacyMatch.finished) {
                        console.log('Finished', m.match_id);
                        m.finished = legacyMatch.finished;
                        triggerMatchRefetch(m.match_uuid, m.match_id).then(() => console.log('Finished Match Refetch', m.match_id));
                    } else {
                        console.log('Not Finished', m.match_id);
                        setMatchChecked(m.match_uuid, m.match_id).then(() => console.log('Finished Match Checked', m.match_id));
                    }
                } else {
                    console.log('Already Checked', m.match_id);
                }
            }

            // const matches = await fetchPlayerMatches('aoe2de', 0, 100, leaderboard.leaderboard.filter((x, i) => i < 100).map(l => ({profile_id: l.profile_id})));

            const rows = leaderboard.leaderboard.map(l => {
                const match = matches.find(m => !m.finished && m.players.some(p => p.profile_id === l.profile_id));

                let duration: string = '';
                if (match?.started) {
                    const finished = match?.finished || new Date();
                    duration = formatDuration(match.started, finished);
                }

                return ({
                    rank: l.rank,
                    rating: l.rating,
                    country: l.country,
                    name: l.name,
                    title: match?.name,
                    map: getMapName(match?.map_type),
                    leaderboard: match && getLeaderboardOrGameType(match?.leaderboard_id, match?.game_type),
                    duration: duration,
                });
            });

            console.log('rows', rows);

            // if (data.total == 0) {
            //     params.context.gridApi?.showNoRowsOverlay();
            // } else {
            //     params.context.gridApi?.hideOverlay();
            // }

            // params.context.gridColumnApi.autoSizeAllColumns();

            const rowsThisPage = rows;
            params.successCallback(rowsThisPage, 100);
        },
    };

    const defaultGridOptions: GridOptions = {
        // context: {
        //     lead: leaderboardId,
        // },
        // blockLoadDebounceMillis: 1000,
        localeText: {noRowsToShow: 'No players listed.'},
        datasource: dataSource,
        columnDefs: [
            {field: 'rank', width: 100, sortable: false, valueFormatter: params => '#'+(params.value ? params.value : '') },
            {field: 'rating', width: 100, sortable: false, cellRenderer:'ratingRenderer'},
            {field: 'name', minWidth: 220, sortable: false, cellRenderer:'nameRenderer'},
            {field: 'title', minWidth: 220, sortable: false},
            {field: 'map', sortable: false},
            {field: 'leaderboard', sortable: false},
            {field: 'duration', width: 100, sortable: false},
        ],
        onRowClicked: (event: RowClickedEvent) => {
            router.push('/profile/[id]', `/profile/${event.data.profile_id}`);
        },
        onFirstDataRendered(params) {
            setGridApi(params.api);
            setGridColumnApi(params.columnApi);
        },
        onModelUpdated(event: ModelUpdatedEvent) {
            event.api.sizeColumnsToFit();
            // event.columnApi.autoSizeAllColumns();
        },
        rowStyle: { cursor: 'pointer' },
        frameworkComponents:{
            nameRenderer: NameCellRenderer,
            ratingRenderer: RatingCellRenderer,
        },
        defaultColDef: {
            // flex: 1,
            // resizable: true,
            minWidth: 10,
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
        // rowSelection: 'multiple',
        // rowDeselection: true,
        suppressCellSelection: true,
        suppressRowClickSelection: true,
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
        }}>
            {/*<Button onClick={() => gridOptions.api.sizeColumnsToFit()}>SizeToFit</Button>*/}
            {/*<Button onClick={() => gridOptions.columnApi.autoSizeAllColumns()}>AutoSize</Button>*/}

            <div
                className="ag-theme-alpine"
                style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    height: '100%'
                }}
            >
                {/*context={{leaderboardId, country, search, gridApi, gridColumnApi}}*/}
                <AgGridReact
                    context={{leaderboardId}}
                    gridOptions={gridOptions}>
                </AgGridReact>
            </div>
        </div>
    );
}
