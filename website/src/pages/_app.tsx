import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import {ThemeProvider} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from "../theme";
import Layout from "../components/layout";
import {Environment, IHostService, IHttpService, OS, registerService, SERVICE_NAME} from "@nex/data";

import '../styles.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
// import 'antd/dist/antd.css';

class HostService implements IHostService {
    getPlatform(): OS {
        return 'web';
    }

    getEnvironment(): Environment {
        return process.env.NEXT_PUBLIC_ENVIRONMENT as Environment;
    }
}

class HttpService implements IHttpService {
    async fetchJson(title: string, input: RequestInfo, init?: RequestInit) {
        if (init) {
            console.log(input, init);
        } else {
            console.log(input);
        }
        let response = null;
        try {
            response = await fetch(input, init);
            return await response.json();
        } catch (e) {
            console.log(input, 'failed', response?.status);
        }
    }
}

registerService(SERVICE_NAME.HOST_SERVICE, new HostService());
registerService(SERVICE_NAME.HTTP_SERVICE, new HttpService());

function MyApp(props) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

    return (
    <React.Fragment>
      <Head>
        <title>AoE II Companion</title>
        <link rel="icon" type="image/png" href="/favicon-16x16.png?v=200706014637" sizes="16x16"/>
        <link rel="icon" type="image/png" href="/favicon-32x32.png?v=200706014637" sizes="32x32"/>
        <link rel="icon" type="image/png" href="/favicon-96x96.png?v=200706014637" sizes="96x96"/>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <
            // @ts-ignore
            Layout>
            {/*<NoSsr>*/}
                <Component {...pageProps} />
            {/*</NoSsr>*/}
        </Layout>
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

// MyApp.getInitialProps = async ({ req }) => {
//     return {  };
// }

export default MyApp;

// export async function getInitialProps(appContext) {
//     return {};
//     // calls page's `getInitialProps` and fills `appProps.pageProps`
//     // const appProps = await App.getInitialProps(appContext);
//     //
//     // return { ...appProps }
// }