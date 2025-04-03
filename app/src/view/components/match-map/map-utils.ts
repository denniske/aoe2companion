

// const units = analysis.players.flatMap((p) => {
//     return p.objects?.filter(o => o.name === 'Villager').map(o => ({
//         x: o.position.x,
//         y: o.position.y,
//         color: p.color,
//     }));
// }).filter(x => x);

// Flare is when a player can see enemy so that these positions are seen
// from the beginning of the game
// (and for allies I think)

// Sheep are sometimes gaia and when game starts become player sheep
// Gurjaras start with two Forage Bushes



// useEffect(() => {
//     const interval = setInterval(() => {
//         console.log('Time:', time.value);
//     }, 500);
//
//     return () => clearInterval(interval);
// }, []);


export const gaiaObjects: Record<string, { names: string[]; objectIds?: number[]; color: string }> = {
    bush: {
        names: [
            'Forage Bush', 'Fruit Bush',
        ],
        color: '#A5C56C',
    },
    gold: {
        names: [
            'Gold Mine',
        ],
        color: '#FFC700',
    },
    stone: {
        names: [
            'Stone Mine',
        ],
        color: '#919191',
    },
    animal: {
        names: [
            'Cow A',
            'Cow B',
            'Cow C',
            'Cow D',
            'Crocodile',
            'Deer',
            'Dire Wolf',
            'Elephant',
            // 'Falcon',
            'Goose',
            // 'Hawk',
            // 'Horse A',
            // 'Horse B',
            // 'Horse C',
            // 'Horse D',
            // 'Horse E',
            'Ibex',
            'Jaguar',
            'Javelina',
            'Komodo Dragon',
            'Lion',
            'Llama',
            // 'Macaw',
            'Ostrich',
            // 'Penguin',
            'Pig',
            'Rabid Wolf',
            'Rhinoceros',
            'Sheep',
            // 'Seagulls',
            'Snow Leopard',
            // 'Stork',
            'Tiger',
            'Turkey',
            // 'Vulture',
            'Water Buffalo',
            'Wild Bactrian Camel',
            'Wild Boar',
            'Wild Camel',
            'Wild Horse',
            'Wolf',
            'Zebra',
        ],
        objectIds: [
            // some names are undefined need to know object id
            // Hunnic Horse
            1869,
            // Gazelle
            1796,
            // Mouflon
            2340,
        ],
        color: '#A5C56C',
    },
    fish: {
        names: [
            'Box Turtles',
            'Dolphin',
            'Fish (Dorado)',
            'Fish (Perch)',
            'Fish (Salmon)',
            'Fish (Snapper)',
            'Fish (Tuna)',
            'Great Fish (Marlin)',
            'Shore Fish',
        ],
        // color: 'red',
        color: '#A5C56C',
    },
    relic: {
        names: [
            'Relic',
        ],
        color: '#FFF',
    },
    oysters: {
        names: [],
        objectIds: [
            // some names are undefined need to know object id
            // Oysters
            2170,
        ],
        color: '#FFF',
    },
};
