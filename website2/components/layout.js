import Head from 'next/head'
import AspectRatio from 'react-aspect-ratio';
import Link from 'next/link'

export default function Layout(props) {
    return (
        <div className="container2">
            <Head>
                <title>AoE II Companion</title>
                <link rel="icon" type="image/png" href="/favicon-16x16.png?v=200706014637" sizes="16x16"/>
                <link rel="icon" type="image/png" href="/favicon-32x32.png?v=200706014637" sizes="32x32"/>
                <link rel="icon" type="image/png" href="/favicon-96x96.png?v=200706014637" sizes="96x96"/>
            </Head>

            <main>
                <div className="container">
                    {props.children}
                </div>
            </main>

            <footer>
                <div className="container flex-container flex-row flex-1">
                    <Link href="/privacy"><a>Privacy Policy</a></Link>
                </div>
            </footer>

            <style jsx>{`
      
        .container2 {
          min-height: 100vh;
          padding: 0 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }
      `}</style>
        </div>
    )
}
