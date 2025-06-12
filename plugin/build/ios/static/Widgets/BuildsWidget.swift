import Foundation
import Intents
import SwiftUI
import WidgetKit

struct Build: Decodable, Identifiable, Hashable {
    let id: String
    let title: String
    let civilization: String
    let image: String
    let icon: String
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
                        HStack(alignment: .center, spacing: 8) {
                            NetworkImage(url: URL(string: build.icon)).frame(
                                width: 36, height: 36)
                            VStack(alignment: .leading, spacing: 2) {
                                HStack(alignment: .center) {
                                    NetworkImage(url: URL(string: build.image)).frame(
                                        width: 18, height: 18)
                                    Text(build.civilization)
                                        .font(Font.system(size: 14, weight: .regular))
                                        .foregroundColor(
                                            Color(UIColor.secondaryLabel))
                                    Spacer()
                                }
                                Text(build.title)
                                    .foregroundColor(
                                        Color(UIColor.label)
                                    )
                                    .font(.system(size: 16, weight: .semibold))

                            }

                        }
                        .padding(10)
                        .background(Color(UIColor.dynamicColor(light: "#FFFFFF", dark: "#181C29")))
                        .cornerRadius(10).overlay(
                            RoundedRectangle(cornerRadius: 10)
                                .stroke(
                                    Color(UIColor.dynamicColor(light: "#E5E5E5", dark: "#27272A")),
                                    lineWidth: 1)
                        )
                    }
                }
            }.padding(15)
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
        }.widgetBackground(Color(UIColor.dynamicColor(light: "#FFFCF5", dark: "#0E1017")))
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
                    "http://192.168.7.185:8081/assets/app/assets/civilizations/de/lithuanians.png",
                icon:
                    "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FCastle.png?alt=media&token=16a7511e-6ce2-49e4-a198-3020b18c6871"
            ),
            Build(
                id: "2", title: "Men at Arms into Archers", civilization: "Generic",
                image: "http://192.168.7.185:8081/assets/app/assets/civilizations/generic.png",
                icon:
                    "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FMan-at-Arms.png?alt=media&token=3d86a2c0-835d-4dbe-844d-cecb1da83773"
            ),
            Build(
                id: "3", title: "Fast Imperial", civilization: "Turks",
                image: "http://192.168.7.185:8081/assets/app/assets/civilizations/de/turks.png",
                icon:
                    "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FFast%20Imperial.png?alt=media&token=0d8d1c36-fe49-41f3-b8d7-9f6aa3c6cd6e"
            ),
            Build(
                id: "4", title: "Fast Scouts", civilization: "Franks",
                image: "http://192.168.7.185:8081/assets/app/assets/civilizations/de/franks.png",
                icon:
                    "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FScout.png?alt=media&token=62e0c066-bc52-4ae3-9624-deee2d4fe505"
            ),
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
                    "http://192.168.7.185:8081/assets/app/assets/civilizations/de/lithuanians.png",
                icon:
                    "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FCastle.png?alt=media&token=16a7511e-6ce2-49e4-a198-3020b18c6871"
            ),
            Build(
                id: "2", title: "Men at Arms into Archers", civilization: "Generic",
                image: "http://192.168.7.185:8081/assets/app/assets/civilizations/generic.png",
                icon:
                    "https://firebasestorage.googleapis.com/v0/b/build-order-guide.appspot.com/o/Images%2FMan-at-Arms.png?alt=media&token=3d86a2c0-835d-4dbe-844d-cecb1da83773"
            ),
        ],
        title: nil
    )
}
