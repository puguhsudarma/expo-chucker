package com.chucker

import android.content.Context
import com.chuckerteam.chucker.api.ChuckerInterceptor
import okhttp3.Call
import okhttp3.Connection
import okhttp3.Interceptor
import okhttp3.MediaType
import okhttp3.Request
import okhttp3.RequestBody
import okhttp3.Response
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import java.util.concurrent.TimeUnit

class ChuckerMultipartInterceptor(context: Context) : Interceptor {
    private val chuckerInterceptor = ChuckerInterceptor.Builder(context).build()

    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val isMultipart = request.body?.contentType()?.type?.contains("multipart", ignoreCase = true) == true

        if (isMultipart) {
            val placeholderBody = "(binary)".toRequestBody("text/plain".toMediaTypeOrNull())
            val placeholderRequest = request.newBuilder()
                .method(request.method, placeholderBody)
                .build()

            val supportChain = MultipartSupportChain(chain, placeholderRequest)
            return chuckerInterceptor.intercept(supportChain)
        } else {
            return chuckerInterceptor.intercept(chain)
        }
    }

    private class MultipartSupportChain(
        private val delegate: Interceptor.Chain,
        private val placeholderRequest: Request
    ) : Interceptor.Chain {
        override fun call(): Call = delegate.call()
        override fun connectTimeoutMillis(): Int = delegate.connectTimeoutMillis()
        override fun connection(): Connection? = delegate.connection()
        override fun readTimeoutMillis(): Int = delegate.readTimeoutMillis()
        override fun request(): Request = placeholderRequest
        override fun writeTimeoutMillis(): Int = delegate.writeTimeoutMillis()

        override fun proceed(request: Request): Response {
            val originalBody = delegate.request().body
            
            val finalRequest = request.newBuilder()
                .method(request.method, originalBody)
                .build()
            
            return delegate.proceed(finalRequest)
        }

        override fun withConnectTimeout(timeout: Int, unit: TimeUnit): Interceptor.Chain {
            return MultipartSupportChain(delegate.withConnectTimeout(timeout, unit), placeholderRequest)
        }

        override fun withReadTimeout(timeout: Int, unit: TimeUnit): Interceptor.Chain {
            return MultipartSupportChain(delegate.withReadTimeout(timeout, unit), placeholderRequest)
        }

        override fun withWriteTimeout(timeout: Int, unit: TimeUnit): Interceptor.Chain {
            return MultipartSupportChain(delegate.withWriteTimeout(timeout, unit), placeholderRequest)
        }
    }
}
