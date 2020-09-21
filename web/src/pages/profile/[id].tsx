import Router, { useRouter } from 'next/router'
import { withApollo } from '../../../apollo/client'
import gql from 'graphql-tag'
import {
  Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, AppBar, Tabs, Box, Tab, TablePagination,
  InputBase, fade
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React, {useEffect} from "react";
import {useAppStyles} from "../../components/app-styles";
import {useQuery} from "@apollo/client";
import Rating from "../../components/rating";
import {makeStyles} from "@material-ui/core/styles";
import {IProfile} from "../../helper/types";
import {formatLeaderboardId} from "../../helper/util";
import {getCivIconByIndex, getCivName} from "../../helper/civs";
import {getFlagIcon} from "../../helper/flags";
import {IMatch} from "../../../util/api.types";
import Match from "../../components/match";
import {getMapImage, getMapName} from "../../helper/maps";
import Link from "next/link";
import SearchIcon from '@material-ui/icons/Search';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ProfileMatches from "../../components/profile-matches";
import MatchesCompare from "../../components/matches-compare";
import {View} from "react-native";
import {TextLoader} from "../../../../app/src/view/components/loader/text-loader";
import {Skeleton} from "@material-ui/lab";
import {
  faArrowUp, faCaretDown, faCaretUp, faCoffee, faLongArrowAltDown, faLongArrowAltUp
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { getChangeColor } from 'web/src/components/util';


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
        profile_id
        steam_id
        name
        country
        clan
        icon
        rating
        highest_rating
        previous_rating
        games
        wins
        losses
        drops
        streak
        lowest_streak
        highest_streak
        last_match
        last_match_time
        rank
      }
      stats {
        leaderboard_id
        allies {
          name
          games
          wins
          country
          profile_id
        }
        opponents {
          name
          games
          wins
          country
          profile_id
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

interface IProfileQuery {
  profile: IProfile;
}



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          {...other}
      >
        {value === index && (
            <Box p={3}>
              <Typography>{children}</Typography>
            </Box>
        )}
      </div>
  );
}


function ProfilePage() {
  const appClasses = useAppStyles();
  const classes = useStyles();
  const profileId = parseInt(useRouter().query.id as string);

  const [filteredAllies, setFilteredAllies] = React.useState(null);
  const [filteredOpponents, setFilteredOpponents] = React.useState(null);
  const [page, setPage] = React.useState(0);

  const profileResult = useQuery<IProfileQuery, any>(ProfileQuery, {
    variables: {profileId: profileId},
    skip: profileId == null,
  })

  const profile = profileResult.data?.profile;

  useEffect(() => {
    // console.log(page);
    // console.log(profile?.stats[0].opponents);
    setFilteredAllies(profile?.stats?.[0].allies.filter((x, i) => i > page * 10 && i < (page+1)*10));
    setFilteredOpponents(profile?.stats?.[0].opponents.filter((x, i) => i > page * 10 && i < (page+1)*10));
  }, [page, profile]);

  return (
      <div className={classes.container}>
        <div className={classes.containerLine}>
          {/*<Paper className={appClasses.box}>*/}
          {/*  {*/}
          {/*    !profile &&*/}
          {/*    <div>*/}
          {/*      <div className={classes.row2}><Skeleton width={200} variant="text"/></div>*/}
          {/*      <div className={classes.row}><Skeleton width={200} variant="text"/></div>*/}
          {/*    </div>*/}
          {/*  }*/}
          {/*</Paper>*/}
          <Paper className={appClasses.box}>
            {
              !profile &&
              <div>
                <div className={classes.row2}><Skeleton width={200} variant="text"/></div>
                <div className={classes.row}><Skeleton width={200} variant="text"/></div>
              </div>
            }
            {
              profile &&
              <div>
                <div className={classes.row2}>
                  <img src={getFlagIcon(profile.country)} className={classes.flagIcon}/>
                  {profile.name}
                </div>
                <div className={classes.row}>
                  {/*<Skeleton width={200} variant="text"/>*/}
                  {profile.games} Games, {profile.drops} Drops ({(profile.drops / profile.games * 100).toFixed(2)} %)
                </div>
              </div>
            }
          </Paper>
          {/*<MatchesCompare />*/}

          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Leaderboard</TableCell>
                  <TableCell align="left">Rank</TableCell>
                  <TableCell align="left" colSpan={2}>Rating</TableCell>
                  <TableCell align="right">Highest Rating</TableCell>
                  <TableCell align="right">Games</TableCell>
                  <TableCell align="right">Wins</TableCell>
                  <TableCell align="right">Streak</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  !profile && Array(2).fill(0).map((a, i) =>
                      <TableRow key={i}>
                        <TableCell ><Skeleton /></TableCell>
                        <TableCell ><Skeleton /></TableCell>
                        <TableCell colSpan={2}><Skeleton /></TableCell>
                        <TableCell ><Skeleton /></TableCell>
                        <TableCell ><Skeleton /></TableCell>
                        <TableCell ><Skeleton /></TableCell>
                        <TableCell ><Skeleton /></TableCell>
                      </TableRow>
                  )
                }
                {profile?.leaderboards.map((leaderboard) => (
                    <TableRow key={formatLeaderboardId(leaderboard.leaderboard_id)}>
                      <TableCell component="th" scope="row">
                        {formatLeaderboardId(leaderboard.leaderboard_id)}
                      </TableCell>
                      <TableCell align="left">#{leaderboard.rank}</TableCell>
                      <TableCell align="right">{leaderboard.rating}</TableCell>
                      <TableCell align="left">
                        {
                          leaderboard.rating - leaderboard.previous_rating > 0 &&
                          <FontAwesomeIcon icon={faCaretUp} color={getChangeColor(leaderboard.rating - leaderboard.previous_rating)} className={classes.icon} />
                        }
                        {
                          leaderboard.rating - leaderboard.previous_rating < 0 &&
                          <FontAwesomeIcon icon={faCaretDown} color={getChangeColor(leaderboard.rating - leaderboard.previous_rating)} className={classes.icon} />
                        }
                        <span style={{color: getChangeColor(leaderboard.rating - leaderboard.previous_rating)}}>{Math.abs(leaderboard.rating - leaderboard.previous_rating)}</span>
                      </TableCell>
                      <TableCell align="right">{leaderboard.highest_rating}</TableCell>
                      <TableCell align="right">{leaderboard.games}</TableCell>
                      <TableCell align="right">{leaderboard.wins}</TableCell>
                      <TableCell align="right">
                        <span style={{color: getChangeColor(leaderboard.streak)}}>{leaderboard.streak > 0 ? '+'+leaderboard.streak : leaderboard.streak}</span>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Paper className={appClasses.box}>
            <Rating ratingHistories={profile?.rating_history}/>
          </Paper>

          <ProfileMatches profileId={profileId}/>

        </div>

        {/*<div className={classes.containerLine}>*/}

        <Paper className={appClasses.boxForTable}>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>Ally</TableCell>
                  <TableCell align="right">Games</TableCell>
                  <TableCell align="right">Won</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  !filteredAllies && Array(10).fill(0).map((a, i) =>
                      <TableRow key={i}>
                        <TableCell><Skeleton/></TableCell>
                        <TableCell><Skeleton/></TableCell>
                        <TableCell><Skeleton/></TableCell>
                      </TableRow>
                  )
                }
                {
                  filteredAllies?.length > 0 && filteredAllies.map((statsEntry) => (
                      <TableRow key={statsEntry.name}>
                        <TableCell component="th" scope="row">
                          <div className={classes.row}>
                            <img src={getFlagIcon(statsEntry.country)} className={classes.flagIcon}/>
                            {statsEntry.name}
                          </div>
                        </TableCell>
                        <TableCell align="right">{statsEntry.games}</TableCell>
                        <TableCell
                            align="right">{(statsEntry.wins / statsEntry.games * 100).toFixed(0)} %</TableCell>
                      </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper className={appClasses.boxForTable}>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>Opponent</TableCell>
                  <TableCell align="right">Games</TableCell>
                  <TableCell align="right">Won</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  !filteredOpponents && Array(10).fill(0).map((a, i) =>
                      <TableRow key={i}>
                        <TableCell><Skeleton/></TableCell>
                        <TableCell><Skeleton/></TableCell>
                        <TableCell><Skeleton/></TableCell>
                      </TableRow>
                  )
                }
                {
                  filteredOpponents?.map((statsEntry) => (
                      <TableRow key={statsEntry.name}>
                        <TableCell component="th" scope="row">
                          <div className={classes.row}>
                            <Link href='/profile/[id]' as={`/profile/${statsEntry.profile_id}`}>
                              <div className={classes.rowLink2}>
                                <img src={getFlagIcon(statsEntry.country)} className={classes.flagIcon}/>
                                {statsEntry.name}
                              </div>
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell align="right">{statsEntry.games}</TableCell>
                        {/*<TableCell align="right">{statsEntry.wins}</TableCell>*/}
                        <TableCell align="right">{(statsEntry.wins / statsEntry.games * 100).toFixed(0)} %</TableCell>
                      </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

          <div className={classes.containerWrap}>
            <div className={classes.containerWrap50}>

              <Paper className={appClasses.boxForTable}>
                <TableContainer>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Civ</TableCell>
                      <TableCell align="right">Games</TableCell>
                      <TableCell align="right">Won</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {profile?.stats[0].civ.map((statsEntry) => (
                        <TableRow key={getCivName(statsEntry.civ)}>
                          <TableCell component="th" scope="row">
                            <div className={classes.row}>
                              <img src={getCivIconByIndex(statsEntry.civ)} className={classes.civIcon}/>
                              {getCivName(statsEntry.civ)}
                            </div>
                          </TableCell>
                          <TableCell align="right">{statsEntry.games}</TableCell>
                          <TableCell align="right">{(statsEntry.wins / statsEntry.games * 100).toFixed(0)} %</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              </Paper>
            </div>
            <div className={classes.containerWrap50b}>
              <Paper className={appClasses.boxForTable}>
                <TableContainer>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Map</TableCell>
                      <TableCell align="right">Games</TableCell>
                      <TableCell align="right">Won</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {profile?.stats[0].map_type.map((statsEntry) => (
                        <TableRow key={getMapName(statsEntry.map_type)}>
                          <TableCell component="th" scope="row">
                            <div className={classes.row}>
                              <img src={getMapImage(statsEntry.map_type)} className={classes.mapIcon}/>
                              {getMapName(statsEntry.map_type)}
                            </div>
                          </TableCell>
                          <TableCell align="right">{statsEntry.games}</TableCell>
                          <TableCell align="right">{(statsEntry.wins / statsEntry.games * 100).toFixed(0)} %</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              </Paper>
            </div>
          </div>

        {/*</div>*/}


      </div>
  );
}

const useStyles = makeStyles((theme) => ({
  col: {
    paddingHorizontal: 7,
    alignItems: 'center',
  },
  h1: {

  },
  h2: {
    fontSize: 11,
  },

  icon: {
    marginRight: theme.spacing(0.5),
  },

  option: {
    padding: theme.spacing(0, 1),
  },
  row3: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  searchRow: {
    borderRadius: 0,
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(0, -3, 2, -3),
    backgroundColor: fade(theme.palette.common.black, 0.00),
  },
  searchIcon: {
    padding: theme.spacing(0, 2, 0, 2),
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    // backgroundColor: 'yellow',
    flex: 1,
  },
  inputInput: {
    padding: theme.spacing(2, 3, 2, 3),
    display: 'flex',
    // flex: 1,
    // backgroundColor: 'pink',
    // paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    // width: '100%',
  },

  containerWrap: {
     display: 'flex',
     flexDirection: 'row',
     flexWrap: 'wrap',
     maxWidth: 800,
  },
  containerWrap50: {
     flex: 1,
  },
  containerWrap50b: {
     flex: 1,
     marginLeft: theme.spacing(3),
  },
  container: {
     display: 'flex',
     flexDirection: 'column',
     // flexWrap: 'wrap',
  },
  containerLine: {
     display: 'flex',
     flexDirection: 'column',
  },
  row: {
     display: 'flex',
     alignItems: 'center',
  },
  rowLink2: {
    '&:hover': {
      // background: "#EEE",
      textDecoration: 'underline',
    },
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  row2: {
     display: 'flex',
     alignItems: 'center',
     marginBottom: theme.spacing(1),
  },
  flagIcon: {
    width: 21,
    height: 15,
    marginRight: theme.spacing(1),
  },
  civIcon: {
    width: 28,
    height: 28,
    marginRight: theme.spacing(1),
  },
  mapIcon: {
    width: 28,
    height: 28,
    marginRight: theme.spacing(1),
  },
  tableContainer: {
    maxWidth: 800,
    marginBottom: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
}));

export default ProfilePage
// export default withApollo(ProfilePage, {ssr:false})
