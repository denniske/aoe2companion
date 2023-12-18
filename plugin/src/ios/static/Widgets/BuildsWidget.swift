import Foundation
import Intents
import SwiftUI
import WidgetKit

struct Build: Decodable, Identifiable, Hashable {
    let id: String
    let title: String
    let civilization: String
    let image: String
}

struct Provider: IntentTimelineProvider {
    func placeholder(in context: Context) -> BuildsEntry {
        BuildsEntry(
            date: Date(), builds: [], title: context.family == .systemMedium ? nil : "Build Orders")
    }

    func getSnapshot(
        for configuration: BuildsConfigurationIntent, in context: Context,
        completion: @escaping (BuildsEntry) -> Void
    ) {
        let entry = BuildsEntry(
            date: Date(), builds: [], title: context.family == .systemMedium ? nil : "Build Orders")
        completion(entry)
    }

    func getTimeline(
        for configuration: BuildsConfigurationIntent, in context: Context,
        completion: @escaping (Timeline<BuildsEntry>) -> Void
    ) {
        let items = getItem()
        let length = context.family == .systemMedium ? 2 : 4
        let civilization = CivilizationMap(rawValue: configuration.civilization.rawValue)?
            .civilization

        var builds = items.count > length ? Array(items[0..<length]) : items

        if civilization != nil && civilization != "All" {
            builds = builds.filter { $0.civilization == civilization }
        }

        let entry = BuildsEntry(
            date: Date(), builds: builds,
            title: context.family == .systemLarge || builds.count == 0 ? "Build Orders" : nil)

        let timeline = Timeline(entries: [entry], policy: .never)
        completion(timeline)
    }

    private func getItem() -> [Build] {
        let userDefaults = UserDefaults(suiteName: "group.com.aoe2companion.widget")
        let savedData = userDefaults?.string(forKey: "savedData") ?? "[]"
        let decoder = JSONDecoder()
        let data = savedData.data(using: .utf8)

        if let parsedData = try? decoder.decode([Build].self, from: data!) {
            return parsedData
        } else {
            print("Could not parse data")
        }
        return []
    }

}

struct BuildsEntry: TimelineEntry {
    let date: Date
    let builds: [Build]
    let title: String?
}

struct BuildsWidgetEntryView: View {
    var entry: Provider.Entry

    var body: some View {
        ZStack {
            VStack(spacing: 12) {
                if entry.title != nil {
                    Text(entry.title ?? "Test")
                        .foregroundColor(
                            Color(UIColor.label)
                        )
                        .font(.system(size: 18, weight: .bold))
                }

                ForEach(entry.builds, id: \.self) { build in
                    Link(destination: URL(string: "aoe2companion://guide/\(build.id)")!) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(build.title)
                                .foregroundColor(
                                    Color(UIColor.label)
                                )
                                .font(.system(size: 16, weight: .bold))
                            HStack(alignment: .center) {
                                NetworkImage(url: URL(string: build.image)).frame(
                                    width: 15, height: 15)
                                Text(build.civilization)
                                    .font(Font.system(size: 14, weight: .regular))
                                    .foregroundColor(
                                        Color(UIColor.secondaryLabel))
                                Spacer()
                            }

                        }
                        .padding(10)
                        .background(Color(UIColor.secondarySystemFill))
                        .cornerRadius(10)
                    }
                }
            }.padding(15)
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
        }.widgetBackground(Color(UIColor.systemBackground))
    }
}

struct BuildsWidget: Widget {
    let kind: String = "Builds"

    var body: some WidgetConfiguration {
        IntentConfiguration(
            kind: kind, intent: BuildsConfigurationIntent.self, provider: Provider()
        ) { entry in
            BuildsWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Build Orders")
        .description("Quick access to your favorite build order")
        .supportedFamilies([.systemMedium, .systemLarge])
        .contentMarginsDisabledIfAvailable()
    }
}

@available(iOS 17.0, *)#Preview("TimelineLarge", as: .systemLarge){
    BuildsWidget()
} timeline: {
    BuildsEntry(
        date: Date(),
        builds: [
            Build(
                id: "1", title: "Fast Castle into Boom", civilization: "Lithuanians",
                image:
                    "http://192.168.7.185:8081/assets/app/assets/civilizations/de/lithuanians.png"),
            Build(
                id: "2", title: "Men at Arms into Archers", civilization: "Generic",
                image: "http://192.168.7.185:8081/assets/app/assets/civilizations/generic.png"),
            Build(
                id: "3", title: "Fast Imperial", civilization: "Turks",
                image: "http://192.168.7.185:8081/assets/app/assets/civilizations/de/turks.png"),
            Build(
                id: "4", title: "Fast Scouts", civilization: "Franks",
                image: "http://192.168.7.185:8081/assets/app/assets/civilizations/de/franks.png"),
        ],
        title: "Build Orders"
    )
}

@available(iOS 17.0, *)#Preview("TimelineMedium", as: .systemMedium){
    BuildsWidget()
} timeline: {
    BuildsEntry(
        date: Date(),
        builds: [
            Build(
                id: "1", title: "Fast Castle into Boom", civilization: "Lithuanians",
                image:
                    "http://192.168.7.185:8081/assets/app/assets/civilizations/de/lithuanians.png"),
            Build(
                id: "2", title: "Men at Arms into Archers", civilization: "Generic",
                image: "http://192.168.7.185:8081/assets/app/assets/civilizations/generic.png"),
        ],
        title: nil
    )
}
