package expo.modules.httptimeout

import android.app.Application
import android.content.Context
import com.facebook.react.modules.network.OkHttpClientProvider
import expo.modules.core.interfaces.ApplicationLifecycleListener
import expo.modules.core.interfaces.Package
import java.util.concurrent.TimeUnit

// React Native's OkHttp client multiplexes every request to a host over one pooled HTTP/2
// connection and never checks whether that connection is still alive. When a network silently
// drops it (a NAT or router expiring it while the app sat idle), every request to the host is queued
// on the dead connection and hangs until the OS kills the socket -- the "nothing loads, a few
// minutes later it works" reports.
//
// pingInterval makes OkHttp ping each HTTP/2 connection and close it when no pong comes back, so the
// next request opens a fresh one. Only that is set here: timeouts stay at RN's 0 (none) and are
// enforced per request in fetchJson, because they differ per endpoint (match analysis can be silent
// for up to 30s while the server parses the recording, which an OkHttp read timeout would kill).
class HttpTimeoutPackage : Package {
    override fun createApplicationLifecycleListeners(context: Context): List<ApplicationLifecycleListener> =
        listOf(object : ApplicationLifecycleListener {
            override fun onCreate(application: Application) {
                OkHttpClientProvider.setOkHttpClientFactory {
                    // createClientBuilder keeps RN's own setup (cache, cookie jar, user agent).
                    OkHttpClientProvider.createClientBuilder(application)
                        .pingInterval(15, TimeUnit.SECONDS)
                        .build()
                }
            }
        })
}
