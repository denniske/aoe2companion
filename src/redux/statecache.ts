
let mycache: any = [];

export function setcache(value: any) {
    mycache = value;
    console.log('setcache', value);
}

export function getcache() {
    console.log('getcache', mycache);
    return mycache;
}

