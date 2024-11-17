import ActivityKit
import Foundation
import SwiftUI
import WidgetKit
import CryptoKit

func md5(string: String) -> String {
    let digest = Insecure.MD5.hash(data: Data(string.utf8))

    return digest.map {
        String(format: "%02hhx", $0)
    }.joined()
}

func imagePathInAppGroup(url: String?) -> URL? {
    guard let url = url else {
        return URL(string: "")
    }

    let appGroup = "group.com.aoe2companion.widget"
    let filename = md5(string: url)

    let containerURL = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: appGroup)!
    let fileUrl = containerURL.appendingPathComponent(filename)

    return fileUrl
}

struct LiveGameAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    var data: String
  }
}

struct LiveGame: Codable {
  let playerId: Int
  let match: Match
}

struct Match: Codable {
  let matchId: Int
  let started: String
  let finished, leaderboardId, leaderboardName: String?
  let name: String?
  let server: String?
  let internalLeaderboardId: Int?
  let map, mapName: String
  let mapImageUrl: String?
  let privacy, difficulty, startingAge: Int
  let fullTechTree, allowCheats, empireWarsMode: Bool
  let endingAge: Int
  let gameMode, gameModeName: String
  let lockSpeed, lockTeams: Bool
  let mapSize, population: Int
  let hideCivs, recordGame, regicideMode: Bool
  let gameVariant, resources: Int
  let sharedExploration: Bool
  let speed: Int
  let speedName: String
  let suddenDeathMode, teamPositions, teamTogether: Bool
  let treatyLength: Int
  let turboMode: Bool
  let victory, revealMap: Int
  let scenario: String?
  let teams: [Team]
}

struct Team: Codable {
  let teamId: Int
  let players: [Player]
}

struct Player: Codable {
  let profileId: Int
  let name: String
  let rating, ratingDiff: Int?
  let civ, civName: String
  let civImageUrl: String
  let color: Int
  let colorHex: String
  let slot, status, team: Int
  let replay: Bool
  let won: Bool?
  let country: String?
  let verified: Bool
  let avatarHash: String?
  let avatarSmallUrl, avatarMediumUrl, avatarFullUrl: String?
}

func toJson(dataString: String) -> LiveGame? {
  let decoder = JSONDecoder()
  let stateData = Data(dataString.utf8)
  do {

    let data = try decoder.decode(LiveGame.self, from: stateData)

    return data
  } catch {
    print(error)
  }

  return nil
}

struct PlayerRow: View {
  let player: Player
  let showRating: Bool
  let bold: Bool
  let size: Int

  init(player: Player, showRating: Bool? = true, size: Int? = 16, bold: Bool? = false) {
    self.player = player
    self.showRating = showRating ?? true
    self.size = size ?? 16
    self.bold = bold ?? false
  }

  var body: some View {
    HStack(alignment: .center, spacing: 4) {
        NetworkImage(url: imagePathInAppGroup(url: player.civImageUrl)).frame(
        width: size >= 16 ? 20 : 15, height: size >= 16 ? 20 : 15)

      Text(player.name).font(
        .system(
          size: CGFloat(size), weight: bold ? .semibold : .regular)
      ).lineLimit(1)
      if showRating {
        Text(
          verbatim: player.rating != nil ? "(\(String(describing: player.rating!)))" : ""
        ).font(
          .system(size: CGFloat(size)))
      }
    }
  }
}

@available(iOS 16.1, *)
struct LiveGameWidget: Widget {
  let kind: String = "LiveGame"

  func parseDate(dateString: String) -> Date {
    let dateFormatter = DateFormatter()
    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
    dateFormatter.timeZone = TimeZone(abbreviation: "UTC")

    return dateFormatter.date(from: dateString) ?? Date.now
  }

  var body: some WidgetConfiguration {
    ActivityConfiguration(for: LiveGameAttributes.self) { context in
      let data = toJson(dataString: context.state.data)
      let match = data?.match
      let currentPlayer = data?.playerId

      if match != nil {
        let game = match!

        let opponents = game.teams.map { "\($0.players.count)" }
        let opponentsCount = opponents.joined(separator: "v")
        let startTime = parseDate(dateString: game.started)
        let lastId = game.teams.last?.teamId
        let suffix = game.teams.count - 4
        let teams =
          suffix > 0 ? [game.teams.prefix(4), game.teams.suffix(suffix)] : [game.teams.prefix(4)]
        let player =
          game.teams.first(where: { $0.players[0].profileId == currentPlayer })?.players[0]
          ?? game.teams[0].players[0]

        if opponentsCount == "1v1" {
          let p =
            game.teams.first(where: { $0.players[0].profileId != currentPlayer })?
            .players[0] ?? game.teams[0].players[0]
          HStack(spacing: 12) {
              NetworkImage(url: imagePathInAppGroup(url: game.mapImageUrl)).frame(
              width: 64, height: 64)
            VStack(alignment: .leading, spacing: 12) {
              HStack(alignment: .center) {
                Text(game.mapName).font(.system(size: 18, weight: .semibold))
                  .lineLimit(1)
                Spacer()
                Text("\(game.leaderboardName ?? "") \(opponentsCount)").font(
                  .system(size: 16))
              }
              HStack(alignment: .center, spacing: 4) {
                PlayerRow(player: p)

                Spacer()

                if game.finished != nil {
                  Text(player.won == true ? "Nice win!" : "Game over").font(
                    .system(size: 16, weight: .semibold))
                } else {
                  Text(startTime, style: .timer).contentTransition(.identity).font(
                    .system(size: 16)
                  ).lineLimit(1).multilineTextAlignment(
                    .trailing
                  ).monospacedDigit().frame(width: 80)
                }
              }
            }.frame(maxWidth: .infinity, alignment: .topLeading)
          }.padding(15).padding(.trailing, 8).foregroundColor(Color(UIColor.label))
            .activityBackgroundTint(nil).background(
              Color(UIColor.dynamicColor(light: "#FFFCF5", dark: "#181C29")))
        } else {
          VStack(spacing: 8) {
            HStack {
              Text(game.mapName).font(.system(size: 16, weight: .bold)).lineLimit(1)
              Text("\(game.leaderboardName!) \(opponentsCount)").font(
                .system(size: 14))
              Spacer()
              if game.finished != nil {
                Text(player.won == true ? "Nice win!" : "Game over").font(
                  .system(size: 14, weight: .semibold))
              } else {
                Text(startTime, style: .timer).contentTransition(.identity).font(
                  .system(size: 14)
                ).lineLimit(1).multilineTextAlignment(
                  .trailing
                ).monospacedDigit().frame(width: 60)
              }
            }

            VStack(spacing: 16) {
              ForEach(teams.indices, id: \.self) { teamGroup in
                HStack(alignment: .center) {
                  ForEach(teams[teamGroup], id: \.teamId) { team in
                    VStack(alignment: .leading, spacing: 4) {
                      ForEach(
                        team.players.prefix(team.players.count > 4 ? 3 : 4),
                        id: \.profileId
                      ) { p in
                        PlayerRow(
                          player: p, showRating: game.teams.count < 3,
                          bold: p.profileId == currentPlayer)
                      }
                      if team.players.count > 4 {
                        HStack {
                          Text("And \(team.players.count - 3) more...")
                            .font(
                              .system(
                                size: 16))

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
            .activityBackgroundTint(nil).background(
              Color(UIColor.dynamicColor(light: "#FFFCF5", dark: "#181C29")))
        }
      }
    } dynamicIsland: { context in
      let data = toJson(dataString: context.state.data)
      let match = data?.match
      let currentPlayer = data?.playerId

      if match != nil {
        let game = match!
        let opponents = game.teams.map { "\($0.players.count)" }
        let opponentsCount = opponents.joined(separator: "v")
        let startTime = parseDate(dateString: game.started)
        let lastId = game.teams.last?.teamId
        let suffix = game.teams.count - 4
        let teams =
          suffix > 0 ? [game.teams.prefix(4), game.teams.suffix(suffix)] : [game.teams.prefix(4)]
        let player =
          game.teams.first(where: { $0.players[0].profileId == currentPlayer })?.players[0]
          ?? game.teams[0].players[0]

        return DynamicIsland {
          DynamicIslandExpandedRegion(.leading) {
            if opponentsCount == "1v1" {
                NetworkImage(url: imagePathInAppGroup(url: game.mapImageUrl)).frame(
                width: 64, height: 64)
            } else {
              VStack(alignment: .trailing) {
                Text(game.mapName).font(.system(size: 14)).lineLimit(1)
              }.frame(maxWidth: .infinity, alignment: .trailing)
            }
          }
          DynamicIslandExpandedRegion(.trailing) {

            if game.finished != nil {
              Text(player.won == true ? "Nice Win!" : "Game Over").font(
                .system(size: 14, weight: .semibold)
              ).multilineTextAlignment(.center)
            } else {
              Text(startTime, style: .timer).contentTransition(.identity).font(
                .system(size: 14)
              ).multilineTextAlignment(
                .leading
              ).monospacedDigit()
            }
          }

          DynamicIslandExpandedRegion(.center) {
            if opponentsCount == "1v1" {
              let p =
                game.teams.first(where: { $0.players[0].profileId != currentPlayer }
                )?.players[0] ?? game.teams[0].players[0]

              VStack {

                Text(game.mapName).font(.system(size: 18, weight: .semibold))
                  .lineLimit(1)
                PlayerRow(player: p)
              }
            } else {
              HStack(alignment: .center) {
                Text(
                  "\(game.leaderboardName?.replacingOccurrences(of: "Team ", with: "") ?? "") \(opponentsCount)"
                ).font(
                  .system(size: 16)
                ).foregroundColor(
                  Color(UIColor.secondaryLabel))
              }
            }
          }
          DynamicIslandExpandedRegion(.bottom) {
            if opponentsCount != "1v1" {
              VStack(spacing: 16) {
                ForEach(teams.indices, id: \.self) { teamGroup in
                  HStack(alignment: .center) {
                    ForEach(teams[teamGroup], id: \.teamId) { team in
                      VStack(alignment: .leading, spacing: 4) {
                        ForEach(
                          team.players.prefix(
                            team.players.count > 4 ? 3 : 4),
                          id: \.profileId
                        ) { p in
                          PlayerRow(
                            player: p, showRating: game.teams.count < 3,
                            size: 14, bold: p.profileId == currentPlayer)
                        }
                        if team.players.count > 4 {
                          HStack {
                            Text(
                              "And \(team.players.count - 3) more..."
                            )
                            .font(
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
          }
        } compactLeading: {
            NetworkImageIsland(url: imagePathInAppGroup(url: game.mapImageUrl)).frame(
            width: 25, height: 25)

        } compactTrailing: {
          if game.finished != nil {
            Text(player.won == true ? "Nice win!" : "Game over").font(
              .system(size: 14, weight: .semibold)
            ).multilineTextAlignment(.center)
          } else {
            Text(startTime, style: .timer).contentTransition(.identity)
              .font(.system(size: 16)).multilineTextAlignment(
                .trailing
              ).monospacedDigit().frame(width: 60)
          }
        } minimal: {
            NetworkImageIsland(url: imagePathInAppGroup(url: game.mapImageUrl)).frame(
            width: 25, height: 25)
        }
      } else {
        return DynamicIsland {
          DynamicIslandExpandedRegion(.leading) {}
          DynamicIslandExpandedRegion(.trailing) {}
          DynamicIslandExpandedRegion(.center) {}
          DynamicIslandExpandedRegion(.bottom) {}
        } compactLeading: {
        } compactTrailing: {
        } minimal: {
        }
      }
    }
  }
}

#if DEBUG
  let ffaData =
    "{\"playerId\":569894,\"match\":{\"matchId\":326270505,\"started\":\"2024-07-14T16:33:09.000Z\",\"finished\":null,\"leaderboardId\":\"unranked\",\"leaderboardName\":\"Unranked\",\"name\":\"7V1  桃花源  10倍资源\",\"server\":\"southeastasia\",\"internalLeaderboardId\":0,\"map\":\"unknown\",\"mapName\":\"7v1 桃花源记 (Scenario)\",\"mapImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/maps/cm_generic.png\",\"privacy\":2,\"difficulty\":-1,\"startingAge\":3,\"fullTechTree\":false,\"allowCheats\":false,\"empireWarsMode\":true,\"endingAge\":0,\"gameMode\":\"scenario\",\"gameModeName\":\"Scenario\",\"lockSpeed\":true,\"lockTeams\":false,\"mapSize\":168,\"population\":500,\"hideCivs\":false,\"recordGame\":true,\"regicideMode\":true,\"gameVariant\":2,\"resources\":3,\"sharedExploration\":true,\"speed\":2,\"speedName\":\"Normal\",\"suddenDeathMode\":true,\"teamPositions\":false,\"teamTogether\":true,\"treatyLength\":0,\"turboMode\":false,\"victory\":0,\"revealMap\":2,\"scenario\":\"7v1 桃花源记.aoe2scenario\",\"teams\":[{\"teamId\":5,\"players\":[{\"profileId\":-1,\"name\":\"AI\",\"rating\":null,\"ratingDiff\":null,\"civ\":\"incas\",\"civName\":\"Incas\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/incas.png\",\"color\":8,\"colorHex\":\"#FF9600\",\"slot\":7,\"status\":2,\"team\":5,\"replay\":false,\"won\":null,\"country\":null,\"verified\":false,\"steamId\":null,\"avatarHash\":null,\"avatarSmallUrl\":null,\"avatarMediumUrl\":null,\"avatarFullUrl\":null}]},{\"teamId\":6,\"players\":[{\"profileId\":569894,\"name\":\"Viserion\",\"rating\":1365,\"ratingDiff\":null,\"civ\":\"japanese\",\"civName\":\"Japanese\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/japanese.png\",\"color\":7,\"colorHex\":\"#797979\",\"slot\":6,\"status\":0,\"team\":6,\"replay\":false,\"won\":null,\"country\":\"tr\",\"verified\":false,\"steamId\":\"76561198219881437\",\"avatarHash\":\"4855763ac3c130586929cf35f2954ec9dc3c4c8a\",\"avatarSmallUrl\":\"https://avatars.akamai.steamstatic.com/4855763ac3c130586929cf35f2954ec9dc3c4c8a.jpg\",\"avatarMediumUrl\":\"https://avatars.akamai.steamstatic.com/4855763ac3c130586929cf35f2954ec9dc3c4c8a_medium.jpg\",\"avatarFullUrl\":\"https://avatars.akamai.steamstatic.com/4855763ac3c130586929cf35f2954ec9dc3c4c8a_full.jpg\"}]},{\"teamId\":7,\"players\":[{\"profileId\":1143927,\"name\":\"ernestocorrea18\",\"rating\":1141,\"ratingDiff\":null,\"civ\":\"japanese\",\"civName\":\"Japanese\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/japanese.png\",\"color\":4,\"colorHex\":\"#FFFF00\",\"slot\":3,\"status\":0,\"team\":7,\"replay\":false,\"won\":null,\"country\":\"co\",\"verified\":false,\"steamId\":\"76561198328289241\",\"avatarHash\":\"fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb\",\"avatarSmallUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg\",\"avatarMediumUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg\",\"avatarFullUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg\"}]},{\"teamId\":8,\"players\":[{\"profileId\":2581899,\"name\":\"JusTLaZ\",\"rating\":1417,\"ratingDiff\":null,\"civ\":\"japanese\",\"civName\":\"Japanese\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/japanese.png\",\"color\":6,\"colorHex\":\"#FF57B3\",\"slot\":5,\"status\":0,\"team\":8,\"replay\":false,\"won\":null,\"country\":\"tr\",\"verified\":false,\"steamId\":\"76561198169251927\",\"avatarHash\":\"0ea030d7ef646bb340550b2594620d0ee06977b8\",\"avatarSmallUrl\":\"https://avatars.akamai.steamstatic.com/0ea030d7ef646bb340550b2594620d0ee06977b8.jpg\",\"avatarMediumUrl\":\"https://avatars.akamai.steamstatic.com/0ea030d7ef646bb340550b2594620d0ee06977b8_medium.jpg\",\"avatarFullUrl\":\"https://avatars.akamai.steamstatic.com/0ea030d7ef646bb340550b2594620d0ee06977b8_full.jpg\"}]},{\"teamId\":9,\"players\":[{\"profileId\":10708291,\"name\":\"社会主义接班人\",\"rating\":1225,\"ratingDiff\":null,\"civ\":\"koreans\",\"civName\":\"Koreans\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/koreans.png\",\"color\":1,\"colorHex\":\"#405BFF\",\"slot\":0,\"status\":0,\"team\":9,\"replay\":false,\"won\":null,\"country\":\"cn\",\"verified\":false,\"steamId\":\"76561198800900961\",\"avatarHash\":\"fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb\",\"avatarSmallUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg\",\"avatarMediumUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg\",\"avatarFullUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg\"}]},{\"teamId\":10,\"players\":[{\"profileId\":11473883,\"name\":\"111888\",\"rating\":1148,\"ratingDiff\":null,\"civ\":\"japanese\",\"civName\":\"Japanese\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/japanese.png\",\"color\":3,\"colorHex\":\"#00FF00\",\"slot\":2,\"status\":0,\"team\":10,\"replay\":false,\"won\":null,\"country\":\"cn\",\"verified\":false,\"steamId\":\"76561199102003841\",\"avatarHash\":\"fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb\",\"avatarSmallUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg\",\"avatarMediumUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg\",\"avatarFullUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg\"}]},{\"teamId\":11,\"players\":[{\"profileId\":14426488,\"name\":\"队友厉害我就厉害\",\"rating\":1280,\"ratingDiff\":null,\"civ\":\"georgians\",\"civName\":\"Georgians\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/georgians.png\",\"color\":2,\"colorHex\":\"#FF0000\",\"slot\":1,\"status\":0,\"team\":11,\"replay\":false,\"won\":null,\"country\":\"cn\",\"verified\":false,\"steamId\":\"76561198287958871\",\"avatarHash\":\"fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb\",\"avatarSmallUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg\",\"avatarMediumUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg\",\"avatarFullUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg\"}]},{\"teamId\":12,\"players\":[{\"profileId\":20200435,\"name\":\"OUDY\",\"rating\":1140,\"ratingDiff\":null,\"civ\":\"khmer\",\"civName\":\"Khmer\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/khmer.png\",\"color\":5,\"colorHex\":\"#00FFFF\",\"slot\":4,\"status\":0,\"team\":12,\"replay\":false,\"won\":null,\"country\":null,\"verified\":false,\"steamId\":\"76561199527088077\",\"avatarHash\":null,\"avatarSmallUrl\":null,\"avatarMediumUrl\":null,\"avatarFullUrl\":null}]}]}}"
  let unevenTeams =
    "{\"playerId\":407363,\"match\":{\"matchId\":326274782,\"started\":\"2024-07-14T16:58:24.000Z\",\"finished\":null,\"leaderboardId\":\"unranked\",\"leaderboardName\":\"Unranked\",\"name\":\"[重賽] 弦月 的遊戲\",\"server\":\"koreacentral\",\"internalLeaderboardId\":0,\"map\":\"rm_nomad\",\"mapName\":\"Nomad\",\"mapImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/maps/rm_nomad.png\",\"privacy\":2,\"difficulty\":3,\"startingAge\":0,\"fullTechTree\":false,\"allowCheats\":false,\"empireWarsMode\":true,\"endingAge\":0,\"gameMode\":\"random_map\",\"gameModeName\":\"Random Map\",\"lockSpeed\":true,\"lockTeams\":false,\"mapSize\":220,\"population\":200,\"hideCivs\":false,\"recordGame\":true,\"regicideMode\":true,\"gameVariant\":2,\"resources\":0,\"sharedExploration\":false,\"speed\":2,\"speedName\":\"Normal\",\"suddenDeathMode\":true,\"teamPositions\":false,\"teamTogether\":true,\"treatyLength\":0,\"turboMode\":true,\"victory\":1,\"revealMap\":0,\"scenario\":null,\"teams\":[{\"teamId\":1,\"players\":[{\"profileId\":407363,\"name\":\"Kay UwU\",\"rating\":1484,\"ratingDiff\":null,\"civ\":\"berbers\",\"civName\":\"Berbers\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/berbers.png\",\"color\":6,\"colorHex\":\"#FF57B3\",\"slot\":1,\"status\":0,\"team\":1,\"replay\":false,\"won\":null,\"country\":\"tw\",\"verified\":false,\"steamId\":\"76561198362650388\",\"avatarHash\":\"1886bdf4277fbafcd32f20a81574c7f86b95db6d\",\"avatarSmallUrl\":\"https://avatars.akamai.steamstatic.com/1886bdf4277fbafcd32f20a81574c7f86b95db6d.jpg\",\"avatarMediumUrl\":\"https://avatars.akamai.steamstatic.com/1886bdf4277fbafcd32f20a81574c7f86b95db6d_medium.jpg\",\"avatarFullUrl\":\"https://avatars.akamai.steamstatic.com/1886bdf4277fbafcd32f20a81574c7f86b95db6d_full.jpg\"},{\"profileId\":1298444,\"name\":\"MarioWang\",\"rating\":1465,\"ratingDiff\":null,\"civ\":\"byzantines\",\"civName\":\"Byzantines\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/byzantines.png\",\"color\":3,\"colorHex\":\"#00FF00\",\"slot\":2,\"status\":0,\"team\":1,\"replay\":false,\"won\":null,\"country\":\"tw\",\"verified\":false,\"steamId\":\"76561198748427901\",\"avatarHash\":\"78582c7e381643ba4e81ca54e31f01b9d671e320\",\"avatarSmallUrl\":\"https://avatars.akamai.steamstatic.com/78582c7e381643ba4e81ca54e31f01b9d671e320.jpg\",\"avatarMediumUrl\":\"https://avatars.akamai.steamstatic.com/78582c7e381643ba4e81ca54e31f01b9d671e320_medium.jpg\",\"avatarFullUrl\":\"https://avatars.akamai.steamstatic.com/78582c7e381643ba4e81ca54e31f01b9d671e320_full.jpg\"},{\"profileId\":321276,\"name\":\"xYourY\",\"rating\":1216,\"ratingDiff\":null,\"civ\":\"malay\",\"civName\":\"Malay\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/malay.png\",\"color\":4,\"colorHex\":\"#FFFF00\",\"slot\":3,\"status\":0,\"team\":1,\"replay\":false,\"won\":null,\"country\":\"hk\",\"verified\":false,\"steamId\":\"76561198218126940\",\"avatarHash\":\"52b028f7fa4a4cb147c3af7d82865fb0f7626b6e\",\"avatarSmallUrl\":\"https://avatars.akamai.steamstatic.com/52b028f7fa4a4cb147c3af7d82865fb0f7626b6e.jpg\",\"avatarMediumUrl\":\"https://avatars.akamai.steamstatic.com/52b028f7fa4a4cb147c3af7d82865fb0f7626b6e_medium.jpg\",\"avatarFullUrl\":\"https://avatars.akamai.steamstatic.com/52b028f7fa4a4cb147c3af7d82865fb0f7626b6e_full.jpg\"},{\"profileId\":4868998,\"name\":\"JamCat\",\"rating\":1535,\"ratingDiff\":null,\"civ\":\"huns\",\"civName\":\"Huns\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/huns.png\",\"color\":8,\"colorHex\":\"#FF9600\",\"slot\":4,\"status\":0,\"team\":1,\"replay\":false,\"won\":null,\"country\":\"tw\",\"verified\":false,\"steamId\":\"76561198030295508\",\"avatarHash\":\"d4d9e4d7b61d3d60ff6326ab1f370c28a96e4aba\",\"avatarSmallUrl\":\"https://avatars.akamai.steamstatic.com/d4d9e4d7b61d3d60ff6326ab1f370c28a96e4aba.jpg\",\"avatarMediumUrl\":\"https://avatars.akamai.steamstatic.com/d4d9e4d7b61d3d60ff6326ab1f370c28a96e4aba_medium.jpg\",\"avatarFullUrl\":\"https://avatars.akamai.steamstatic.com/d4d9e4d7b61d3d60ff6326ab1f370c28a96e4aba_full.jpg\"},{\"profileId\":1906236,\"name\":\"kkman86\",\"rating\":1562,\"ratingDiff\":null,\"civ\":\"mayans\",\"civName\":\"Mayans\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/mayans.png\",\"color\":2,\"colorHex\":\"#FF0000\",\"slot\":6,\"status\":0,\"team\":1,\"replay\":false,\"won\":null,\"country\":\"ar\",\"verified\":false,\"steamId\":\"76561198297547555\",\"avatarHash\":\"ae28de24fbb2c533831860e3068d80e09a991202\",\"avatarSmallUrl\":\"https://avatars.akamai.steamstatic.com/ae28de24fbb2c533831860e3068d80e09a991202.jpg\",\"avatarMediumUrl\":\"https://avatars.akamai.steamstatic.com/ae28de24fbb2c533831860e3068d80e09a991202_medium.jpg\",\"avatarFullUrl\":\"https://avatars.akamai.steamstatic.com/ae28de24fbb2c533831860e3068d80e09a991202_full.jpg\"}]},{\"teamId\":2,\"players\":[{\"profileId\":973735,\"name\":\"弦月\",\"rating\":1898,\"ratingDiff\":null,\"civ\":\"goths\",\"civName\":\"Goths\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/goths.png\",\"color\":1,\"colorHex\":\"#405BFF\",\"slot\":0,\"status\":0,\"team\":2,\"replay\":false,\"won\":null,\"country\":\"tw\",\"verified\":false,\"steamId\":\"76561198358790663\",\"avatarHash\":\"3aaec9ab80ab25799d8bb9fd5cbe247641205ba0\",\"avatarSmallUrl\":\"https://avatars.akamai.steamstatic.com/3aaec9ab80ab25799d8bb9fd5cbe247641205ba0.jpg\",\"avatarMediumUrl\":\"https://avatars.akamai.steamstatic.com/3aaec9ab80ab25799d8bb9fd5cbe247641205ba0_medium.jpg\",\"avatarFullUrl\":\"https://avatars.akamai.steamstatic.com/3aaec9ab80ab25799d8bb9fd5cbe247641205ba0_full.jpg\"},{\"profileId\":5997931,\"name\":\"蒼kono\",\"rating\":1088,\"ratingDiff\":null,\"civ\":\"aztecs\",\"civName\":\"Aztecs\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/aztecs.png\",\"color\":7,\"colorHex\":\"#797979\",\"slot\":5,\"status\":0,\"team\":2,\"replay\":false,\"won\":null,\"country\":\"tw\",\"verified\":false,\"steamId\":\"76561198397792575\",\"avatarHash\":\"fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb\",\"avatarSmallUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg\",\"avatarMediumUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg\",\"avatarFullUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg\"},{\"profileId\":9992305,\"name\":\"thunder bun\",\"rating\":1409,\"ratingDiff\":null,\"civ\":\"tatars\",\"civName\":\"Tatars\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/tatars.png\",\"color\":5,\"colorHex\":\"#00FFFF\",\"slot\":7,\"status\":0,\"team\":2,\"replay\":false,\"won\":null,\"country\":\"tw\",\"verified\":false,\"steamId\":\"76561199265633489\",\"avatarHash\":\"fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb\",\"avatarSmallUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg\",\"avatarMediumUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg\",\"avatarFullUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg\"}]}]}}"
  let teamsOfTwoData =
    "{\"playerId\":19627663,\"match\":{\"matchId\":326280553,\"started\":\"2024-07-14T17:18:12.000Z\",\"finished\":\"2024-07-14T17:27:44.000Z\",\"leaderboardId\":\"qp_rm_team\",\"leaderboardName\":\"Quick Play Team Random Map\",\"name\":\"AUTOMATCH\",\"server\":null,\"internalLeaderboardId\":19,\"map\":\"rm_nomad\",\"mapName\":\"Nomad\",\"mapImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/maps/rm_nomad.png\",\"privacy\":2,\"difficulty\":3,\"startingAge\":2,\"fullTechTree\":false,\"allowCheats\":false,\"empireWarsMode\":true,\"endingAge\":5,\"gameMode\":\"random_map\",\"gameModeName\":\"Random Map\",\"lockSpeed\":true,\"lockTeams\":false,\"mapSize\":168,\"population\":200,\"hideCivs\":false,\"recordGame\":true,\"regicideMode\":true,\"gameVariant\":2,\"resources\":1,\"sharedExploration\":false,\"speed\":2,\"speedName\":\"Normal\",\"suddenDeathMode\":true,\"teamPositions\":true,\"teamTogether\":true,\"treatyLength\":0,\"turboMode\":true,\"victory\":9,\"revealMap\":0,\"scenario\":null,\"teams\":[{\"teamId\":1,\"players\":[{\"profileId\":19627663,\"name\":\"natanael_640\",\"rating\":1137,\"ratingDiff\":-17,\"civ\":\"chinese\",\"civName\":\"Chinese\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/chinese.png\",\"color\":2,\"colorHex\":\"#FF0000\",\"slot\":0,\"status\":0,\"team\":1,\"replay\":false,\"won\":false,\"country\":null,\"verified\":false,\"avatarHash\":null,\"avatarSmallUrl\":null,\"avatarMediumUrl\":null,\"avatarFullUrl\":null},{\"profileId\":19640529,\"name\":\"matiabboud94\",\"rating\":1133,\"ratingDiff\":-17,\"civ\":\"mongols\",\"civName\":\"Mongols\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/mongols.png\",\"color\":4,\"colorHex\":\"#FFFF00\",\"slot\":2,\"status\":0,\"team\":1,\"replay\":false,\"won\":false,\"country\":null,\"verified\":false,\"avatarHash\":null,\"avatarSmallUrl\":null,\"avatarMediumUrl\":null,\"avatarFullUrl\":null}]},{\"teamId\":2,\"players\":[{\"profileId\":3141430,\"name\":\"RealMabus666\",\"rating\":1102,\"ratingDiff\":18,\"civ\":\"aztecs\",\"civName\":\"Aztecs\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/aztecs.png\",\"color\":1,\"colorHex\":\"#405BFF\",\"slot\":1,\"status\":0,\"team\":2,\"replay\":false,\"won\":true,\"country\":null,\"verified\":false,\"avatarHash\":null,\"avatarSmallUrl\":null,\"avatarMediumUrl\":null,\"avatarFullUrl\":null},{\"profileId\":10428329,\"name\":\"Frabossa\",\"rating\":1122,\"ratingDiff\":17,\"civ\":\"italians\",\"civName\":\"Italians\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/italians.png\",\"color\":3,\"colorHex\":\"#00FF00\",\"slot\":3,\"status\":0,\"team\":2,\"replay\":false,\"won\":true,\"country\":null,\"verified\":false,\"avatarHash\":null,\"avatarSmallUrl\":null,\"avatarMediumUrl\":null,\"avatarFullUrl\":null}]}]}}"
  let teamsOfFourData =
    "{\"playerId\":2468813,\"match\":{\"matchId\":326270950,\"started\":\"2024-07-14T16:32:17.000Z\",\"finished\":null,\"leaderboardId\":\"ew_team\",\"leaderboardName\":\"Team Empire Wars\",\"name\":\"AUTOMATCH\",\"server\":\"ukwest\",\"internalLeaderboardId\":29,\"map\":\"rm_atacama\",\"mapName\":\"Atacama\",\"mapImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/maps/rm_atacama.png\",\"privacy\":2,\"difficulty\":3,\"startingAge\":3,\"fullTechTree\":false,\"allowCheats\":false,\"empireWarsMode\":true,\"endingAge\":5,\"gameMode\":\"empire_wars\",\"gameModeName\":\"Empire Wars\",\"lockSpeed\":true,\"lockTeams\":false,\"mapSize\":220,\"population\":200,\"hideCivs\":false,\"recordGame\":true,\"regicideMode\":true,\"gameVariant\":2,\"resources\":0,\"sharedExploration\":false,\"speed\":2,\"speedName\":\"Normal\",\"suddenDeathMode\":true,\"teamPositions\":true,\"teamTogether\":true,\"treatyLength\":0,\"turboMode\":true,\"victory\":1,\"revealMap\":0,\"scenario\":null,\"teams\":[{\"teamId\":1,\"players\":[{\"profileId\":2468813,\"name\":\"fideos1234\",\"rating\":1140,\"ratingDiff\":null,\"civ\":\"mongols\",\"civName\":\"Mongols\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/mongols.png\",\"color\":4,\"colorHex\":\"#FFFF00\",\"slot\":2,\"status\":0,\"team\":1,\"replay\":false,\"won\":null,\"country\":\"ar\",\"verified\":false,\"steamId\":\"76561199051008571\",\"avatarHash\":\"c29fc2fcf85db00a68f41a65aeba53a0838c5b5b\",\"avatarSmallUrl\":\"https://avatars.akamai.steamstatic.com/c29fc2fcf85db00a68f41a65aeba53a0838c5b5b.jpg\",\"avatarMediumUrl\":\"https://avatars.akamai.steamstatic.com/c29fc2fcf85db00a68f41a65aeba53a0838c5b5b_medium.jpg\",\"avatarFullUrl\":\"https://avatars.akamai.steamstatic.com/c29fc2fcf85db00a68f41a65aeba53a0838c5b5b_full.jpg\"},{\"profileId\":6741182,\"name\":\"367281\",\"rating\":1043,\"ratingDiff\":null,\"civ\":\"byzantines\",\"civName\":\"Byzantines\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/byzantines.png\",\"color\":8,\"colorHex\":\"#FF9600\",\"slot\":6,\"status\":0,\"team\":1,\"replay\":false,\"won\":null,\"country\":\"cn\",\"verified\":false,\"steamId\":\"76561198449474639\",\"avatarHash\":null,\"avatarSmallUrl\":null,\"avatarMediumUrl\":null,\"avatarFullUrl\":null},{\"profileId\":19165588,\"name\":\"Gurungsta\",\"rating\":1104,\"ratingDiff\":null,\"civ\":\"lithuanians\",\"civName\":\"Lithuanians\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/lithuanians.png\",\"color\":2,\"colorHex\":\"#FF0000\",\"slot\":0,\"status\":0,\"team\":1,\"replay\":false,\"won\":null,\"country\":\"gb\",\"verified\":false,\"steamId\":\"76561199011461278\",\"avatarHash\":null,\"avatarSmallUrl\":null,\"avatarMediumUrl\":null,\"avatarFullUrl\":null},{\"profileId\":19767039,\"name\":\"sammartocci3\",\"rating\":null,\"ratingDiff\":null,\"civ\":\"khmer\",\"civName\":\"Khmer\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/khmer.png\",\"color\":6,\"colorHex\":\"#FF57B3\",\"slot\":4,\"status\":0,\"team\":1,\"replay\":false,\"won\":null,\"country\":\"us\",\"verified\":false,\"steamId\":\"76561199092557777\",\"avatarHash\":null,\"avatarSmallUrl\":null,\"avatarMediumUrl\":null,\"avatarFullUrl\":null}]},{\"teamId\":2,\"players\":[{\"profileId\":2378890,\"name\":\"Tamanoir\",\"rating\":1119,\"ratingDiff\":null,\"civ\":\"mayans\",\"civName\":\"Mayans\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/mayans.png\",\"color\":7,\"colorHex\":\"#797979\",\"slot\":3,\"status\":0,\"team\":2,\"replay\":false,\"won\":null,\"country\":\"be\",\"verified\":false,\"steamId\":\"76561198922529417\",\"avatarHash\":\"fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb\",\"avatarSmallUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg\",\"avatarMediumUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg\",\"avatarFullUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg\"},{\"profileId\":5645487,\"name\":\"Martin\",\"rating\":1081,\"ratingDiff\":null,\"civ\":\"persians\",\"civName\":\"Persians\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/persians.png\",\"color\":3,\"colorHex\":\"#00FF00\",\"slot\":1,\"status\":0,\"team\":2,\"replay\":false,\"won\":null,\"country\":\"it\",\"verified\":false,\"steamId\":\"76561199159084042\",\"avatarHash\":\"fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb\",\"avatarSmallUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg\",\"avatarMediumUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg\",\"avatarFullUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg\"},{\"profileId\":11463980,\"name\":\"eimantasleon\",\"rating\":914,\"ratingDiff\":null,\"civ\":\"magyars\",\"civName\":\"Magyars\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/magyars.png\",\"color\":5,\"colorHex\":\"#00FFFF\",\"slot\":5,\"status\":0,\"team\":2,\"replay\":false,\"won\":null,\"country\":\"lt\",\"verified\":false,\"steamId\":\"76561199130268576\",\"avatarHash\":\"fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb\",\"avatarSmallUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg\",\"avatarMediumUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg\",\"avatarFullUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg\"},{\"profileId\":19835453,\"name\":\"颜如玉\",\"rating\":null,\"ratingDiff\":null,\"civ\":\"goths\",\"civName\":\"Goths\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/goths.png\",\"color\":1,\"colorHex\":\"#405BFF\",\"slot\":7,\"status\":0,\"team\":2,\"replay\":false,\"won\":null,\"country\":\"cn\",\"verified\":false,\"steamId\":\"76561199497817926\",\"avatarHash\":null,\"avatarSmallUrl\":null,\"avatarMediumUrl\":null,\"avatarFullUrl\":null}]}]}}"
  let oneVOne =
    "{\"playerId\":2302541,\"match\":{\"matchId\":326119835,\"started\":\"2024-07-14T00:41:48.000Z\",\"finished\":\"2024-07-14T00:42:33.000Z\",\"leaderboardId\":\"unranked\",\"leaderboardName\":\"Unranked\",\"name\":\"Test\",\"server\":null,\"internalLeaderboardId\":0,\"map\":\"rm_coastal\",\"mapName\":\"Coastal\",\"mapImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/maps/rm_coastal.png\",\"privacy\":2,\"difficulty\":3,\"startingAge\":0,\"fullTechTree\":false,\"allowCheats\":false,\"empireWarsMode\":true,\"endingAge\":0,\"gameMode\":\"random_map\",\"gameModeName\":\"Random Map\",\"lockSpeed\":true,\"lockTeams\":false,\"mapSize\":120,\"population\":200,\"hideCivs\":false,\"recordGame\":true,\"regicideMode\":true,\"gameVariant\":2,\"resources\":0,\"sharedExploration\":false,\"speed\":2,\"speedName\":\"Normal\",\"suddenDeathMode\":true,\"teamPositions\":false,\"teamTogether\":true,\"treatyLength\":0,\"turboMode\":true,\"victory\":9,\"revealMap\":0,\"scenario\":null,\"teams\":[{\"teamId\":5,\"players\":[{\"profileId\":2302541,\"name\":\"Sonny\",\"rating\":1494,\"ratingDiff\":0,\"civ\":\"teutons\",\"civName\":\"Teutons\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/teutons.png\",\"color\":1,\"colorHex\":\"#405BFF\",\"slot\":0,\"status\":0,\"team\":5,\"replay\":false,\"won\":true,\"country\":\"us\",\"verified\":false,\"avatarHash\":\"fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb\",\"avatarSmallUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg\",\"avatarMediumUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg\",\"avatarFullUrl\":\"https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg\"}]},{\"teamId\":6,\"players\":[{\"profileId\":-1,\"name\":\"AI\",\"rating\":null,\"ratingDiff\":null,\"civ\":\"hindustanis\",\"civName\":\"Hindustanis\",\"civImageUrl\":\"https://frontend.cdn.aoe2companion.com/public/aoe2/de/civilizations/hindustanis.png\",\"color\":2,\"colorHex\":\"#FF0000\",\"slot\":1,\"status\":2,\"team\":6,\"replay\":false,\"won\":null,\"country\":null,\"verified\":false,\"avatarHash\":null,\"avatarSmallUrl\":null,\"avatarMediumUrl\":null,\"avatarFullUrl\":null}]}]}}"

  @available(iOSApplicationExtension 16.2, *)
  struct LiveGameWidget_Previews: PreviewProvider {

    static var previews: some View {
      Group {
        LiveGameAttributes()
          .previewContext(
            LiveGameAttributes.ContentState(
              data: oneVOne
            ),
            viewKind: .content
          ).previewDisplayName("Live Game Activity - 1v1")
        LiveGameAttributes()
          .previewContext(
            LiveGameAttributes.ContentState(
              data: teamsOfTwoData
            ),
            viewKind: .content
          ).previewDisplayName("Live Game Activity - 2v2")
        LiveGameAttributes()
          .previewContext(
            LiveGameAttributes.ContentState(
              data: teamsOfFourData
            ),
            viewKind: .content
          ).previewDisplayName("Live Game Activity - 4v4")
        LiveGameAttributes()
          .previewContext(
            LiveGameAttributes.ContentState(
              data: ffaData
            ),
            viewKind: .content
          ).previewDisplayName("Live Game Activity - FFA")
        LiveGameAttributes()
          .previewContext(
            LiveGameAttributes.ContentState(
              data: unevenTeams
            ),
            viewKind: .content
          ).previewDisplayName("Live Game Activity - Uneven")

        LiveGameAttributes()
          .previewContext(
            LiveGameAttributes.ContentState(
              data: oneVOne
            ),
            viewKind: .dynamicIsland(.expanded)
          ).previewDisplayName("Live Game Island - 1v1")
        LiveGameAttributes()
          .previewContext(
            LiveGameAttributes.ContentState(
              data: teamsOfTwoData
            ),
            viewKind: .dynamicIsland(.expanded)
          ).previewDisplayName("Live Game Island - 2v2")
        LiveGameAttributes()
          .previewContext(
            LiveGameAttributes.ContentState(
              data: teamsOfFourData
            ),
            viewKind: .dynamicIsland(.expanded)
          ).previewDisplayName("Live Game Island - 4v4")
        LiveGameAttributes()
          .previewContext(
            LiveGameAttributes.ContentState(
              data: ffaData
            ),
            viewKind: .dynamicIsland(.expanded)
          ).previewDisplayName("Live Game Island - FFA")
        LiveGameAttributes()
          .previewContext(
            LiveGameAttributes.ContentState(
              data: unevenTeams
            ),
            viewKind: .dynamicIsland(.expanded)
          ).previewDisplayName("Live Game Island - Uneven")
      }
    }
  }
#endif
