package com.chucker

import android.content.Context
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
            // already checked chucker no-op in gradle dependencies
            OkHttpClientProvider.setOkHttpClientFactory(CustomNetworkModule(context))
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
