package com.demo.rtk.controller

import com.demo.rtk.model.AddBookRequest
import com.demo.rtk.model.Book
import com.demo.rtk.model.UserBook
import com.demo.rtk.storage.InMemoryData
import com.demo.rtk.utils.withAuthenticatedUser

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class BookController {

    @GetMapping("/books")
    fun getUserBooks(@RequestHeader("Authorization") auth: String?): ResponseEntity<Any> =
        withAuthenticatedUser(auth) { user ->
            val books = InMemoryData.userBooks
                .filter { it.userId == user.id }
                .map { it.book }

            ResponseEntity.ok(books)
        }

    @PostMapping("/books")
    fun addBook(
        @RequestHeader("Authorization") auth: String?,
        @RequestBody body: AddBookRequest
    ): ResponseEntity<Any> =
        withAuthenticatedUser(auth) { user ->
            val id = "b${InMemoryData.nextBookId++}"
            val book = UserBook(user.id, Book(id, body.title, body.author, body.isbn, body.thumbnailUrl))
            InMemoryData.userBooks.add(book)
            ResponseEntity.status(HttpStatus.CREATED).body(book)
        }

    @GetMapping("/books/{id}")
    fun getBook(
        @RequestHeader("Authorization") auth: String?,
        @PathVariable id: String
    ): ResponseEntity<Any> =
        withAuthenticatedUser(auth) { user ->
            val book = InMemoryData.userBooks
                .find { it.book.id == id && it.userId == user.id }
                ?.book

            if (book != null) {
                ResponseEntity.ok(book)
            } else {
                ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found")
            }
        }
}