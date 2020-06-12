
let mycache: any = {
    user: {

    },
    // auth: {
    //     // steam_id: null,
    //     // profile_id: null,
    // }
};





export function setcache(value: any) {
    mycache = value;
    console.log('setcache', value);
}

export function getcache() {
    console.log('getcache', mycache);
    return mycache;
}



