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
}

struct Team: Codable {
    let teamId: Int
    let players: [Player]
}

struct Information: Codable {
    let map: String
    let leaderboard: String
    let currentPlayerId: Int
    let teams: [Team]
}

// Data are sent as a string, so we need to convert it to a struct
func toJson(dataString: String) -> Information {
    let decoder = JSONDecoder()
    let stateData = Data(dataString.utf8)
    let data = try? decoder.decode(Information.self, from: stateData)

    return data ?? Information(map: "", leaderboard: "", currentPlayerId: 0, teams: [])
}

@available(iOS 16.1, *)
struct LiveGameWidget: Widget {
    let kind: String = "LiveGame"

    var body: some WidgetConfiguration {
        ActivityConfiguration(for: MyActivityAttributes.self) { context in
            let game = toJson(dataString: context.state.data)
            let opponents = game.teams.map { "\($0.players.count)" }
            let opponentsCount = opponents.joined(separator: "v")
            let players = game.teams.flatMap { $0.players }
            let opponent = players.first(where: { $0.id != game.currentPlayerId })
            let opponentString =
                opponent != nil ? "vs \(opponent?.name ?? "") (\(opponent?.rating ?? 0))" : ""
            let player = players.first(where: { $0.id == game.currentPlayerId })

            return VStack(spacing: 8) {
                HStack(alignment: .center) {
                    Text(game.map).font(.system(size: 14, weight: .bold))
                    Text(opponentsCount).font(.system(size: 14))
                    Text(opponentString).font(.system(size: 14, weight: .bold)).foregroundColor(
                        Color(UIColor.secondaryLabel))
                }

                HStack(alignment: .center) {
                    Text(player?.civilization ?? "").font(.system(size: 14, weight: .bold))
                    Text(game.leaderboard).font(.system(size: 14))
                }
            }.frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top).padding(10)
        } dynamicIsland: { context in
            let game = toJson(dataString: context.state.data)
            let opponents = game.teams.map { "\($0.players.count)" }
            let opponentsCount = opponents.joined(separator: "v")
            let players = game.teams.flatMap { $0.players }
            let opponent = players.first(where: { $0.id != game.currentPlayerId })
            let opponentString =
                opponent != nil ? "vs \(opponent?.name ?? "") (\(opponent?.rating ?? 0))" : ""
            let player = players.first(where: { $0.id == game.currentPlayerId })

            return DynamicIsland {
                DynamicIslandExpandedRegion(.bottom) {
                    VStack(spacing: 8) {
                        HStack(alignment: .center) {
                            Text(game.map).font(.system(size: 14, weight: .bold))
                            Text(opponentsCount).font(.system(size: 14))
                            Text(opponentString).font(.system(size: 14, weight: .bold))
                                .foregroundColor(
                                    Color(UIColor.secondaryLabel))
                        }

                        HStack(alignment: .center) {
                            Text(player?.civilization ?? "").font(.system(size: 14, weight: .bold))
                            Text(game.leaderboard).font(.system(size: 14))
                        }
                    }.frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top).padding(10)
                }
            } compactLeading: {
                Text(game.map).font(.system(size: 14, weight: .bold))
            } compactTrailing: {
                Text("\(opponentsCount) - \(opponent?.name ?? "")").font(.system(size: 14))
            } minimal: {
                Text(opponentsCount).font(.system(size: 14))
            }
        }
    }
}

#if DEBUG
    @available(iOSApplicationExtension 16.2, *)
    struct LiveGameWidget_Previews: PreviewProvider {

        static var previews: some View {
            Group {
                MyActivityAttributes()
                    .previewContext(
                        MyActivityAttributes.ContentState(
                            data:
                                "{\"map\":\"Land Madness\",\"leaderboard\":\"Random Map\",\"currentPlayerId\":1,\"teams\":[{\"teamId\":1,\"players\":[{\"id\":1,\"name\":\"Sonny\",\"civilization\":\"Britons\",\"rating\":1400,\"color\":3}]},{\"teamId\":2,\"players\":[{\"id\":2,\"name\":\"Shadow\",\"civilization\":\"Ethiopians\",\"rating\":1000,\"color\":3}]}]}"
                        ),
                        viewKind: .content
                    )

                MyActivityAttributes()
                    .previewContext(
                        MyActivityAttributes.ContentState(
                            data:
                                "{\"map\":\"Land Madness\",\"leaderboard\":\"\",\"currentPlayerId\":1,\"teams\":[{\"teamId\":1,\"players\":[{\"id\":1,\"name\":\"Sonny\",\"civilization\":\"Britons\",\"rating\":1400,\"color\":3}]},{\"teamId\":2,\"players\":[{\"id\":2,\"name\":\"Shadow\",\"civilization\":\"Ethiopians\",\"rating\":1000,\"color\":3}]}]}"
                        ),
                        viewKind: .dynamicIsland(.expanded)
                    )
            }
        }
    }

#endif
