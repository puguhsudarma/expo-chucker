package com.chucker

import android.content.Context
import android.content.pm.PackageManager
import android.util.Log
import com.chuckerteam.chucker.api.ChuckerInterceptor
import com.facebook.react.modules.network.OkHttpClientFactory
import com.facebook.react.modules.network.OkHttpClientProvider
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import okhttp3.OkHttpClient

class ChuckerModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("Chucker")

        OnCreate {
            val isEnabled = context.packageManager.getApplicationInfo(
                context.packageName,
                PackageManager.GET_META_DATA
            ).metaData.getBoolean("CHUCKER_ENABLED", true)

            Log.d("Chucker", "isEnabled: $isEnabled")

            if (isEnabled) {
                OkHttpClientProvider.setOkHttpClientFactory(CustomNetworkModule(context))
            }
        }
    }

    private val context: Context
        get() = requireNotNull(appContext.reactContext) {
            "React Application Context is null"
        }

    internal class CustomNetworkModule(private val context: Context) : OkHttpClientFactory {
        override fun createNewNetworkModuleClient(): OkHttpClient {
            val builder = OkHttpClientProvider.createClientBuilder()
            builder.addInterceptor(ChuckerInterceptor(context))

            return builder.build()
        }
    }
}
