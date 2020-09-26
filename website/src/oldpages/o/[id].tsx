import Router, { useRouter } from 'next/router'
import { withApollo } from '../../../apollo/client'
import gql from 'graphql-tag'
import {Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {useAppStyles} from "../../components/app-styles";
import {useQuery} from "@apollo/client";
import {fromUnixTime} from "date-fns";
import Rating from "../../components/rating";

export interface ILeaderboard {
    leaderboard_id: number;
    rating: number;
    games: number;
    drops: number;
}

export interface IRatingHistory {
    leaderboard_id: number;
    history: IRatingHistoryEntry[];
}

export interface IRatingHistoryEntry {
    rating: number;
    num_wins: number;
    num_losses: number;
    streak: number;
    drops: number;
    timestamp: Date;
}

export interface IProfile {
    profile_id: number;
    name: string;
    country: string;
    games: number;
    drops: number;
    last_match_time: Date;
    leaderboards: ILeaderboard[];
    rating_history: IRatingHistory[];
}

export interface IProfileQuery {
    profile: IProfile;
}

const ProfileQuery = gql`
    query ProfileQuery($profileId: Int!) {
        profile(profile_id: $profileId) {
            profile_id
            name
            last_match_time
            country
            games
            drops
            leaderboards {
                leaderboard_id
                rating
                games
                drops
            }
            stats {
                leaderboard_id
                allies {
                    name
                    games
                    wins
                }
                opponents {
                    name
                    games
                    wins
                }
                civ {
                    civ
                    games
                    wins
                }
                map_type {
                    map_type
                    games
                    wins
                }
            }
            rating_history {
                leaderboard_id
                profile_id
                history {
                    rating
                    timestamp
                }
            }
        }
    }
`

// function useHasMounted() {
//   const [hasMounted, setHasMounted] = React.useState(false);
//   React.useEffect(() => {
//     setHasMounted(true);
//   }, []);
//   return hasMounted;
// }
//
// function ClientOnly({ children, ...delegated }) {
//   const mounted = useHasMounted();
//   const hasId = useRouter().query.id != null;
//   console.log('mounted', mounted);
//   // console.log('router query', useRouter());
//   console.log('router hasId', hasId);
//   if (!mounted || !hasId) return null;
//   return (
//       <div {...delegated}>
//         {children}
//       </div>
//   );
// }

function Post() {
    const appClasses = useAppStyles();


    // const [counter, setCounter] = React.useState(0);
    // React.useEffect(() => {
    //   setCounter(1);
    // }, []);

    // if (!useHasMounted()) return null;

    const profileId = useRouter().query.id as string;
    // console.log('router query', useRouter());

    const { loading, error, data } = useQuery<IProfileQuery, any>(ProfileQuery, {
        variables: { profileId: parseInt(profileId) },
        skip: profileId == null,
        // fetchPolicy: 'no-cache',
        // onCompleted: (data) => {
        //   console.log('onCompleted', data);
        // }
    })


    const profile = data?.profile;

    // console.log('PROFILE', profileId);
    // console.log('DATA', data);
    // console.log('profile', data?.profile);
    // console.log('last_match_time', data?.profile?.last_match_time);

    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }

    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
    ];

    return (
        <div>
            <Paper className={appClasses.box}>
                <Typography variant="body1" noWrap>
                    Profile
                </Typography>
                <Typography variant="subtitle2" noWrap>
                    {profileId}
                </Typography>

                {/*<p>loading: {loading}</p>*/}
                {/*<p>error: {error?.message}</p>*/}
                {/*<p>counter: {counter}</p>*/}

                {
                    profile &&
                    <div>
                        <p>
                            {profile.country} {profile.name}
                        </p>
                        <p>
                            {profile.games} Games, {profile.drops} Drops ({(profile.drops / profile.games * 100).toFixed(2)} %)
                        </p>
                    </div>
                }

                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Dessert (100g serving)</TableCell>
                                <TableCell align="right">Calories</TableCell>
                                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                                <TableCell align="right">Protein&nbsp;(g)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.calories}</TableCell>
                                    <TableCell align="right">{row.fat}</TableCell>
                                    <TableCell align="right">{row.carbs}</TableCell>
                                    <TableCell align="right">{row.protein}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>


            </Paper>
            <Paper className={appClasses.box}>
                <Typography variant="body1" noWrap>
                    Rating History
                </Typography>
                <div>
                    <Rating ratingHistories={profile?.rating_history}/>
                </div>
            </Paper>
        </div>
    )
}

// export default function PostLoader(props) {
//   return <ClientOnly><Post/></ClientOnly>
// }

export default withApollo(Post, {ssr:false})
