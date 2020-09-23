import Head from 'next/head'
import {Paper} from "@material-ui/core";
import React from "react";
import {useAppStyles} from "../components/app-styles";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    shot: {
        width: 250,
        alignSelf: 'center',
    },
}));

export default function Privacy() {
    const classes = useStyles();
    const appClasses = useAppStyles();
    return (
        <div>
            <Head>
                <title>AoE II Companion App</title>
            </Head>

            <Paper className={appClasses.box}>


                <br/>
                <div className="flex-container flex-row justify-content-center">
                <Typography variant="h5" noWrap>
                    AoE II Companion App
                </Typography>
                    {/*<h1>AoE II Companion</h1>*/}
                </div>
                <br/>
                <br/>

                <div className="flex-container flex-row justify-content-center">
                <img src="/ios-shot.png" className={classes.shot} />
                </div>

                <br/>
                <br/>


                <div className="flex-container flex-row justify-content-center">
                    <a href="https://play.google.com/store/apps/details?id=com.aoe2companion">
                        <img src="/app-button-play-store.png" className="app-button app-button-play-store" />
                    </a>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a href="https://apps.apple.com/app/id1518463195">
                        <img src="/app-button-app-store.png" className="app-button app-button-app-store" />
                    </a>
                </div>


                <article className="markdown-body entry-content container-lg" itemProp="text">
                    <h2>Features
                    </h2>
                    <h3>Following
                    </h3>
                    <p>You can follow other players to see their <em>activity (recent matches)</em> feed.</p>
                    <p><a target="_blank" rel="noopener noreferrer"
                          href="https://raw.githubusercontent.com/denniske/aoe2companion/blob/master/tools/screenshots/ios/screen-0.jpg"><img
                        src="https://raw.githubusercontent.com/denniske/aoe2companion/master/tools/screenshots/ios/screen-0.jpg" height="400"
                        style={{maxWidth:'100%'}}/></a></p>
                    <h3>Your Profile
                    </h3>
                    <p>After entering your <em>steam / xbox username</em> you have access to your profile page. There
                        you find your <em>current rating,</em> your <em>rating history</em> and <em>recent matches</em>.
                        You can also fetch stats about your <em>most played civs, maps, allies and opponents</em>.</p>
                    <p><a target="_blank" rel="noopener noreferrer"
                          href="https://raw.githubusercontent.com/denniske/aoe2companion/blob/master/tools/screenshots/ios/screen-2.jpg"><img
                        src="https://raw.githubusercontent.com/denniske/aoe2companion/master/tools/screenshots/ios/screen-2.jpg" height="400"
                        style={{maxWidth:'100%'}}/></a> <a target="_blank" rel="noopener noreferrer"
                                                        href="https://raw.githubusercontent.com/denniske/aoe2companion/blob/master/tools/screenshots/ios/screen-3.jpg"><img
                        src="https://raw.githubusercontent.com/denniske/aoe2companion/master/tools/screenshots/ios/screen-3.jpg" height="400"
                        style={{maxWidth:'100%'}}/></a></p>
                    <h3>Search
                    </h3>
                    <p>You can search for users and see their <em>profile</em>.</p>
                    <p><a target="_blank" rel="noopener noreferrer"
                          href="https://raw.githubusercontent.com/denniske/aoe2companion/blob/master/tools/screenshots/ios/screen-1.jpg"><img
                        src="https://raw.githubusercontent.com/denniske/aoe2companion/master/tools/screenshots/ios/screen-1.jpg" height="400"
                        style={{maxWidth:'100%'}}/></a> <a target="_blank" rel="noopener noreferrer"
                                                        href="https://raw.githubusercontent.com/denniske/aoe2companion/blob/master/tools/screenshots/ios/screen-4.jpg"><img
                        src="https://raw.githubusercontent.com/denniske/aoe2companion/master/tools/screenshots/ios/screen-4.jpg" height="400"
                        style={{maxWidth:'100%'}}/></a></p>
                    <h3>Leaderboard
                    </h3>
                    <p>Display the <em>leaderboard</em> for RM 1v1, RM Team, DM 1v1, DM Team and Unranked. You can
                        also <em>filter the leaderboard by country</em>. If you are ranked in the leaderboard you have
                        selected, <em>your rank</em> will be shown above the list.</p>
                    <p><a target="_blank" rel="noopener noreferrer"
                          href="https://raw.githubusercontent.com/denniske/aoe2companion/blob/master/tools/screenshots/ios/screen-5.jpg"><img
                        src="https://raw.githubusercontent.com/denniske/aoe2companion/master/tools/screenshots/ios/screen-5.jpg" height="400"
                        style={{maxWidth:'100%'}}/></a></p>
                    <h3>Build Orders
                    </h3>
                    <p>I embedded the site <a href="https://buildorderguide.com/#/"
                                              rel="nofollow">https://buildorderguide.com</a> with some useful <em>build
                        orders</em>.</p>
                    <p><a target="_blank" rel="noopener noreferrer"
                          href="https://raw.githubusercontent.com/denniske/aoe2companion/blob/master/tools/screenshots/ios/screen-6.jpg"><img
                        src="https://raw.githubusercontent.com/denniske/aoe2companion/master/tools/screenshots/ios/screen-6.jpg" height="400"
                        style={{maxWidth:'100%'}}/></a></p>
                    <h3>Civilizations
                    </h3>
                    <p>Overview of all civilizations and their <em>team bonus</em>. Civilization detail page with info
                        about their <em>strengths</em> and a <em>compact tech tree</em>.</p>
                    <p><a target="_blank" rel="noopener noreferrer"
                          href="https://raw.githubusercontent.com/denniske/aoe2companion/blob/master/tools/screenshots/ios/screen-7.jpg"><img
                        src="https://raw.githubusercontent.com/denniske/aoe2companion/master/tools/screenshots/ios/screen-7.jpg" height="400"
                        style={{maxWidth:'100%'}}/></a> <a target="_blank" rel="noopener noreferrer"
                                                        href="https://raw.githubusercontent.com/denniske/aoe2companion/blob/master/tools/screenshots/ios/screen-8.jpg"><img
                        src="https://raw.githubusercontent.com/denniske/aoe2companion/master/tools/screenshots/ios/screen-8.jpg" height="400"
                        style={{maxWidth:'100%'}}/></a></p>
                    <h3>Units
                    </h3>
                    <p>Overview of all units. Unit detail page with info about <em>cost</em>, <em>stats</em> and with a
                        list of all <em>upgrades that can be researched and their effects</em>. Also for some units
                        a <em>counter units</em> displayed.</p>
                    <p><a target="_blank" rel="noopener noreferrer"
                          href="https://raw.githubusercontent.com/denniske/aoe2companion/blob/master/tools/screenshots/ios/screen-9.jpg"><img
                        src="https://raw.githubusercontent.com/denniske/aoe2companion/master/tools/screenshots/ios/screen-9.jpg" height="400"
                        style={{maxWidth:'100%'}}/></a></p>
                    <h3>Techs
                    </h3>
                    <p>Overview of all techs.</p>
                    <h3>Sources
                    </h3>
                    <p>I want to thank the authors of the following open source projects and wikis: <a
                        href="https://aoe2.net" rel="nofollow">aoe2.net</a>, <a
                        href="https://github.com/SiegeEngineers/aoe2techtree">aoe2techtree</a>, <a
                        href="https://ageofempires.fandom.com/wiki/Age_of_Empires_II:Portal" rel="nofollow">Age of
                        Empires II Wiki</a>, <a href="https://github.com/madebybowtie/FlagKit">FlagKit</a>. The app was
                        created under Microsoft's "<a href="https://www.xbox.com/en-us/developers/rules" rel="nofollow">Game
                            Content Usage Rules</a>" using assets from Age of Empires II.</p>
                    <h2>Updates
                    </h2>
                    <h3>Play Store / App Store
                    </h3>
                    <p>Major updates are pushed to the app stores.</p>
                    <h3>Over-the-Air (OTA) updates
                    </h3>
                    <p>Minor updates can be loaded by the app itself. Tap on the "⋮" (three dots) in the footer and then
                        on "About". The app will then look for OTA updates. If an update is found, you will be presented
                        with an "Update to vXX.X.X" button. Click that button to trigger download of the update and
                        restart of the app.</p>
                    <p><a target="_blank" rel="noopener noreferrer"
                          href="https://raw.githubusercontent.com/denniske/aoe2companion/blob/master/tools/docs/update.png"><img
                        src="https://raw.githubusercontent.com/denniske/aoe2companion/master/tools/docs/update.png" height="110"
                        style={{maxWidth:'100%'}}/></a></p>
                </article>









            </Paper>
        </div>
    )
}
