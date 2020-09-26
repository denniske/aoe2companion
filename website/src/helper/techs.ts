import {getTechName, Tech, techs} from "@nex/data";

export function getTechIcon(tech: Tech) {
    const info = techs[tech];
    if (info.age == 'Castle') {
        return '/techs/UniqueTechCastle.png';
    }
    if (info.age == 'Imperial') {
        return '/techs/UniqueTechImperial.png';
    }
    return '/techs/' + getTechName(tech) + '.png';
}
