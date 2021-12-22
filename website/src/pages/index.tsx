import AspectRatio from 'react-aspect-ratio';
import React from "react";
import {fetchJson} from '@nex/data';
import {appConfig} from "@nex/dataset";


export default function Home() {
    const appSlug = appConfig.app.slug;
    const appName = appConfig.app.name;
    const appIdAndroid = appConfig.app.android.bundleId;
    const appIdIOS = appConfig.app.ios.bundleId;
    const game = appConfig.gameTitle;

    const downloadWindowsApp = async (event) => {
        try {
            const releases = await fetchJson('downloadWindowsApp', `https://api.github.com/repos/denniske/${appSlug}/releases`);
            const release = releases?.find(r => r.tag_name.startsWith('desktop-v'));
            const asset = release?.assets?.find(a => a.name.endsWith('.exe'));
            if (asset) {
                window.open(asset.browser_download_url);
            } else {
                window.open(`https://github.com/denniske/${appSlug}/releases`);
            }
        } catch (e) {
            window.open(`https://github.com/denniske/${appSlug}/releases`);
        }
        event.preventDefault();
    };

    return (
        <div className="container2">
            <div className="showcase">
                <div>
                    <h1><span className="main-title">{appName}</span></h1>
                    <h3>Track your games now.</h3>

                    <div className="phone-container phone-container-mobile">
                        <AspectRatio ratio="360/718" style={{maxWidth: '80vw', margin: '20px auto'}}>
                            <div className="frame"/>
                        </AspectRatio>
                    </div>

                    <br/>
                    <div className="flex-container flex-row justify-content-center">
                        <a href={`https://play.google.com/store/apps/details?id=${appIdAndroid}`}>
                            <img src="/app-button-play-store.png" className="app-button app-button-play-store" />
                        </a>
                        <div className="app-button-spacer"/>
                        <a href={`https://apps.apple.com/app/id${appIdIOS}`}>
                            <img src="/app-button-app-store.png" className="app-button app-button-app-store" />
                        </a>
                    </div>

                    {
                        appSlug === 'aoe2companion' &&
                        <>
                            <br/>
                            <br/>
                            <p>Also available:</p>
                            <a href={`https://app.${appSlug}.com`} target="_blank">
                                <img src="https://img.shields.io/static/v1?label=Web&logo=google-chrome&message=Open&logoColor=FFFFFF&color=brightgreen"/>
                            </a>
                            <div style={{height: '10px'}}/>
                            <a onClick={downloadWindowsApp} href="#">
                                <img src="https://img.shields.io/static/v1?label=Windows&logo=windows&message=Download&logoColor=FFFFFF&color=brightgreen"/>
                            </a>
                        </>
                    }

                    <br/>
                    <br/>
                    <br/>
                    <p>Community:</p>
                    <a href={`https://github.com/denniske/aoe2companion`} target="_blank">
                        <img src={`https://img.shields.io/badge/github-aoe2companion-brightgreen?label=Github&logo=github`}/>
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
                        <div className="newsletter">
                            <p>Checkout my other apps: <a href="https://59seconds.app" target="_blank">59seconds - online charade</a></p>
                        </div>

                        <div className="legal">
                            This site is not affiliated with or endorsed by Microsoft Corporation. {game} is a trademark or
                            registered trademark of Microsoft Corporation in the U.S. and other countries.
                        </div>
                    </div>
                </div>

                <div className="spacer"/>

                <div className="phone-container phone-container-desktop">
                    <AspectRatio ratio="360/718" style={{maxWidth: '400px'}}>
                        <div className="frame" style={{backgroundImage: `url('ios-shot-${appSlug}.png')`}}/>
                    </AspectRatio>
                </div>
            </div>
        </div>
    )
}
