package com.aoe2companion.widget

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

class WidgetModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("Widget")

        Events("onChange")

        Function("setAppGroup") {
            "Hello world! 👋"
        }

        Function("reloadAll") {
            "Hello world! 👋"
        }

        Function("setItem") {
            "Hello world! 👋"
        }

        Function("hasImage") {
            "Hello world! 👋"
        }

        Function("setImage") {
            "Hello world! 👋"
        }

        Function("getItem") {
            "Hello world! 👋"
        }
    }
}

class LiveActivityModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("LiveActivity")

        Events("onTokenChanged", "onActivityStarted", "onTest")

        Function("enable") {
            "Hello world! 👋"
        }

    }
}
