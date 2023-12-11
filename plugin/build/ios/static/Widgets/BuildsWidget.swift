import Foundation
import SwiftUI
import WidgetKit

struct Build: Decodable, Identifiable, Hashable {
    let id: String
    let title: String
    let civilization: String
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), builds: [])
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> Void) {
        let entry = SimpleEntry(date: Date(), builds: [])
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> Void) {
        let items = getItem()
        let length = context.family == .systemMedium ? 2 : 4
        let builds = items.count > length ? Array(items[0..<length]) : items

        let entry = SimpleEntry(date: Date(), builds: builds)

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

struct SimpleEntry: TimelineEntry {
    let date: Date
    let builds: [Build]
}

struct BuildsWidgetEntryView: View {
    var entry: Provider.Entry

    var body: some View {
        ZStack {
            VStack(alignment: .leading, spacing: 10) {
                ForEach(entry.builds, id: \.self) { build in
                    Link(destination: URL(string: "aoe2companion://guide/\(build.id)")!) {
                        VStack(alignment: .leading, spacing: 5) {
                            Text(build.title)
                                .foregroundColor(
                                    Color(red: 58 / 255, green: 42 / 255, blue: 3 / 255)
                                )
                                .font(.system(size: 14, weight: .bold, design: .rounded))
                            HStack(alignment: .center) {
                                Text(build.civilization)
                                    .font(Font.system(size: 12, weight: .regular, design: .rounded))
                                    .foregroundColor(
                                        Color(red: 115 / 255, green: 85 / 255, blue: 7 / 255))
                                Spacer()
                            }

                        }
                        .padding(10)
                        .background(Color(red: 249 / 255, green: 223 / 255, blue: 159 / 255))
                        .cornerRadius(10)
                    }
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }

    }
}

@available(iOS 17.0, macOS 14.0, tvOS 17.0, watchOS 10.0, *)#Preview(
    traits: .portrait,
    body: {
        BuildsWidgetEntryView(entry: SimpleEntry(date: Date(), builds: []))
    })

struct BuildsWidget: Widget {
    let kind: String = "Builds"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            BuildsWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Build Orders")
        .description("Quick access to your favorite build order")
        .supportedFamilies([.systemMedium, .systemLarge])
    }
}

struct BuildsWidget_Previews: PreviewProvider {
    static var previews: some View {
        BuildsWidgetEntryView(entry: SimpleEntry(date: Date(), builds: []))
            .previewContext(
                WidgetPreviewContext(
                    family: .systemMedium
                ))
    }
}

extension WidgetConfiguration {
    func contentMarginsDisabledIfAvailable() -> some WidgetConfiguration {
        if #available(iOSApplicationExtension 17.0, *) {
            return self.contentMarginsDisabled()
        } else {
            return self
        }
    }
}
