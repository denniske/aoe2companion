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
// next request opens a fresh one.
//
// connectTimeout bounds each connection attempt to one address. RN leaves it at 0 (none), and
// OkHttp 4 has no happy-eyeballs fallback: our hosts resolve to IPv6 and IPv4, and on a network
// whose IPv6 route silently drops packets the connect to the IPv6 address hangs forever and IPv4 is
// never tried. Cancelling the call from JS does not count as a route failure, so a retry hangs the
// same way. A timeout does count, and OkHttp moves on to the next address. It only covers the
// connect, so slow responses are unaffected.
//
// Read/call timeouts stay at RN's 0 (none) and are enforced per request in fetchJson, because they
// differ per endpoint (match analysis can be silent for up to 30s while the server parses the
// recording, which an OkHttp read timeout would kill).
class HttpTimeoutPackage : Package {
    override fun createApplicationLifecycleListeners(context: Context): List<ApplicationLifecycleListener> =
        listOf(object : ApplicationLifecycleListener {
            override fun onCreate(application: Application) {
                OkHttpClientProvider.setOkHttpClientFactory {
                    // createClientBuilder keeps RN's own setup (cache, cookie jar, user agent).
                    OkHttpClientProvider.createClientBuilder(application)
                        .connectTimeout(10, TimeUnit.SECONDS)
                        .pingInterval(15, TimeUnit.SECONDS)
                        .build()
                }
            }
        })
}
