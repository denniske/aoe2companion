import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import {createTheme, ThemeProvider} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Layout from "../components/layout";
import {
    Environment, IHostService, IHttpService, IStrings, ITranslationService, OS, registerService, SERVICE_NAME
} from "@nex/data";

import '../styles.css'
import 'react-aspect-ratio/aspect-ratio.css'
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { getString } from '../helper/strings';
import {appConfig} from "@nex/dataset";
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

class AoeDataService implements ITranslationService {
    getUiTranslation(str: string): string {
        return str; //'???'; //getTranslation(str as any);
    }
    getAoeString(str: string): string {
        return '???'; //getInternalAoeString(str);
    }
    getString(category: keyof IStrings, id: number) {
        return getString(category, id);
    }
    getLanguage(): string {
        return '???'; //getInternalLanguage();
    }
}

registerService(SERVICE_NAME.TRANSLATION_SERVICE, new AoeDataService(), true);
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

    const prefersDarkMode = false;//useMediaQuery('(prefers-color-scheme: dark)');

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    type: prefersDarkMode ? 'dark' : 'light',
                },
            }),
        [prefersDarkMode],
    );

    const appName = appConfig.app.name;

    return (
    <React.Fragment>
      <Head>
        <title>{appName}</title>
        <link rel="icon" type="image/png" href="/favicon-16x16.png?v=200706014637" sizes="16x16"/>
        <link rel="icon" type="image/png" href="/favicon-32x32.png?v=200706014637" sizes="32x32"/>
        <link rel="icon" type="image/png" href="/favicon-96x96.png?v=200706014637" sizes="96x96"/>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <
            // @ts-ignore
            Layout pageProps={pageProps}>
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
