import AspectRatio from 'react-aspect-ratio';
import Layout from "../components/layout";
import React from "react";
import Image from 'next/image'

export default function Home() {
    return (
        <Layout>
            <div className="showcase">
                <div>
                    <h1><span className="main-title">AoE II Companion</span></h1>
                    <h3>Track your games now.</h3>

                    <div className="phone-container phone-container-mobile">
                        <AspectRatio ratio="360/718" style={{maxWidth: '80vw', margin: '20px auto'}}>
                            <div className="frame"/>
                        </AspectRatio>
                    </div>

                    <br/>
                    <div className="flex-container flex-row justify-content-center">
                        <a href="https://play.google.com/store/apps/details?id=com.aoe2companion">
                            <img src="/app-button-play-store.png" className="app-button app-button-play-store" />
                        </a>
                        <div className="app-button-spacer"/>
                        <a href="https://apps.apple.com/app/id1518463195">
                            <img src="/app-button-app-store.png" className="app-button app-button-app-store" />
                        </a>
                    </div>

                    <br/>
                    <br/>
                    <p>Also available:</p>
                    <a href="https://app.aoe2companion.com" target="_blank">
                        <img src="https://img.shields.io/static/v1?label=Web&logo=google-chrome&message=Open&logoColor=FFFFFF&color=brightgreen"/>
                    </a>
                    <div style={{height: '10px'}}/>
                    <a href="https://github.com/denniske/aoe2companion/releases/download/v22.0.2/aoe2companion.22.0.2.exe" target="_blank">
                        <img src="https://img.shields.io/static/v1?label=Windows&logo=windows&message=Download&logoColor=FFFFFF&color=brightgreen"/>
                    </a>

                    <br/>
                    <br/>
                    <br/>
                    <p>Community:</p>
                    <a href="https://github.com/denniske/aoe2companion" target="_blank">
                        <img src="https://img.shields.io/badge/github-aoe2companion-brightgreen?label=Github&logo=github"/>
                    </a>
                    &nbsp;&nbsp;
                    <a href="https://discord.gg/gCunWKx" target="_blank">
                        <img src="https://img.shields.io/discord/727175083977736262.svg?label=Discord&logo=discord&logoColor=ffffff&labelColor=7289DA&color=2c2f33"/>
                    </a>
                    <div style={{height: '10px'}}/>
                    <a href="https://www.buymeacoffee.com/denniskeil" target="_blank">
                        <img src="https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshields-io-buymeacoffee.vercel.app%2Fapi%3Fusername%3Ddenniskeil"/>
                    </a>
                    <br/>
                    <br/>

                    <div className="flex-container align-center">
                        {/*<div className="github-section">*/}
                        {/*    <a target="_blank" href="https://github.com/denniske/aoe2companion" className="github"></a>*/}
                        {/*    <a target="_blank" href="https://github.com/denniske/aoe2companion" className="text-link">Visit this project on Github</a>*/}
                        {/*</div>*/}
                        {/*<div className="github-section">*/}
                        {/*    <a target="_blank" href="https://discord.gg/gCunWKx" className="discord"></a>*/}
                        {/*    <a target="_blank" href="https://discord.gg/gCunWKx" className="text-link">Visit this project on Discord</a>*/}
                        {/*</div>*/}

                        {/*<div className="newsletter">*/}
                        {/*    <p>Weekly updates about new content and features:</p>*/}
                        {/*    <MailchimpSubscribe url={url}/>*/}
                        {/*</div>*/}

                        <div className="newsletter">
                            <p>Checkout my other apps: <a href="https://59seconds.app" target="_blank">59seconds - online charade</a></p>
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

                {/*<Image*/}
                {/*    src="/ios-shot.png"*/}
                {/*    alt="Picture of the author"*/}
                {/*    width={360}*/}
                {/*    height={718}*/}
                {/*/>*/}

                <div className="phone-container phone-container-desktop">
                    <AspectRatio ratio="360/718" style={{maxWidth: '400px'}}>
                        <div className="frame"/>
                    </AspectRatio>
                </div>
            </div>
        </Layout>
    )
}
