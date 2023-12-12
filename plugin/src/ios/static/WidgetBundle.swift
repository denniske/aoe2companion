import SwiftUI
import WidgetKit

@main
struct AoeCompanionWidgetBundle: WidgetBundle {

    @WidgetBundleBuilder
    var body: some Widget {
        getWidgets()
    }

    private func getWidgets() -> some Widget {
        if #available(iOS 16.1, *) {
            return WidgetBundleBuilder.buildBlock(
                BuildsWidget(),
                LiveGameWidget()
            )
        } else {
            return WidgetBundleBuilder.buildBlock(
                BuildsWidget()
            )
        }
    }
}
