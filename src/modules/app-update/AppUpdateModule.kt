package app

//import android.app.Activity
//import android.content.Context
//import android.content.Intent
//import androidx.activity.result.ActivityResultLauncher
//import androidx.activity.result.IntentSenderRequest
//import androidx.activity.result.contract.ActivityResultContracts
//import androidx.annotation.NonNull
//import com.google.android.gms.tasks.Task
//import com.google.android.play.core.appupdate.AppUpdateInfo
//import com.google.android.play.core.appupdate.AppUpdateManagerFactory
//import com.google.android.play.core.appupdate.AppUpdateOptions
//import com.google.android.play.core.install.model.AppUpdateType
//import com.google.android.play.core.install.model.UpdateAvailability
//import expo.modules.core.interfaces.ActivityEventListener
//import expo.modules.kotlin.Promise
//import expo.modules.kotlin.activityresult.AppContextActivityResultLauncher
//import expo.modules.kotlin.exception.Exceptions
//import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

//import kotlinx.coroutines.suspendCancellableCoroutine
//import kotlin.coroutines.resume
//import kotlin.coroutines.resumeWithException


//suspend fun getAppUpdateInfo(appUpdateInfoTask: Task<AppUpdateInfo>): AppUpdateInfo {
//    return suspendCancellableCoroutine { continuation ->
//        appUpdateInfoTask.addOnSuccessListener { appUpdateInfo ->
//            continuation.resume(appUpdateInfo)
//        }
//        appUpdateInfoTask.addOnFailureListener { exception ->
//            continuation.resumeWithException(exception)
//        }
//        appUpdateInfoTask.addOnCanceledListener {
//            continuation.cancel()
//        }
//    }
//}

const val UPDATE_REQUEST_CODE: Int = 1

class AppUpdateModule : Module() {
    override fun definition() = ModuleDefinition {
        Constant("Hello") { ->
            "Hello Android inline modules!"
        }

//        AsyncFunction("getAppUpdateInfo") Coroutine { ->
//            val appUpdateManager = AppUpdateManagerFactory.create(context)
//            val appUpdateInfoTask = appUpdateManager.appUpdateInfo
//            val appUpdateInfo = getAppUpdateInfo(appUpdateInfoTask)
//
//            val appUpdateInfoMap = mapOf(
//                "updateAvailable" to (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE),
//                "android" to mapOf(
//                    "updateAvailability" to appUpdateInfo.updateAvailability(),
//                    "isUpdateTypeAllowed" to appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE),
//                    "updatePriority" to appUpdateInfo.updatePriority(),
//                    "clientVersionStalenessDays" to appUpdateInfo.clientVersionStalenessDays(),
//                    "availableVersionCode" to appUpdateInfo.availableVersionCode(),
//                    "packageName" to appUpdateInfo.packageName(),
//                    "installStatus" to appUpdateInfo.installStatus()
//                )
//            )
//
//            return@Coroutine appUpdateInfoMap
//        }
//
//        AsyncFunction("doAppUpdate") Coroutine { ->
//            val appUpdateManager = AppUpdateManagerFactory.create(context)
//            val appUpdateInfoTask = appUpdateManager.appUpdateInfo
//            val appUpdateInfo = expo.modules.appupdate.getAppUpdateInfo(appUpdateInfoTask)
//
//            val appUpdateInfoMap = mapOf(
//                "updateAvailable" to (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE),
//                "android" to mapOf(
//                    "updateAvailability" to appUpdateInfo.updateAvailability(),
//                    "isUpdateTypeAllowed" to appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE),
//                    "updatePriority" to appUpdateInfo.updatePriority(),
//                    "clientVersionStalenessDays" to appUpdateInfo.clientVersionStalenessDays(),
//                    "availableVersionCode" to appUpdateInfo.availableVersionCode(),
//                    "packageName" to appUpdateInfo.packageName(),
//                    "installStatus" to appUpdateInfo.installStatus()
//                )
//            )
//
//            println("appUpdateInfoMap")
//            println(appUpdateInfoMap)
//
//            val result = appUpdateManager.startUpdateFlowForResult(
//                appUpdateInfo,
//                AppUpdateType.IMMEDIATE,
//                // The current activity making the update request.
//                appContext.currentActivity as Activity,
//                // Include a request code to later monitor this update request.
//                expo.modules.appupdate.UPDATE_REQUEST_CODE
//            )
//
//            sendEvent(
//                "onChange", mapOf(
//                    "startUpdateFlowForResult" to result
//                )
//            )
//
//            // log the result
//            println("startUpdateFlowForResult")
//            println(result)
//
//            if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE
//                // This example applies an immediate update. To apply a flexible update
//                // instead, pass in AppUpdateType.FLEXIBLE
//                && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)
//            ) {
//
//            }
//
//            return@Coroutine appUpdateInfoMap
//        }
    }
}
