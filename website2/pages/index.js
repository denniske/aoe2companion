import AspectRatio from 'react-aspect-ratio';
import Layout from "../components/layout";
import React from "react";
import MailchimpSubscribe from "../components/newsletter/mailchimp-subscribe";

const url = "//aoe2companion.us10.list-manage.com/subscribe/post?u=584a93842ae0fd3ecd1a888c0&id=16dd24f1d7";


export default function Home() {
    return (
        <Layout>
            <div className="showcase">
                <div>

                    {/*<h1>The best way to connect with your friends is with <span className="main-title">AoE II Companion</span></h1>*/}

                    <h1><span className="main-title">AoE II Companion</span></h1>
                    <h3>Track your games now.</h3>

                    <div className="phone-container phone-container-mobile">
                        <AspectRatio ratio="360/718" style={{maxWidth: '60vw', margin: '20px auto'}}>
                            <div className="frame"/>
                        </AspectRatio>
                    </div>

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

                    <div className="flex-container align-center">
                        <div className="github-section">
                            <a target="_blank" href="https://github.com/denniske/aoe2companion" className="github"></a>
                            <a target="_blank" href="https://github.com/denniske/aoe2companion" className="text-link">Visit this project on Github</a>
                        </div>
                        <div className="github-section">
                            <a target="_blank" href="https://discord.gg/gCunWKx" className="discord"></a>
                            <a target="_blank" href="https://discord.gg/gCunWKx" className="text-link">Visit this project on Discord</a>
                        </div>

                        <div className="newsletter">
                            <p>Weekly updates about new content and features:</p>
                            <MailchimpSubscribe url={url}/>
                        </div>

                        <div className="legal">
                            {/*Data from <a href="https://aoe2.net" target="_blank">aoe2.net</a>*/}
                            {/*<br/>*/}
                            {/*<br/>*/}
                            This site is not affiliated with or endorsed by Microsoft Corporation. Age
                            of Empires II: HD and Age of Empires II: Definitive Edition are trademarks or
                            registered trademarks of Microsoft Corporation in the U.S. and other countries.
                        </div>
                    </div>
                </div>

                <div className="spacer"/>

                <div className="phone-container phone-container-desktop">
                    <AspectRatio ratio="360/718" style={{maxWidth: '400px'}}>
                        <div className="frame"/>
                    </AspectRatio>
                </div>
            </div>
        </Layout>
    )
}
