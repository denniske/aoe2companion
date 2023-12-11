import ActivityKit
import Foundation
import SwiftUI
import WidgetKit

struct MyActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var data: String
    }
}

struct Player: Codable {
    let id: Int
    let name: String
    let civilization: String
    let rating: Int
    let color: Int
    let image: String
}

struct Team: Codable {
    let teamId: Int
    let players: [Player]
}

struct Information: Codable {
    let matchId: Int
    let map: String
    let mapImage: String
    let leaderboard: String
    let currentPlayerId: Int
    let startTime: Int
    let teams: [Team]
}

// Data are sent as a string, so we need to convert it to a struct
func toJson(dataString: String) -> Information {
    let decoder = JSONDecoder()
    let stateData = Data(dataString.utf8)
    let data = try? decoder.decode(Information.self, from: stateData)

    return data
        ?? Information(
            matchId: 0, map: "", mapImage: "", leaderboard: "", currentPlayerId: 0,
            startTime: Int(Date().timeIntervalSince1970), teams: [])
}

@available(iOS 16.1, *)
struct LiveGameWidget: Widget {
    let kind: String = "LiveGame"

    var body: some WidgetConfiguration {
        ActivityConfiguration(for: MyActivityAttributes.self) { context in
            let game = toJson(dataString: context.state.data)
            let opponents = game.teams.map { "\($0.players.count)" }
            let opponentsCount = opponents.joined(separator: "v")
            let startTime = Date(timeIntervalSince1970: TimeInterval(game.startTime))
            let lastId = game.teams.last?.teamId
            let suffix = game.teams.count - 4
            let teams =
                suffix > 0
                ? [game.teams.prefix(4), game.teams.suffix(suffix)] : [game.teams.prefix(4)]

            return VStack(spacing: 8) {
                HStack(alignment: .center) {
                    Text(game.map).font(.system(size: 16, weight: .bold)).lineLimit(1)
                    Text("\(game.leaderboard) \(opponentsCount)").font(.system(size: 14))
                    Text(startTime, style: .timer).contentTransition(.identity).font(
                        .system(size: 14)
                    ).lineLimit(1).multilineTextAlignment(
                        .trailing
                    ).monospacedDigit().frame(width: 60)
                }

                VStack(spacing: 16) {
                    ForEach(teams.indices, id: \.self) { teamGroup in
                        HStack(alignment: .center) {
                            ForEach(teams[teamGroup], id: \.teamId) { team in
                                VStack(alignment: .leading, spacing: 4) {
                                    ForEach(team.players.prefix(4), id: \.id) { p in
                                        HStack(alignment: .center, spacing: 4) {
                                            NetworkImage(url: URL(string: p.image)).frame(
                                                width: 20, height: 20)

                                            Text(p.name).font(
                                                .system(
                                                    size: 14,
                                                    weight: p.id == game.currentPlayerId
                                                        ? .bold : .regular)
                                            ).lineLimit(1)
                                            if game.teams.count < 3 {
                                                Text(verbatim: "(\(p.rating))").font(
                                                    .system(size: 14))
                                            }
                                        }
                                    }
                                    if team.players.count > 4 {
                                        HStack {
                                            Text("And \(team.players.count - 4) more...").font(
                                                .system(
                                                    size: 14))

                                        }.padding([.leading], 24)
                                    }
                                }
                                if team.teamId != lastId {
                                    Spacer()
                                }
                            }
                        }
                    }
                }
            }.padding(15).foregroundColor(Color(UIColor.label))
                .activityBackgroundTint(nil)
        } dynamicIsland: { context in
            let game = toJson(dataString: context.state.data)
            let opponents = game.teams.map { "\($0.players.count)" }
            let opponentsCount = opponents.joined(separator: "v")
            let startTime = Date(timeIntervalSince1970: TimeInterval(game.startTime))
            let lastId = game.teams.last?.teamId
            let suffix = game.teams.count - 4
            let teams =
                suffix > 0
                ? [game.teams.prefix(4), game.teams.suffix(suffix)] : [game.teams.prefix(4)]

            return DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    VStack(alignment: .trailing) {
                        Text(game.map).font(.system(size: 14)).lineLimit(1)
                    }.frame(maxWidth: .infinity, alignment: .trailing)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text(startTime, style: .timer).contentTransition(.identity).font(
                        .system(size: 14)
                    ).multilineTextAlignment(
                        .leading
                    ).monospacedDigit()
                }

                DynamicIslandExpandedRegion(.center) {
                    HStack(alignment: .center) {
                        Text(opponentsCount).font(.system(size: 14))
                        Text(game.leaderboard).font(.system(size: 14, weight: .bold))
                            .foregroundColor(
                                Color(UIColor.secondaryLabel))
                    }
                }
                DynamicIslandExpandedRegion(.bottom) {
                    VStack(spacing: 16) {
                        ForEach(teams.indices, id: \.self) { teamGroup in
                            HStack(alignment: .center) {
                                ForEach(teams[teamGroup], id: \.teamId) { team in
                                    VStack(alignment: .leading, spacing: 4) {
                                        ForEach(
                                            team.players.prefix(team.players.count > 4 ? 3 : 8),
                                            id: \.id
                                        ) { p in
                                            HStack(alignment: .center, spacing: 3) {
                                                NetworkImage(url: URL(string: p.image)).frame(
                                                    width: 15, height: 15)
                                                Text(p.name).font(
                                                    .system(
                                                        size: 14,
                                                        weight: p.id == game.currentPlayerId
                                                            ? .bold : .regular)
                                                ).lineLimit(1)
                                                if game.teams.count < 3 {
                                                    Text(verbatim: "(\(p.rating))").font(
                                                        .system(size: 14))
                                                }
                                            }
                                        }
                                        if team.players.count > 4 {
                                            HStack {
                                                Text("And \(team.players.count - 3) more...").font(
                                                    .system(
                                                        size: 14))
                                            }.padding([.leading], 18)
                                        }
                                    }

                                    if team.teamId != lastId {
                                        Spacer()
                                    }
                                }
                            }

                        }

                    }.frame(maxWidth: .infinity, maxHeight: .infinity)
                }
            } compactLeading: {
                NetworkImage(url: URL(string: game.mapImage)).frame(
                    width: 25, height: 25)

            } compactTrailing: {
                Text(startTime, style: .timer).contentTransition(.identity)
                    .font(.system(size: 14)).multilineTextAlignment(
                        .trailing
                    ).monospacedDigit().frame(width: 60)
            } minimal: {
                NetworkImage(url: URL(string: game.mapImage)).frame(
                    width: 25, height: 25)
            }
        }
    }
}

#if DEBUG
    let ffaData =
        "{\"matchId\":1,\"map\":\"Black Forest\",\"mapImage\":\"https://aoe2companion.com/aoe2/de/maps/cm_generic.png\",\"leaderboard\":\"Unranked\",\"currentPlayerId\":2302541,\"startTime\":1702593089,\"teams\":[{\"teamId\":1,\"players\":[{\"id\":1120179,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/aztecs.png\",\"name\":\"SCHOOLBABTOO\",\"civilization\":\"Aztecs\",\"rating\":1104,\"color\":6}]},{\"teamId\":2,\"players\":[{\"id\":524382,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/japanese.png\",\"name\":\"Tom Servoclaus\",\"civilization\":\"Japanese\",\"rating\":1345,\"color\":4}]},{\"teamId\":3,\"players\":[{\"id\":2302541,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/mongols.png\",\"name\":\"Sonny\",\"civilization\":\"Mongols\",\"rating\":1461,\"color\":5}]},{\"teamId\":4,\"players\":[{\"id\":2368205,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/goths.png\",\"name\":\"DavidLinan8\",\"civilization\":\"Goths\",\"rating\":1323,\"color\":3}]},{\"teamId\":5,\"players\":[{\"id\":9940724,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/sicilians.png\",\"name\":\"lejsekl\",\"civilization\":\"Sicilians\",\"rating\":1049,\"color\":7}]},{\"teamId\":6,\"players\":[{\"id\":14947107,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/slavs.png\",\"name\":\"Apache97\",\"civilization\":\"Slavs\",\"rating\":1214,\"color\":2}]},{\"teamId\":7,\"players\":[{\"id\":430968,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/bohemians.png\",\"name\":\"letzteOlung\",\"civilization\":\"Bohemians\",\"rating\":1536,\"color\":1}]},{\"teamId\":8,\"players\":[{\"id\":12718464,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/tatars.png\",\"name\":\"Fiwhe\",\"civilization\":\"Tatars\",\"rating\":1163,\"color\":8}]}]}"
    let unevenTeams =
        "{\"matchId\":1,\"map\":\"Black Forest\",\"mapImage\":\"https://aoe2companion.com/aoe2/de/maps/cm_generic.png\",\"leaderboard\":\"Unranked\",\"currentPlayerId\":2302541,\"startTime\":1702593089,\"teams\":[{\"teamId\":1,\"players\":[{\"id\":1120179,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/aztecs.png\",\"name\":\"SCHOOLBABTOO\",\"civilization\":\"Aztecs\",\"rating\":1104,\"color\":6},{\"id\":524382,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/japanese.png\",\"name\":\"Tom Servoclaus\",\"civilization\":\"Japanese\",\"rating\":1345,\"color\":4},{\"id\":2302541,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/mongols.png\",\"name\":\"Sonny\",\"civilization\":\"Mongols\",\"rating\":1461,\"color\":5},{\"id\":2368205,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/goths.png\",\"name\":\"DavidLinan8\",\"civilization\":\"Goths\",\"rating\":1323,\"color\":3},{\"id\":9940724,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/sicilians.png\",\"name\":\"lejsekl\",\"civilization\":\"Sicilians\",\"rating\":1049,\"color\":7},{\"id\":14947107,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/slavs.png\",\"name\":\"Apache97\",\"civilization\":\"Slavs\",\"rating\":1214,\"color\":2},{\"id\":430968,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/bohemians.png\",\"name\":\"letzteOlung\",\"civilization\":\"Bohemians\",\"rating\":1536,\"color\":1}]},{\"teamId\":2,\"players\":[{\"id\":12718464,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/tatars.png\",\"name\":\"Fiwhe\",\"civilization\":\"Tatars\",\"rating\":1163,\"color\":8}]}]}"
    let teamsOfTwoData =
        "{\"matchId\":1,\"map\":\"Land Nomad\",\"mapImage\":\"https://aoe2companion.com/aoe2/de/maps/cm_generic.png\",\"leaderboard\":\"Unranked\",\"currentPlayerId\":2302541,\"startTime\":1702593089,\"teams\":[{\"teamId\":2,\"players\":[{\"id\":15015937,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/magyars.png\",\"name\":\"NO RULES\",\"civilization\":\"Magyars\",\"rating\":1143,\"color\":2},{\"id\":11643661,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/teutons.png\",\"name\":\"owinso\",\"civilization\":\"Teutons\",\"rating\":1267,\"color\":5}]},{\"teamId\":3,\"players\":[{\"id\":1488527,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/spanish.png\",\"name\":\"1688Chi\",\"civilization\":\"Spanish\",\"rating\":1439,\"color\":6},{\"id\":11528893,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/tatars.png\",\"name\":\"MARK888\",\"civilization\":\"Tatars\",\"rating\":1380,\"color\":4}]},{\"teamId\":4,\"players\":[{\"id\":15439660,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/lithuanians.png\",\"name\":\"Mehmet Han Adam\",\"civilization\":\"Lithuanians\",\"rating\":1179,\"color\":7},{\"id\":1320474,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/persians.png\",\"name\":\"africabytoto42\",\"civilization\":\"Persians\",\"rating\":1207,\"color\":1}]},{\"teamId\":5,\"players\":[{\"id\":3087404,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/malians.png\",\"name\":\"Sam4995\",\"civilization\":\"Malians\",\"rating\":1220,\"color\":8},{\"id\":2302541,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/sicilians.png\",\"name\":\"Sonny\",\"civilization\":\"Sicilians\",\"rating\":1467,\"color\":3}]}]}"
    let teamsOfFourData =
        "{\"matchId\":1,\"map\":\"Arabia\",\"mapImage\":\"https://aoe2companion.com/aoe2/de/maps/cm_generic.png\",\"leaderboard\":\"Team Random Map\",\"currentPlayerId\":2302541,\"startTime\":1702593089,\"teams\":[{\"teamId\":2,\"players\":[{\"id\":872392,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/poles.png\",\"name\":\"tchesgos\",\"civilization\":\"Poles\",\"rating\":1256,\"color\":6},{\"id\":1980524,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/mayans.png\",\"name\":\"[TBArg] Search088\",\"civilization\":\"Mayans\",\"rating\":1287,\"color\":8},{\"id\":8169901,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/franks.png\",\"name\":\"Reluctance\",\"civilization\":\"Franks\",\"rating\":1336,\"color\":4},{\"id\":9067043,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/britons.png\",\"name\":\"ThiaGO\",\"civilization\":\"Britons\",\"rating\":1350,\"color\":2}]},{\"teamId\":3,\"players\":[{\"id\":10993790,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/huns.png\",\"name\":\"FABU\",\"civilization\":\"Huns\",\"rating\":1314,\"color\":3},{\"id\":17853938,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/mayans.png\",\"name\":\"Maxell\",\"civilization\":\"Mayans\",\"rating\":1103,\"color\":1},{\"id\":3802661,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/magyars.png\",\"name\":\"muskovit\",\"civilization\":\"Magyars\",\"rating\":1329,\"color\":5},{\"id\":2302541,\"image\":\"http://192.168.7.185:8081/assets/app/assets/civilizations/de/ethiopians.png\",\"name\":\"Sonny\",\"civilization\":\"Ethiopians\",\"rating\":1251,\"color\":7}]}]}"

    @available(iOSApplicationExtension 16.2, *)
    struct LiveGameWidget_Previews: PreviewProvider {

        static var previews: some View {
            Group {
                MyActivityAttributes()
                    .previewContext(
                        MyActivityAttributes.ContentState(
                            data: ffaData
                        ),
                        viewKind: .content
                    )
                MyActivityAttributes()
                    .previewContext(
                        MyActivityAttributes.ContentState(
                            data: ffaData
                        ),
                        viewKind: .dynamicIsland(.expanded)
                    )
            }
        }
    }
#endif
