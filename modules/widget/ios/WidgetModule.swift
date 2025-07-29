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

internal class AppGroupNotSetException: Exception {
    override var reason: String {
        "App group is not set. Please call setAppGroup first."
    }
}

internal class GenericWidgetException: Exception {
    private let _reason: String

    init(_reason: String) {
        self._reason = _reason
        super.init()
    }

    override var reason: String {
        _reason
    }
}

public class WidgetModule: Module {

    private var appGroup: String?

    public func definition() -> ModuleDefinition {
        Name("Widget")

        Function("setAppGroup") { (appGroup: String) -> Void in
            self.appGroup = appGroup
        }

        Function("reloadAll") { () -> Void in
            if #available(iOS 14, *) {
                WidgetCenter.shared.reloadAllTimelines()
            } else {
                throw VersionException()
            }
        }

        Function("getItem") { (key: String) -> String? in
            guard let appGroup = self.appGroup else { throw AppGroupNotSetException() }

            if let userDefaults = UserDefaults(suiteName: appGroup) {
                return userDefaults.string(forKey: key)
            }
            return nil
        }

        Function("setItem") { (key: String, value: String) -> Void in
            guard let appGroup = self.appGroup else { throw AppGroupNotSetException() }

            if let userDefaults = UserDefaults(suiteName: appGroup) {
                userDefaults.set(value, forKey: key)
            }
        }

        Function("hasImage") { (filename: String) -> Bool in
            guard let appGroup = self.appGroup else { throw AppGroupNotSetException() }

            let containerURL = FileManager.default.containerURL(
                forSecurityApplicationGroupIdentifier: appGroup)!
            let fileUrl = containerURL.appendingPathComponent(filename)

            return FileManager.default.fileExists(atPath: fileUrl.path)
        }

        Function("getImagePathIfExists") { (filename: String) -> String? in
            guard let appGroup = self.appGroup else { throw AppGroupNotSetException() }

            let containerURL = FileManager.default.containerURL(
                forSecurityApplicationGroupIdentifier: appGroup)!
            let fileUrl = containerURL.appendingPathComponent(filename)

            if FileManager.default.fileExists(atPath: fileUrl.path) {
                return fileUrl.absoluteString
            } else {
                return nil
            }
        }

        Function("setImage") { (path: String, filename: String) -> String in
            guard let appGroup = self.appGroup else {
                throw AppGroupNotSetException()
            }

            guard let containerURL = FileManager.default.containerURL(
                forSecurityApplicationGroupIdentifier: appGroup) else {
                throw GenericWidgetException(_reason: "App group container URL not found")
            }

            guard let url = URL(string: path) else {
                throw GenericWidgetException(_reason: "Invalid image URL")
            }

            guard let imageData = try? Data(contentsOf: url) else {
                throw GenericWidgetException(_reason: "Failed to load image data")
            }

            let fileUrl = containerURL.appendingPathComponent(filename)
            try imageData.write(to: fileUrl)

            return fileUrl.absoluteString
        }
    }
}

public class LiveActivityModule: Module {
    public func definition() -> ModuleDefinition {
        Name("LiveActivity")
        Events("onTokenChanged", "onActivityStarted", "onTest")

        Function("enable") { () -> Void in
            
            print("Enabling LiveActivityModule")
            
            if #available(iOS 17.2, *) {
                
                print("iOS 17.2 available")
                
                Task {
                    for await data in Activity<LiveGameAttributes>.pushToStartTokenUpdates {
                        let token = data.map { String(format: "%02x", $0) }.joined()
                        
//                         print("NEW TOKEN: \(token)")
                        
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
                                sendEvent(
                                    "onTest",
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
