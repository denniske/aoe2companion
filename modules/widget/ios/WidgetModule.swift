import ActivityKit
import ExpoModulesCore
import Foundation
import WidgetKit

internal class VersionException: Exception {
    override var reason: String {
        "Function is available only on iOS 14 and higher"
    }
}

struct MyActivityAttributes: ActivityAttributes {
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

        Function("start") { (data: String) -> String? in
            if #available(iOS 16.1, *) {
                var activity: Activity<MyActivityAttributes>?
                let initialContentState =
                    MyActivityAttributes
                    .ContentState(data: data)
                let activityAttributes = MyActivityAttributes()

                do {
                    activity =
                        try Activity
                        .request(attributes: activityAttributes, contentState: initialContentState)

                    return activity?.id
                } catch (let error) {
                    return error.localizedDescription
                }
            }
            return nil
        }

        Function("list") { () -> [[String: String]]? in
            if #available(iOS 16.1, *) {
                var activities = Activity<MyActivityAttributes>.activities
                activities.sort { $0.id > $1.id }

                return activities.map { ["id": $0.id, "data": $0.contentState.data] }
            }
            return nil
        }

        Function("end") { (id: String) -> String? in
            if #available(iOS 16.1, *) {
                Task {
                    await Activity<MyActivityAttributes>.activities.filter { $0.id == id }.first?
                        .end(
                            dismissalPolicy: .immediate)
                    return id
                }
            }
            return nil
        }

        Function("update") { (id: String, data: String) -> String? in
            if #available(iOS 16.1, *) {
                Task {
                    let updatedStatus =
                        MyActivityAttributes
                        .ContentState(data: data)
                    let activities = Activity<MyActivityAttributes>.activities
                    let activity = activities.filter { $0.id == id }.first
                    await activity?.update(using: updatedStatus)
                    return id
                }
            }
            return nil
        }
    }
}
