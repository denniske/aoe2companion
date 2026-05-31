package expo.modules.appupdate

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AppUpdateModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AppUpdate")
  }
}
