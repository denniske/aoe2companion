import Foundation
import Intents
import SwiftUI
import WidgetKit

enum CivilizationMap: Int {
    case unknown
    case All
    case Armenians
    case Aztecs
    case Bengalis
    case Berbers
    case Bohemians
    case Britons
    case Bulgarians
    case Burgundians
    case Burmese
    case Byzantines
    case Celts
    case Chinese
    case Cumans
    case Dravidians
    case Ethiopians
    case Franks
    case Georgians
    case Goths
    case Gurjaras
    case Huns
    case Incas
    case Hindustanis
    case Italians
    case Japanese
    case Khmer
    case Koreans
    case Lithuanians
    case Magyars
    case Malay
    case Malians
    case Mayans
    case Mongols
    case Persians
    case Poles
    case Portuguese
    case Romans
    case Saracens
    case Sicilians
    case Slavs
    case Spanish
    case Tatars
    case Teutons
    case Turks
    case Vietnamese
    case Vikings
}

extension CivilizationMap {
    var civilization: String {
        switch self {
        case .unknown:
            return "All"
        case .All:
            return "All"
        case .Armenians:
            return "Armenians"
        case .Aztecs:
            return "Aztecs"
        case .Bengalis:
            return "Bengalis"
        case .Berbers:
            return "Berbers"
        case .Bohemians:
            return "Bohemians"
        case .Britons:
            return "Britons"
        case .Bulgarians:
            return "Bulgarians"
        case .Burgundians:
            return "Burgundians"
        case .Burmese:
            return "Burmese"
        case .Byzantines:
            return "Byzantines"
        case .Celts:
            return "Celts"
        case .Chinese:
            return "Chinese"
        case .Cumans:
            return "Cumans"
        case .Dravidians:
            return "Dravidians"
        case .Ethiopians:
            return "Ethiopians"
        case .Franks:
            return "Franks"
        case .Georgians:
            return "Georgians"
        case .Goths:
            return "Goths"
        case .Gurjaras:
            return "Gurjaras"
        case .Huns:
            return "Huns"
        case .Incas:
            return "Incas"
        case .Hindustanis:
            return "Hindustanis"
        case .Italians:
            return "Italians"
        case .Japanese:
            return "Japanese"
        case .Khmer:
            return "Khmer"
        case .Koreans:
            return "Koreans"
        case .Lithuanians:
            return "Lithuanians"
        case .Magyars:
            return "Magyars"
        case .Malay:
            return "Malay"
        case .Malians:
            return "Malians"
        case .Mayans:
            return "Mayans"
        case .Mongols:
            return "Mongols"
        case .Persians:
            return "Persians"
        case .Poles:
            return "Poles"
        case .Portuguese:
            return "Portuguese"
        case .Romans:
            return "Romans"
        case .Saracens:
            return "Saracens"
        case .Sicilians:
            return "Sicilians"
        case .Slavs:
            return "Slavs"
        case .Spanish:
            return "Spanish"
        case .Tatars:
            return "Tatars"
        case .Teutons:
            return "Teutons"
        case .Turks:
            return "Turks"
        case .Vietnamese:
            return "Vietnamese"
        case .Vikings:
            return "Vikings"
        }
    }
}

extension View {
    func widgetBackground(_ backgroundView: some View) -> some View {
        if #available(iOSApplicationExtension 17.0, *) {
            return containerBackground(for: .widget) {
                backgroundView
            }
        } else {
            return background(backgroundView)
        }
    }
}

extension WidgetConfiguration {
    func contentMarginsDisabledIfAvailable() -> some WidgetConfiguration {
        if #available(iOSApplicationExtension 15.0, *) {
            return self.contentMarginsDisabled()
        } else {
            return self
        }
    }
}

struct Build: Decodable, Identifiable, Hashable {
    let id: String
    let title: String
    let civilization: String
}

struct Provider: IntentTimelineProvider {

    func placeholder(in context: Context) -> BuildsEntry {
        BuildsEntry(date: Date(), builds: [])
    }

    func getSnapshot(
        for configuration: BuildsConfigurationIntent, in context: Context,
        completion: @escaping (BuildsEntry) -> Void
    ) {
        let entry = BuildsEntry(date: Date(), builds: [])
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

        let entry = BuildsEntry(date: Date(), builds: builds)

        let timeline = Timeline(entries: [entry], policy: .never)
        completion(timeline)
    }

    private func getItem() -> [Build] {
        let userDefaults = UserDefaults(suiteName: "group.com.example.widget")
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
}

struct BuildsWidgetEntryView: View {
    var entry: Provider.Entry

    var body: some View {
        ZStack {
            VStack(spacing: 12) {
                Text("Builds Orders")
                    .foregroundColor(
                        Color(UIColor.label)
                    )
                    .font(.system(size: 18, weight: .bold))
                ForEach(entry.builds, id: \.self) { build in
                    Link(destination: URL(string: "aoe2companion://guide/\(build.id)")!) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(build.title)
                                .foregroundColor(
                                    Color(UIColor.label)
                                )
                                .font(.system(size: 16, weight: .bold))
                            HStack(alignment: .center) {
                                Image(build.civilization).resizable()
                                    .aspectRatio(contentMode: .fit)
                                    .frame(width: 15, height: 15)
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

@available(iOS 17.0, *)#Preview("Timeline", as: .systemLarge){
    BuildsWidget()
} timeline: {
    BuildsEntry(
        date: Date(),
        builds: [
            Build(id: "1", title: "Fast Castle into Boom", civilization: "Lithuanians"),
            Build(id: "2", title: "Men at Arms into Archers", civilization: "Generic"),
            Build(id: "3", title: "Fast Imperial", civilization: "Turks"),
            Build(id: "4", title: "Fast Scouts", civilization: "Franks"),
        ]
    )
}
