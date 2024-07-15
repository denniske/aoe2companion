import ActivityKit
import ExpoModulesCore
import Foundation
import WidgetKit

internal class VersionException: Exception {
    override var reason: String {
        "Function is available only on iOS 14 and higher"
    }
}

struct LiveGameAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var data: String
    }
}

public class WidgetModule: Module {
    public func definition() -> ModuleDefinition {
        Name("Widget")

        Function("reloadAll") { () -> Void in
            if #available(iOS 14, *) {
                WidgetCenter.shared.reloadAllTimelines()
            } else {
                throw VersionException()
            }
        }

        Function("setItem") { (value: String, key: String, appGroup: String) -> Void in
            if let userDefaults = UserDefaults(suiteName: appGroup) {
                userDefaults.set(value, forKey: key)
            }
        }

        Function("setImage") { (path: String, filename: String, appGroup: String) -> String in
            let containerURL = FileManager.default.containerURL(
                forSecurityApplicationGroupIdentifier: appGroup)!
            let fileUrl = containerURL.appendingPathComponent(filename)
            let imageData = try? Data(contentsOf: URL(string: path)!)
            try! imageData!.write(to: fileUrl)
            return fileUrl.absoluteString
        }

        Function("getItem") { (key: String, appGroup: String) -> String? in
            if let userDefaults = UserDefaults(suiteName: appGroup) {
                return userDefaults.string(forKey: key)
            }
            return nil
        }

    }
}

public class LiveActivityModule: Module {
    public func definition() -> ModuleDefinition {
        Name("LiveActivity")
        Events("onTokenChanged", "onActivityStarted")

        Function("enable") { () -> Void in
            if #available(iOS 17.2, *) {
                Task {
                    for await data in Activity<LiveGameAttributes>.pushToStartTokenUpdates {
                        let token = data.map { String(format: "%02x", $0) }.joined()

                        sendEvent("onTokenChanged", ["token": token])

                    }
                }

                Task {
                    for await activityData in Activity<LiveGameAttributes>.activityUpdates {
                        Task {
                            for await tokenData in activityData.pushTokenUpdates {
                                let token = tokenData.map { String(format: "%02x", $0) }.joined()

                                sendEvent(
                                    "onActivityStarted",
                                    [
                                        "token": token, "type": "live-game",
                                        "data": activityData.content.state.data,
                                    ])
                            }
                        }
                    }
                }
            }
        }
    }
}
