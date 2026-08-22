import { appConfig } from '@nex/dataset';

import { match1v1 as match1v1Aoe2 } from './aoe2/match-1v1';
import { match2v2 as match2v2Aoe2 } from './aoe2/match-2v2';
import { match2v2v1v1v1v1 as match2v2v1v1v1v1Aoe2 } from './aoe2/match-2v2v1v1v1v1';
import { match2v2v2v2 as match2v2v2v2Aoe2 } from './aoe2/match-2v2v2v2';
import { match4v4 as match4v4Aoe2 } from './aoe2/match-4v4';
import { matchFFA as matchFFAAoe2 } from './aoe2/match-ffa';
import { matchUneven as matchUnevenAoe2 } from './aoe2/match-uneven';

import { match1v1 as match1v1Aoe4 } from './aoe4/match-1v1';
import { match2v2 as match2v2Aoe4 } from './aoe4/match-2v2';
import { match2v2v1v1v1v1 as match2v2v1v1v1v1Aoe4 } from './aoe4/match-2v2v1v1v1v1';
import { match2v2v2v2 as match2v2v2v2Aoe4 } from './aoe4/match-2v2v2v2';
import { match4v4 as match4v4Aoe4 } from './aoe4/match-4v4';
import { matchFFA as matchFFAAoe4 } from './aoe4/match-ffa';
import { matchUneven as matchUnevenAoe4 } from './aoe4/match-uneven';

// Both games carry the same seven layouts, differing only in civs, maps and players. Picking here
// rather than at the import site keeps the live activity test harness on whichever game was built,
// instead of showing aoe2 civs on an aoe4 device.
const isAoe2 = appConfig.game === 'aoe2';

export const match1v1 = isAoe2 ? match1v1Aoe2 : match1v1Aoe4;
export const match2v2 = isAoe2 ? match2v2Aoe2 : match2v2Aoe4;
export const match2v2v1v1v1v1 = isAoe2 ? match2v2v1v1v1v1Aoe2 : match2v2v1v1v1v1Aoe4;
export const match2v2v2v2 = isAoe2 ? match2v2v2v2Aoe2 : match2v2v2v2Aoe4;
export const match4v4 = isAoe2 ? match4v4Aoe2 : match4v4Aoe4;
export const matchFFA = isAoe2 ? matchFFAAoe2 : matchFFAAoe4;
export const matchUneven = isAoe2 ? matchUnevenAoe2 : matchUnevenAoe4;

export { reducePayload } from './demo-helper';
