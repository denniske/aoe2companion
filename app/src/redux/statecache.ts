
let mycache: any = undefined;


export function setcache(value: any) {
    mycache = value;
    // console.log('setcache');
    // console.log('setcache', value);
}

export function getcache() {
    // console.log('getcache', mycache);
    // console.log('getcache');
    return mycache;
}





let internalAoeStrings: any = {};

export function getInternalAoeStrings() {
    // console.log('getlanguage', mylanguage);
    // console.log('getInternalAoeStrings');
    return internalAoeStrings;
}
