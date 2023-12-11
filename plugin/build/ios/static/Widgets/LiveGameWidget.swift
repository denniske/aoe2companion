//  WidgetBundle.swift
//  widget
//

import WidgetKit
import SwiftUI
import Foundation

struct GameProvider: TimelineProvider {
    func placeholder(in context: Context) -> GameSimpleEntry {
        GameSimpleEntry(date: Date(), text: "Placeholder")
    }
    
    func getSnapshot(in context: Context, completion: @escaping (GameSimpleEntry) -> ()) {
        let entry = GameSimpleEntry(date: Date(), text: "Live Game Snapshot")
        completion(entry)
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let text = getItem()
        
        let entry = GameSimpleEntry(date: Date(), text: text)
        
        let timeline = Timeline(entries: [entry], policy: .never)
        completion(timeline)
    }
    
    
    private func getItem() -> String {
        let userDefaults = UserDefaults(suiteName: "group.com.example.widget")
        return userDefaults?.string(forKey: "savedData") ?? ""
    }
    
}

struct GameSimpleEntry: TimelineEntry {
    let date: Date
    let text: String
}

struct GameWidgetEntryView : View {
    var entry: GameProvider.Entry
    
    var body: some View {
        Text("Game Entry")
    }
}

struct LiveGameWidget: Widget {
    let kind: String = "LiveGame"
    
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: GameProvider()) { entry in
            GameWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Live Game")
        .description("Quick access to your live game")
        .supportedFamilies([.systemSmall])
    }
}

struct LiveGameWidget_Previews: PreviewProvider {
    static var previews: some View {
        GameWidgetEntryView(entry: GameSimpleEntry(date: Date(), text: "Preview"))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
