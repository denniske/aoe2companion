import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from "../theme";
import Layout from "../components/layout";
import NoSsr from "@material-ui/core/NoSsr";

import '../styles.css'


export default function MyApp(props) {
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
        <Layout>
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
