package com.demo.rtk.utils

import com.demo.rtk.model.User
import com.demo.rtk.storage.InMemoryData
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

fun getUser(authHeader: String?): User? {
    if (authHeader == null || !authHeader.startsWith("Bearer ")) return null
    val token = authHeader.removePrefix("Bearer ").trim()
    return InMemoryData.users.find { it.token == token }
}

inline fun withAuthenticatedUser(authHeader: String?, block: (User) -> ResponseEntity<Any>): ResponseEntity<Any> {
    val user = getUser(authHeader) ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized")
    return block(user)
}