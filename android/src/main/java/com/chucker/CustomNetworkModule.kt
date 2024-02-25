package com.chucker

import android.content.Context
import com.chuckerteam.chucker.api.ChuckerInterceptor
import com.facebook.react.modules.network.OkHttpClientFactory
import com.facebook.react.modules.network.OkHttpClientProvider
import okhttp3.OkHttpClient

class CustomNetworkModule(private val context: Context) : OkHttpClientFactory {
    override fun createNewNetworkModuleClient(): OkHttpClient {
        val builder = OkHttpClientProvider.createClientBuilder()
        builder.addInterceptor(ChuckerInterceptor(context))

        return builder.build()
    }
}