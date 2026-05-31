import ExpoModulesCore

public class AppUpdateModule: Module {
  public func definition() -> ModuleDefinition {
    Name("AppUpdate")

    Constant("Hello") {
      return "Hello iOS inline modules2!"
    }
  }
}
