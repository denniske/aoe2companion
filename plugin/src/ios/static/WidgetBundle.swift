import SwiftUI
import WidgetKit

@main
struct AoeCompanionWidgetBundle: WidgetBundle {
    
    @WidgetBundleBuilder
    var body: some Widget {
        BuildsWidget()
        LiveGameWidget()
    }

}