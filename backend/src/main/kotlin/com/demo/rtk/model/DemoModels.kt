package com.demo.rtk.model

data class User(val id: String, val username: String, val token: String)

data class Book(
    val id: String,
    val title: String,
    val author: String,
    val isbn: String,
    val thumbnailUrl: String? = null
)

data class UserBook(
    val userId: String,
    val book: Book
)

data class Review(
    val id: String,
    val bookId: String,
    val userId: String,
    val username: String,
    val content: String,
    val public: Boolean,
    val createdAt: String
)

data class LoginRequest(val username: String, val password: String)

data class AddBookRequest(val title: String, val author: String, val isbn: String, val thumbnailUrl: String? = null)

data class UpsertReviewRequest(val content: String, val public: Boolean)