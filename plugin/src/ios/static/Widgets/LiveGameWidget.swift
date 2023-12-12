import ActivityKit
import Foundation
import SwiftUI
import WidgetKit

struct MyActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var data: String
    }
}

struct Information: Codable {
    let name: String
}

// Data are sent as a string, so we need to convert it to a struct
func toJson(dataString: String) -> Information {
    let decoder = JSONDecoder()
    let stateData = Data(dataString.utf8)
    let data = try? decoder.decode(Information.self, from: stateData)
    if data == nil {
        NSLog("Error: %@ %@", "Data is null")
        return Information(
            name: "Kelsie")
    }
    return data
        ?? Information(
            name: "Noah")
}

@available(iOS 16.1, *)
struct LiveGameWidget: Widget {
    let kind: String = "LiveGame"

    var body: some WidgetConfiguration {
        ActivityConfiguration(for: MyActivityAttributes.self) { context in
            VStack {
                Text("Hello \(toJson(dataString: context.state.data).name)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)
        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here. Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(toJson(dataString: context.state.data).name)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(toJson(dataString: context.state.data).name)")
            } minimal: {
                Text(toJson(dataString: context.state.data).name)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

#if DEBUG
    @available(iOSApplicationExtension 16.2, *)
    struct LocationActivityView_Previews: PreviewProvider {

        static var previews: some View {
            Group {
                MyActivityAttributes()
                    .previewContext(
                        MyActivityAttributes.ContentState(data: "{\"name\": \"Noah\"}"),
                        viewKind: .content
                    )

                MyActivityAttributes()
                    .previewContext(
                        MyActivityAttributes.ContentState(data: "{\"name\": \"Noah\"}"),
                        viewKind: .dynamicIsland(.expanded)
                    )
            }
        }
    }

#endif
