import React from 'react';
import {alpha, makeStyles, useTheme} from '@material-ui/core/styles';

// import Link from "../components/link";
import {useAppStyles} from "./app-styles";
import Link from "next/link";
import {appConfig} from "@nex/dataset";
import {useApollo} from "../../apollo/client2";
import {ApolloProvider} from "@apollo/client";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    toolbar2: {
        maxWidth: 800,
        marginBottom: theme.spacing(3),
    },
    toolbarPadding: {
        // paddingLeft: 24,
        // paddingRight: 24,
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        alignItems: 'center',
        display: 'flex',
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        paddingBottom: 0,
        display: 'flex',
        flexDirection: 'column',
    },
    mainIcon: {
        width: 28,
        height: 28,
        marginRight: theme.spacing(1),
    },
    mainText: {
        marginTop: 2,
    },
    iconContainer: {
        width: 30,
        justifyContent: 'center',
        display: 'flex',
    },
    icon: {
        fontSize: 18,
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },

    mainMenu: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
    },
    mainMenuItem: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
    },



}));

// https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/

function Layout(props) {
    const {children, pageProps} = props;
    const classes = useStyles();
    const appClasses = useAppStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const appSlug = appConfig.app.slug;
    // console.log('layout appConfig.app.slug', appConfig.app.slug);

    const apolloClient = useApollo(pageProps);

    // const router = useRouter();
    //
    // const handleDrawerToggle = () => {
    //     setMobileOpen(!mobileOpen);
    // };
    //
    // const preventDefault = (event) => event.preventDefault();
    //
    // const drawer = (
    //     <div>
    //         <div className={classes.toolbar + ' ' + classes.toolbarPadding}>
    //             <img src="/icon.png" alt="my image" className={classes.mainIcon} />
    //             <Typography variant="body1" className={classes.mainText} noWrap>
    //                 AoE II Companion
    //             </Typography>
    //         </div>
    //         <Divider />
    //         <List>
    //             {/*<ListItem button component={Link as any} href='/profile/[id]' as={`/profile/886872`} naked>*/}
    //             <ListItem button component={Link as any} href='/profile/[id]' as={`/profile/251265`} naked>
    //                 <ListItemIcon><div className={classes.iconContainer}><FontAwesomeIcon icon={faUser} className={classes.icon} /></div></ListItemIcon>
    //                 <ListItemText primary="Me" />
    //             </ListItem>
    //         </List>
    //         <Divider />
    //         <List>
    //             <ListItem button component={Link as any} href="/leaderboard" naked>
    //                 <ListItemIcon><div className={classes.iconContainer}><FontAwesomeIcon icon={faTrophy} className={classes.icon} /></div></ListItemIcon>
    //                 <ListItemText primary="Leaderboard" />
    //             </ListItem>
    //         </List>
    //         <Divider />
    //         <List>
    //             <ListItem button component={Link as any} href="/civilization" naked>
    //                 <ListItemIcon><div className={classes.iconContainer}><FontAwesomeIcon icon={faLandmark} className={classes.icon} /></div></ListItemIcon>
    //                 <ListItemText primary="Civilizations" />
    //             </ListItem>
    //             <ListItem button component={Link as any} href="/building" naked>
    //                 <ListItemIcon><div className={classes.iconContainer}><FontAwesomeIcon icon={faArchway} className={classes.icon} /></div></ListItemIcon>
    //                 <ListItemText primary="Buildings" />
    //             </ListItem>
    //             <ListItem button component={Link as any} href="/unit" naked>
    //                 <ListItemIcon><div className={classes.iconContainer}><FontAwesomeIcon icon={faFistRaised} className={classes.icon} /></div></ListItemIcon>
    //                 <ListItemText primary="Units" />
    //             </ListItem>
    //             <ListItem button component={Link as any} href="/tech" naked>
    //                 <ListItemIcon><div className={classes.iconContainer}><FontAwesomeIcon icon={faFlask} className={classes.icon} /></div></ListItemIcon>
    //                 <ListItemText primary="Techs" />
    //             </ListItem>
    //         </List>
    //         <Divider />
    //         <List>
    //             <ListItem button component={Link as any} href="https://www.buymeacoffee.com/denniskeil" naked target="_blank">
    //                 <ListItemIcon><div className={classes.iconContainer}><FontAwesomeIcon icon={faCoffee} className={classes.icon} /></div></ListItemIcon>
    //                 <ListItemText primary="Buy me a coffee" />
    //             </ListItem>
    //         </List>
    //         <List>
    //             <ListItem button component={Link as any} href="https://discord.com/invite/gCunWKx" naked target="_blank">
    //                 <ListItemIcon><div className={classes.iconContainer}><FontAwesomeIcon icon={faHandsHelping} className={classes.icon} /></div></ListItemIcon>
    //                 <ListItemText primary="Help" />
    //             </ListItem>
    //         </List>
    //     </div>
    // );


    return (
        <ApolloProvider client={apolloClient}>
        <div className={classes.root}>

            {/*<AppBar position="fixed" className={classes.appBar} color="inherit">*/}
            {/*    <Toolbar>*/}
            {/*        <IconButton*/}
            {/*            color="inherit"*/}
            {/*            aria-label="open drawer"*/}
            {/*            edge="start"*/}
            {/*            onClick={handleDrawerToggle}*/}
            {/*            className={classes.menuButton}*/}
            {/*        >*/}
            {/*            <MenuIcon />*/}
            {/*        </IconButton>*/}

            {/*        <Search />*/}

            {/*        /!*<div className={classes.search}>*!/*/}
            {/*        /!*    <div className={classes.searchIcon}>*!/*/}
            {/*        /!*        <SearchIcon />*!/*/}
            {/*        /!*    </div>*!/*/}
            {/*        /!*    <InputBase*!/*/}
            {/*        /!*        placeholder="Search…"*!/*/}
            {/*        /!*        classes={{*!/*/}
            {/*        /!*            root: classes.inputRoot,*!/*/}
            {/*        /!*            input: classes.inputInput,*!/*/}
            {/*        /!*        }}*!/*/}
            {/*        /!*        inputProps={{ 'aria-label': 'search' }}*!/*/}
            {/*        /!*    />*!/*/}
            {/*        /!*</div>*!/*/}

            {/*        /!*<Typography variant="h6" noWrap>*!/*/}
            {/*        /!*    Responsive drawer*!/*/}
            {/*        /!*</Typography>*!/*/}
            {/*    </Toolbar>*/}
            {/*</AppBar>*/}

            {/*<nav className={classes.drawer} aria-label="mailbox folders">*/}
            {/*    /!* The implementation can be swapped with js to avoid SEO duplication of links. *!/*/}
            {/*    <Hidden smUp implementation="css">*/}
            {/*        <Drawer*/}
            {/*            variant="temporary"*/}
            {/*            anchor={theme.direction === 'rtl' ? 'right' : 'left'}*/}
            {/*            open={mobileOpen}*/}
            {/*            onClose={handleDrawerToggle}*/}
            {/*            classes={{*/}
            {/*                paper: classes.drawerPaper,*/}
            {/*            }}*/}
            {/*            ModalProps={{*/}
            {/*                keepMounted: true, // Better open performance on mobile.*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            {drawer}*/}
            {/*        </Drawer>*/}
            {/*    </Hidden>*/}
            {/*    <Hidden xsDown implementation="css">*/}
            {/*        <Drawer*/}
            {/*            classes={{*/}
            {/*                paper: classes.drawerPaper,*/}
            {/*            }}*/}
            {/*            variant="permanent"*/}
            {/*            open*/}
            {/*        >*/}
            {/*            {drawer}*/}
            {/*        </Drawer>*/}
            {/*    </Hidden>*/}
            {/*</nav>*/}


            {/*<main className={classes.content}>*/}
            {/*    <div className={classes.toolbar} />*/}

            {/*    {*/}
            {/*        router.pathname != '/app' &&*/}
            {/*        <Paper className={appClasses.boxSmall}>*/}
            {/*            <Grid container justify="space-between"*/}
            {/*                  alignItems="center">*/}
            {/*                <Grid item>*/}
            {/*                    <Typography variant="body1" noWrap>*/}
            {/*                        AoE II Companion App*/}
            {/*                    </Typography>*/}
            {/*                    <Typography variant="subtitle2"  noWrap>*/}
            {/*                        with country leaderboards, push notifications...*/}
            {/*                    </Typography>*/}
            {/*                </Grid>*/}
            {/*                /!*<Grid className={appClasses.expanded}/>*!/*/}
            {/*                <Grid>*/}
            {/*                    <a href="https://play.google.com/store/apps/details?id=com.aoe2companion">*/}
            {/*                        <img src="/app-button-play-store.png" className="app-button app-button-play-store" />*/}
            {/*                    </a>*/}
            {/*                    &nbsp;&nbsp;&nbsp;*/}
            {/*                    <a href="https://apps.apple.com/app/id1518463195">*/}
            {/*                        <img src="/app-button-app-store.png" className="app-button app-button-app-store" />*/}
            {/*                    </a>*/}
            {/*                </Grid>*/}
            {/*            </Grid>*/}

            {/*            /!*<div className={appClasses.flexRow}>*!/*/}
            {/*            /!*    <div>*!/*/}
            {/*            /!*        <Typography variant="body1" noWrap>*!/*/}
            {/*            /!*            AoE II Companion App*!/*/}
            {/*            /!*        </Typography>*!/*/}
            {/*            /!*        <Typography variant="subtitle2"  noWrap>*!/*/}
            {/*            /!*            with country leaderboards, push notifications...*!/*/}
            {/*            /!*        </Typography>*!/*/}
            {/*            /!*    </div>*!/*/}
            {/*            /!*    <div className={appClasses.expanded}/>*!/*/}
            {/*            /!*    <div className="flex-container flex-row justify-content-center">*!/*/}
            {/*            /!*        <a href="https://play.google.com/store/apps/details?id=com.aoe2companion">*!/*/}
            {/*            /!*            <img src="/app-button-play-store.png" className="app-button app-button-play-store" />*!/*/}
            {/*            /!*        </a>*!/*/}
            {/*            /!*        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*!/*/}
            {/*            /!*        <a href="https://apps.apple.com/app/id1518463195">*!/*/}
            {/*            /!*            <img src="/app-button-app-store.png" className="app-button app-button-app-store" />*!/*/}
            {/*            /!*        </a>*!/*/}
            {/*            /!*    </div>*!/*/}
            {/*            /!*</div>*!/*/}
            {/*        </Paper>*/}
            {/*    }*/}

            <div className="container3">

                <div className={classes.mainMenu}>
                    <div className={classes.mainMenuItem}>
                        <Link href='/' as={`/`}>
                            <a>App</a>
                        </Link>
                    </div>
                    {
                        appSlug === 'aoe2companion' &&
                        <div className={classes.mainMenuItem}>
                            <Link href='/ongoing' as={`/ongoing`}>
                                <a>Top 100 Ongoing</a>
                            </Link>
                        </div>
                    }
                    <div className={classes.mainMenuItem}>
                        <Link href='/leaderboard' as={`/leaderboard`}>
                            <a>Leaderboard</a>
                        </Link>
                    </div>
                </div>

                {children}
            </div>

                {/*<div className={appClasses.expanded}/>*/}

                {/*<div className={classes.toolbar2}>*/}
                {/*    This site is not affiliated with or endorsed by Microsoft Corporation. Age of Empires II: HD and Age of Empires II: Definitive Edition are trademarks or registered trademarks of Microsoft Corporation in the U.S. and other countries.*/}
                {/*    <br/>*/}
                {/*    <br/>*/}
                {/*    <Link2 href="/privacy" onClick={preventDefault} color="inherit">*/}
                {/*        Privacy Policy*/}
                {/*    </Link2>*/}
                {/*</div>*/}
            {/*</main>*/}


        </div>
        </ApolloProvider>
    );
}

export default Layout
// export default withApollo(Layout, {ssr:false})
