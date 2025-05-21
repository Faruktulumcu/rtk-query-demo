package com.demo.rtk.controller

import com.demo.rtk.model.LoginRequest
import com.demo.rtk.storage.InMemoryData
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class UserController {

    @PostMapping("/login")
    fun login(@RequestBody loginRequest: LoginRequest): ResponseEntity<Any> {
        val user = InMemoryData.users.find { it.username == loginRequest.username }
        return if (user != null && loginRequest.password == "demo") {
            ResponseEntity.ok(
                mapOf(
                    "token" to user.token,
                    "userId" to user.id,
                    "username" to user.username
                )
            )
        } else {
            ResponseEntity.status(401).body("Invalid credentials")
        }
    }
}