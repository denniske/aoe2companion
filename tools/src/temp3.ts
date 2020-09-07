import fetch from "node-fetch";
import fs from "fs";

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function fetchPage(page: number) {
    const offset = page*10;
    const result = await fetch("https://aocrecs.com/api", {
        "headers": {
            "accept": "*/*",
            "accept-language": "de,en;q=0.9,en-US;q=0.8,de-DE;q=0.7",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
        },
        // "referrer": "https://aocrecs.com/api",
        // "referrerPolicy": "no-referrer-when-downgrade",
        "body": "{\"operationName\":null,\"variables\":{},\"query\":\"fragment MatchFragment on Match {\\n  id\\n  duration\\n  duration_secs\\n  played\\n  has_playback\\n  type\\n  rated\\n  diplomacy_type\\n  team_size\\n  map_name\\n  rms_seed\\n  rms_custom\\n  direct_placement\\n  effect_quantity\\n  guard_state\\n  fixed_positions\\n  map_events {\\n    id\\n    name\\n    __typename\\n  }\\n  postgame\\n  platform_match_id\\n  cheats\\n  map_size\\n  map_reveal_choice\\n  minimap_link\\n  population_limit\\n  speed\\n  lock_teams\\n  difficulty\\n  mirror\\n  dataset {\\n    name\\n    __typename\\n  }\\n  platform {\\n    id\\n    name\\n    url\\n    match_url\\n    __typename\\n  }\\n  dataset_version\\n  ladder {\\n    id\\n    platform_id\\n    name\\n    __typename\\n  }\\n  series {\\n    id\\n    name\\n    __typename\\n  }\\n  tournament {\\n    id\\n    name\\n    __typename\\n  }\\n  event {\\n    id\\n    name\\n    __typename\\n  }\\n  version\\n  game_version\\n  save_version\\n  build\\n  winning_team_id\\n  teams {\\n    winner\\n    players {\\n      name\\n      color_id\\n      platform_id\\n      user {\\n        id\\n        name\\n        platform_id\\n        person {\\n          id\\n          country\\n          name\\n          __typename\\n        }\\n        __typename\\n      }\\n      civilization {\\n        id\\n        dataset_id\\n        name\\n        __typename\\n      }\\n      rate_snapshot\\n      mvp\\n      human\\n      winner\\n      score\\n      rate_before\\n      rate_after\\n      military_score\\n      economy_score\\n      technology_score\\n      society_score\\n      units_killed\\n      units_lost\\n      buildings_razed\\n      buildings_lost\\n      units_converted\\n      food_collected\\n      wood_collected\\n      stone_collected\\n      gold_collected\\n      tribute_sent\\n      tribute_received\\n      trade_gold\\n      relic_gold\\n      feudal_time\\n      castle_time\\n      imperial_time\\n      explored_percent\\n      research_count\\n      total_wonders\\n      total_castles\\n      total_relics\\n      villager_high\\n      __typename\\n    }\\n    __typename\\n  }\\n  files {\\n    id\\n    download_link\\n    original_filename\\n    size\\n    owner {\\n      name\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\n{\\n  a: person(id: 90) {\\n    id\\n    name\\n    country\\n    first_name\\n    last_name\\n    matches(order: \\\"matches.played\\\", offset: " + offset + ", limit: 10) {\\n      count\\n      hits {\\n        ...MatchFragment\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  b: match(id: 36913050) {\\n    id\\n  }\\n  c: match(id: 35773188) {\\n    id\\n  }\\n  d: match(id: 35769206) {\\n    id\\n  }\\n}\\n\"}",
        "method": "POST",
        // "mode": "cors",
        // "credentials": "omit"
    });
    const data = await result.json();
    console.log(page, offset, data.data.a.matches.hits.length);
    return data.data.a.matches.hits;
}



async function loadStrings() {
    const matches: any = [];
    for (let i = 0; i < 10000; i++) {
        console.log("Loading strings for " + i);
        const newMatches = await fetchPage(i);
        matches.push(...newMatches);
        await sleep(50);
        if (newMatches.length === 0) break;
    }
    console.log('matches.length', matches.length);
    fs.writeFileSync("matches.json", JSON.stringify(matches, null, 4));
}

loadStrings();

