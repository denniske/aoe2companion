import AspectRatio from 'react-aspect-ratio';
import Layout from "../components/layout";

export default function Home() {
    return (
        <Layout>
            <div className="showcase">
                <div>

                    {/*<h1>The best way to connect with your friends is with <span className="main-title">AoE II Companion</span></h1>*/}

                    <h1><span className="main-title">AoE II Companion</span></h1>
                    <h3>Track your games now.</h3>
                    <br/>

                    <div className="flex-container flex-row">
                        <a href="https://play.google.com/store/apps/details?id=com.aoe2companion">
                            <img src="/app-button-play-store.png" className="app-button app-button-play-store" />
                        </a>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {/*<a href="https://apps.apple.com/app/id1489505410">*/}
                        <div style={{textAlign: 'center', opacity: 0.7}}>
                            <img src="/app-button-app-store.png" className="app-button app-button-app-store" />
                            <br/>
                            (in near future)
                        </div>
                        {/*</a>*/}
                    </div>
                    <div className="flex-container flex-row align-center github-section">
                        <a target="_blank" href="https://github.com/denniske/aoe2companion" className="github"></a>
                        <a target="_blank" href="https://github.com/denniske/aoe2companion" className="text-link">Visit this project on Github</a>
                    </div>
                </div>

                <div className="spacer"/>

                <div className="phone-container">
                    <AspectRatio ratio="360/718" style={{maxWidth: '400px'}}>
                        <div className="frame"/>
                    </AspectRatio>
                </div>
            </div>
        </Layout>
    )
}
