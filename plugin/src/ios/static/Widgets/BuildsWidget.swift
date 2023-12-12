import Foundation
import SwiftUI
import WidgetKit

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

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> BuildsEntry {
        BuildsEntry(date: Date(), builds: [])
    }

    func getSnapshot(in context: Context, completion: @escaping (BuildsEntry) -> Void) {
        let entry = BuildsEntry(date: Date(), builds: [])
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<BuildsEntry>) -> Void) {
        let items = getItem()
        let length = context.family == .systemMedium ? 2 : 4
        let builds = items.count > length ? Array(items[0..<length]) : items

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
                    .font(.system(size: 18, weight: .bold)).padding(5)
                ForEach(entry.builds, id: \.self) { build in
                    Link(destination: URL(string: "aoe2companion://guide/\(build.id)")!) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(build.title)
                                .foregroundColor(
                                    Color(UIColor.label)
                                )
                                .font(.system(size: 14, weight: .bold))
                            HStack(alignment: .center) {
                                Text(build.civilization)
                                    .font(Font.system(size: 12, weight: .regular))
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
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
        }.widgetBackground(Color(UIColor.systemBackground))
    }
}

struct BuildsWidget: Widget {
    let kind: String = "Builds"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            BuildsWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Build Orders")
        .description("Quick access to your favorite build order")
        .supportedFamilies([.systemMedium, .systemLarge])
        .contentMarginsDisabledIfAvailable()
    }
}

struct BuildsWidget_Previews: PreviewProvider {
    static var previews: some View {
        BuildsWidgetEntryView(
            entry: BuildsEntry(
                date: Date(),
                builds: [
                    Build(id: "1", title: "Fast Castle into Boom", civilization: "Lithuanians"),
                    Build(id: "2", title: "Men at Arms into Archers", civilization: "Generic"),
                    Build(id: "3", title: "Fast Imperial", civilization: "Turks"),
                    Build(id: "4", title: "Fast Scouts", civilization: "Franks"),
                ])
        )
        .previewContext(
            WidgetPreviewContext(
                family: .systemLarge
            ))
    }
}
