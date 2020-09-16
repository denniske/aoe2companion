import '../styles.css'
import 'react-aspect-ratio/aspect-ratio.css'

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'antd/dist/antd.css';

export default function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />
}

