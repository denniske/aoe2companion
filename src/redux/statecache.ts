
let mycache: any = {
    user: { },
    leaderboard: { },
};






export function setcache(value: any) {
    mycache = value;
    console.log('setcache');
    // console.log('setcache', value);
}

export function getcache() {
    // console.log('getcache', mycache);
    console.log('getcache');
    return mycache;
}



