
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




let mylanguage: any = 'en';


export function setInternalLanguage(value: any) {
    mylanguage = value;
    // console.log('setlanguage');
    // console.log('setlanguage', value);
}

export function getInternalLanguage() {
    // console.log('getlanguage', mylanguage);
    // console.log('getlanguage');
    return mylanguage;
}


let internalAoeStrings: any = {};

export function getInternalAoeStrings() {
    // console.log('getlanguage', mylanguage);
    // console.log('getInternalAoeStrings');
    return internalAoeStrings;
}
