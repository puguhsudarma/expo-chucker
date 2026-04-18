package com.chucker

import android.content.Context
import com.chuckerteam.chucker.api.ChuckerInterceptor
import okhttp3.Call
import okhttp3.Connection
import okhttp3.Interceptor
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.Request
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import okio.Buffer
import java.util.concurrent.TimeUnit

class ChuckerMultipartInterceptor(context: Context) : Interceptor {
    private val chuckerInterceptor = ChuckerInterceptor.Builder(context).build()

    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val isMultipart = request.body?.contentType()?.type?.contains("multipart", ignoreCase = true) == true
        val unwrappedBody = unwrapBody(request.body)

        val newRequest = when {
            isMultipart && unwrappedBody is MultipartBody -> processMultipartRequest(request, unwrappedBody)
            isMultipart -> processUnknownMultipartRequest(request)
            else -> null
        }

        return if (newRequest != null) {
            chuckerInterceptor.intercept(MultipartSupportChain(chain, newRequest))
        } else {
            chuckerInterceptor.intercept(chain)
        }
    }

    private fun processMultipartRequest(request: Request, multipartBody: MultipartBody): Request {
        val builder = MultipartBody.Builder().setType(multipartBody.type)

        multipartBody.parts.forEach { part ->
            builder.addPart(part.headers, createPartBody(part))
        }

        val newRequestBody = builder.build()
        return request.newBuilder()
            .method(request.method, newRequestBody)
            .build()
    }

    private fun createPartBody(part: MultipartBody.Part): RequestBody {
        val headers = part.headers
        val body = part.body
        val contentDisposition = headers?.get("Content-Disposition")

        return if (contentDisposition?.contains("filename=", ignoreCase = true) == true) {
            val size = body.contentLength()
            val sizeString = when {
                size == -1L -> "unknown size"
                size < 1024 -> "$size B"
                else -> "${size / 1024} KB"
            }
            "(binary) - $sizeString".toRequestBody("text/plain".toMediaTypeOrNull())
        } else {
            val buffer = Buffer()
            body.writeTo(buffer)
            buffer.readByteString().toRequestBody(body.contentType())
        }
    }

    private fun processUnknownMultipartRequest(request: Request): Request {
        val placeholderBody = "(binary)".toRequestBody("text/plain".toMediaTypeOrNull())
        return request.newBuilder()
            .method(request.method, placeholderBody)
            .build()
    }

    private fun unwrapBody(body: RequestBody?): RequestBody? {
        if (body == null) return null

        if (body.javaClass.name.contains("ProgressRequestBody")) {
            try {
                val fields = body.javaClass.declaredFields
                for (field in fields) {
                    if (RequestBody::class.java.isAssignableFrom(field.type)) {
                        field.isAccessible = true
                        val innerBody = field.get(body) as? RequestBody
                        if (innerBody != null && innerBody != body) {
                            return unwrapBody(innerBody)
                        }
                    }
                }
            } catch (ignored: Exception) {
            }
        }

        return body
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
