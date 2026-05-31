import ExpoModulesCore
import Foundation


public class AppUpdateModule: Module {
    public func definition() -> ModuleDefinition {
        Name("AppUpdate")

        // Defines event names that the module can send to JavaScript.
        Events("onChange")

        // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
        Function("Hello") {
            return "Hello world! 👋"
        }

        // Defines a JavaScript function that always returns a Promise and whose native code
        // is by default dispatched on the different thread than the JavaScript runtime runs on.
        AsyncFunction("getAppUpdateInfo") { (promise: Promise) in
            self.log("getAppUpdateInfo")

            checkAppVersion { isAvailable, version in
                self.log("isAvailable: \(isAvailable)")
                self.log("version: \(version ?? "")")

                promise.resolve([
                    "updateAvailable": isAvailable,
                    "ios": [
                      "version": version
                    ]
                ])
            }
        }
    }

    func log(_ message: String) {
        self.sendEvent("onChange", ["_": message])
    }

    func checkAppVersion(completion: @escaping (Bool, String?) -> Void) {

       guard let bundleId = Bundle.main.bundleIdentifier,
             let currentVersion = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String else {
           completion(false, nil)
           return
       }

        self.log("Bundle ID: \(bundleId)")

        let updateUrl = "https://itunes.apple.com/lookup?bundleId=\(bundleId)"

        guard let url = URL(string: updateUrl) else {
            completion(false, nil)
            return
        }

        let task = URLSession.shared.dataTask(with: url) { data, response, error in

            guard let data = data, error == nil else {
                completion(false, nil)
                return
            }

            do {
                if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
                   let results = json["results"] as? [[String: Any]],
                   !results.isEmpty,
                   let appInfo = results.first,
                   let version = appInfo["version"] as? String {

                    self.log("App version: \(version)")
                    self.log("Current version: \(currentVersion)")

                    let isAvailable = (version.compare(currentVersion, options: .numeric) == .orderedDescending)

                    completion(isAvailable, version)
                } else {
                    completion(false, nil)
                }
            } catch {
                completion(false, nil)
            }
        }

        task.resume()
    }
}
