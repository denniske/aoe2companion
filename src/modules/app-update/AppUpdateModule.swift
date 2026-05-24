internal import ExpoModulesCore

class AppUpdateModule: Module {
  public func definition() -> ModuleDefinition {
    Constant("Hello") {
      return "Hello iOS inline modules2!"
    }
  }
}
