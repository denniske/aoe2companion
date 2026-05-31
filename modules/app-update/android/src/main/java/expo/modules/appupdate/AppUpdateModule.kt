package expo.modules.appupdate

import android.app.Activity
import android.content.Context
import android.content.Intent
//import androidx.activity.result.ActivityResultLauncher
//import androidx.activity.result.IntentSenderRequest
//import androidx.activity.result.contract.ActivityResultContracts
import androidx.annotation.NonNull
import com.google.android.gms.tasks.Task
import com.google.android.play.core.appupdate.AppUpdateInfo
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.appupdate.AppUpdateOptions
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.UpdateAvailability
import expo.modules.core.interfaces.ActivityEventListener
import expo.modules.kotlin.Promise
//import expo.modules.kotlin.activityresult.AppContextActivityResultLauncher
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

import kotlinx.coroutines.suspendCancellableCoroutine
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

suspend fun getAppUpdateInfo(appUpdateInfoTask: Task<AppUpdateInfo>): AppUpdateInfo {
    return suspendCancellableCoroutine { continuation ->
        appUpdateInfoTask.addOnSuccessListener { appUpdateInfo ->
            continuation.resume(appUpdateInfo)
        }
        appUpdateInfoTask.addOnFailureListener { exception ->
            continuation.resumeWithException(exception)
        }
        appUpdateInfoTask.addOnCanceledListener {
            continuation.cancel()
        }
    }
}

const val UPDATE_REQUEST_CODE: Int = 1

class AppUpdateModule : Module() {

    val context: Context
        get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

//    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
//
//        println("onActivityResult")
//        println("requestCode: $requestCode")
//        println("resultCode: $resultCode")
//        println("data: $data")
//
//        this@ExpoAppUpdateModule.sendEvent(
//            "onChange", mapOf(
//                "onActivityResult" to "test"
//            )
//        )
//
//        sendEvent(
//            "onChange", mapOf(
//                "onActivityResult" to "test"
//            )
//        )
//
//        if (requestCode == UPDATE_REQUEST_CODE) {
//            when (resultCode) {
//                Activity.RESULT_OK -> {
//                    // Handle success
//                }
//
//                Activity.RESULT_CANCELED -> {
//                    // Handle cancellation
//                }
//
//                Activity.RESULT_FIRST_USER -> {
//                    // Handle any other custom results
//                }
//            }
//        }
//    }
//
//    override fun onNewIntent(intent: Intent?) {
//        println("onNewIntent")
//        TODO("Not yet implemented")
//    }

    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    override fun definition() = ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('ExpoAppUpdate')` in JavaScript.
        Name("AppUpdate")

        // Defines event names that the module can send to JavaScript.
        Events("onChange")

        // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
        Function("Hello") {
            "Hello world android 3! 👋"
        }

        AsyncFunction("doAppUpdate") Coroutine { ->
            val appUpdateManager = AppUpdateManagerFactory.create(context)
            val appUpdateInfoTask = appUpdateManager.appUpdateInfo
            val appUpdateInfo = getAppUpdateInfo(appUpdateInfoTask)

            val appUpdateInfoMap = mapOf(
                "updateAvailable" to (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE),
                "android" to mapOf(
                    "updateAvailability" to appUpdateInfo.updateAvailability(),
                    "isUpdateTypeAllowed" to appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE),
                    "updatePriority" to appUpdateInfo.updatePriority(),
                    "clientVersionStalenessDays" to appUpdateInfo.clientVersionStalenessDays(),
                    "availableVersionCode" to appUpdateInfo.availableVersionCode(),
                    "packageName" to appUpdateInfo.packageName(),
                    "installStatus" to appUpdateInfo.installStatus()
                )
            )

            println("appUpdateInfoMap")
            println(appUpdateInfoMap)

            val result = appUpdateManager.startUpdateFlowForResult(
                appUpdateInfo,
                AppUpdateType.IMMEDIATE,
                // The current activity making the update request.
                appContext.currentActivity as Activity,
                // Include a request code to later monitor this update request.
                UPDATE_REQUEST_CODE
            )

            sendEvent(
                "onChange", mapOf(
                    "startUpdateFlowForResult" to result
                )
            )

            // log the result
            println("startUpdateFlowForResult")
            println(result)

            if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE
                // This example applies an immediate update. To apply a flexible update
                // instead, pass in AppUpdateType.FLEXIBLE
                && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)
            ) {

            }

            return@Coroutine appUpdateInfoMap
        }

        RegisterActivityContracts {

        }

        AsyncFunction("getAppUpdateInfo") Coroutine { ->
            val appUpdateManager = AppUpdateManagerFactory.create(context)
            val appUpdateInfoTask = appUpdateManager.appUpdateInfo
            val appUpdateInfo = getAppUpdateInfo(appUpdateInfoTask)

            val appUpdateInfoMap = mapOf(
                "updateAvailable" to (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE),
                "android" to mapOf(
                    "updateAvailability" to appUpdateInfo.updateAvailability(),
                    "isUpdateTypeAllowed" to appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE),
                    "updatePriority" to appUpdateInfo.updatePriority(),
                    "clientVersionStalenessDays" to appUpdateInfo.clientVersionStalenessDays(),
                    "availableVersionCode" to appUpdateInfo.availableVersionCode(),
                    "packageName" to appUpdateInfo.packageName(),
                    "installStatus" to appUpdateInfo.installStatus()
                )
            )

            return@Coroutine appUpdateInfoMap
        }
    }
}
