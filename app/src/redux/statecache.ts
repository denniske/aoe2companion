
let mycache: any = undefined;


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




let mylanguage: any = 'en';


export function setlanguage(value: any) {
    mylanguage = value;
    // console.log('setlanguage');
    // console.log('setlanguage', value);
}

export function getlanguage() {
    // console.log('getlanguage', mylanguage);
    // console.log('getlanguage');
    return mylanguage;
}

