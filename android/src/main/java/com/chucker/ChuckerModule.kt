package com.chucker

import android.content.Context
import com.facebook.react.modules.network.OkHttpClientProvider
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

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
}
