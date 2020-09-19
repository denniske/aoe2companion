import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";
import {useAppStyles} from "../components/app-styles";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
}));

// https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/

export default function ResponsiveDrawer(props) {
    const appClasses = useAppStyles();
    const classes = useStyles();
    const theme = useTheme();

    return (
        <div>
            <Paper className={appClasses.box}>
                <Typography variant="body1" noWrap>
                    About
                </Typography>
            </Paper>
        </div>
    );
}

// import { withApollo } from "../../apollo/client"
// import gql from "graphql-tag"
// import { useQuery } from "@apollo/client"
// import {IMatch, IMatchRaw} from "../../util/api.types";
// import {format} from "date-fns";
// import {enUS} from "date-fns/locale";
// import {useLazyApi} from "../../util/use-lazy-api";
// import {fetchPlayerMatches} from "../../util/player-matches";
// import {fetchRatingHistory} from "../../util/rating-history";
// import { orderBy } from "lodash"
// import {Button} from "@material-ui/core";
//
// export function formatDayAndTime(date: Date) {
//   if (date == null) return 'NULL';
//   // console.log('formatDayAndTime', date);
//   return format(date, 'MMM d HH:mm', {locale: enUS});
// }
//
// const FeedQuery = gql`
//   query FeedQuery {
//     matches(
//       start: 0,
//       count: 400,
//       profile_id: 196240,
//       leaderboard_id: 0
//     ) {
//       match_id
//       name
//       started
//       finished
//       players {
//         profile_id
//         name
//         rating
//       }
//     }
//   }
// `
//
// interface IMatchesQuery {
//   matches: IMatch[];
// }
//
// const Post = ({ match } : {match: IMatch}) => {
//   // console.log(match);
//   return (
//     <div>
//       <div>
//         <b>{match.name} - {match.match_id} ({match.leaderboard_id === 0 ? 'unranked' : match.leaderboard_id})</b>
//       </div>
//       <small>{formatDayAndTime(match.finished)} (started at {formatDayAndTime(match.started)})</small><br/><br/>
//
//       {
//         match.players.map((player, i) =>
//           <div key={i.toString()}>
//             <small>{player.rating} → {player.profile_id == 196240 ?
//               <b>{player.rating + player.rating_change}</b> : player.rating + player.rating_change} {player.name} ({player.rating_change}) {player.won ? 'WON' : (player.won === false ? 'LOST' : null)}</small>
//           </div>
//         )
//       }
//
//       <style jsx>{`
//         a {
//           text-decoration: none;
//           color: inherit;
//           padding: 2rem;
//           display: block;
//         }
//       `}</style>
//     </div>
//   );
// }
//
// const Blog = () => {
//   const { loading, error, data } = useQuery<IMatchesQuery, any>(FeedQuery)
//
//
//   const matches = useLazyApi(
//     {},
//     fetchPlayerMatches, 'aoe2de', 0, 1000, [{profile_id: 196240}]
//   );
//
//   const ratings = useLazyApi(
//     {},
//     fetchRatingHistory, 'aoe2de', 3, 0, 100, {profile_id: 196240}
//   );
//
//   if (loading) {
//     return <div>Loading ...</div>
//   }
//   if (error) {
//     return <div>Error: {error.message}</div>
//   }
//
//   // console.log(matches?.data?.filter(m => m.leaderboard_id == 3));
//
//   let merged = [
//     ...(matches?.data?.filter(m => m.leaderboard_id == 3) || []).map(m => ({
//       _type: 'match',
//       date: m.started,
//       ...m,
//     })),
//     ...(ratings.data || []).map(m => ({
//       _type: 'rating',
//       date: m.timestamp,
//       ...m,
//     })),
//   ];
//
//   merged = orderBy(merged, m => m.date, 'desc');
//
//   return (
//     <div>
//       <div className="page">
//         <h1>My Blog</h1>
//         <Button variant="contained" color="primary">
//           Hello World
//         </Button>
//         <main>
//           {/*<div className="box">*/}
//           {/*  {data.matches.map((post) => (*/}
//           {/*    <div key={post.match_id} className="post">*/}
//           {/*      <Post match={post} />*/}
//           {/*    </div>*/}
//           {/*  ))}*/}
//           {/*</div>*/}
//           <div className="box">
//             {
//               merged && merged.map((item: any, i: number) =>
//                 <div key={i}>
//                   {
//                     item._type == 'match' &&
//                     <div key={item.match_id!} className="post">
//                       <Post match={item as IMatch} />
//                     </div>
//                   }
//                   {
//                     item._type == 'rating' &&
//                     <div key={item.timestamp.toISOString()} className="post rating">
//                       <div>
//                         <b>Rating History Entry</b>
//                       </div>
//                       <small>{formatDayAndTime(item.timestamp)}</small><br/><br/>
//                       {item.rating}
//                     </div>
//                   }
//                 </div>
//               )
//             }
//           </div>
//           {/*<div className="box">*/}
//           {/*  {matches.data && matches.data.map((post) => (*/}
//           {/*    <div key={post.match_id} className="post">*/}
//           {/*      <Post match={post} />*/}
//           {/*    </div>*/}
//           {/*  ))}*/}
//           {/*</div>*/}
//           {/*<div className="box">*/}
//           {/*  {ratings.data && ratings.data.map((post) => (*/}
//           {/*    <div key={post.timestamp.toISOString()} className="post rating">*/}
//           {/*      <div>*/}
//           {/*        <b>Rating History Entry</b>*/}
//           {/*      </div>*/}
//           {/*      <small>{formatDayAndTime(post.timestamp)}</small><br/><br/>*/}
//           {/*      {post.rating}*/}
//           {/*    </div>*/}
//           {/*  ))}*/}
//           {/*</div>*/}
//         </main>
//       </div>
//       <style jsx>{`
//
//         main {
//           display: flex;
//           flex-direction: row;
//         }
//
//         .box {
//           flex: 1;
//         }
//
//         .rating {
//           height: 210px;
//         }
//
//         .post {
//           height: 290px;
//           background: white;
//           padding: 10px;
//           transition: box-shadow 0.1s ease-in;
//         }
//
//         .post:hover {
//           box-shadow: 1px 1px 3px #aaa;
//         }
//
//         .post + .post {
//           margin-top: 1rem;
//         }
//       `}</style>
//     </div>
//   )
// }
//
// export default Blog
