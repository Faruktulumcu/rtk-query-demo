package com.demo.rtk.controller

import com.demo.rtk.model.UpsertReviewRequest
import com.demo.rtk.model.Review
import com.demo.rtk.storage.InMemoryData
import com.demo.rtk.utils.withAuthenticatedUser
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

@RestController
@RequestMapping("/api")
class ReviewController {

    @GetMapping("/books/{id}/reviews")
    fun getMyReviews(
        @RequestHeader("Authorization") auth: String?,
        @PathVariable id: String
    ): ResponseEntity<Any> = withAuthenticatedUser(auth) { user ->
        val userReviews = InMemoryData.reviews
            .filter { it.bookId == id && it.userId == user.id }
            .sortedByDescending { ZonedDateTime.parse(it.createdAt) }
        ResponseEntity.ok(userReviews)
    }

    @PostMapping("/books/{id}/reviews")
    fun addReview(
        @RequestHeader("Authorization") auth: String?,
        @PathVariable id: String,
        @RequestBody req: UpsertReviewRequest
    ): ResponseEntity<Any> = withAuthenticatedUser(auth) { user ->
        val review = Review(
            id = "r${InMemoryData.nextReviewId++}",
            bookId = id,
            userId = user.id,
            username = user.username,
            content = req.content,
            public = req.public,
            createdAt = ZonedDateTime.now().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)
        )
        InMemoryData.reviews.add(review)
        ResponseEntity.status(HttpStatus.CREATED).body(review)
    }

    @GetMapping("/books/{isbn}/public-reviews")
    fun getPublicReviews(
        @RequestHeader("Authorization") auth: String?,
        @PathVariable isbn: String
    ): ResponseEntity<Any> = withAuthenticatedUser(auth) { user ->
        val book = InMemoryData.userBooks.find { it.book.isbn == isbn }
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found")
        val publicReviews = InMemoryData.reviews
            .filter { it.bookId == book.book.id && it.public && it.userId != user.id }
            .sortedByDescending { ZonedDateTime.parse(it.createdAt) }
        return ResponseEntity.ok(publicReviews)
    }

    @PutMapping("/books/{bookId}/reviews/{reviewId}")
    fun updateReview(
        @RequestHeader("Authorization") auth: String?,
        @PathVariable bookId: String,
        @PathVariable reviewId: String,
        @RequestBody req: UpsertReviewRequest
    ): ResponseEntity<Any> = withAuthenticatedUser(auth) { user ->
        val review = InMemoryData.reviews.find { it.id == reviewId && it.bookId == bookId && it.userId == user.id }
        if (review == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Review not found or not owned by user")
        }
        val updatedReview = review.copy(content = req.content, public = req.public)
        InMemoryData.reviews.removeIf { it.id == reviewId }
        InMemoryData.reviews.add(updatedReview)

        ResponseEntity.ok(updatedReview)
    }

    @DeleteMapping("/books/{bookId}/reviews/{reviewId}")
    fun deleteReview(
        @RequestHeader("Authorization") auth: String?,
        @PathVariable bookId: String,
        @PathVariable reviewId: String
    ): ResponseEntity<Any> = withAuthenticatedUser(auth) { user ->
        val review = InMemoryData.reviews.find { it.id == reviewId && it.bookId == bookId && it.userId == user.id }
        if (review == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Review not found or not owned by user")
        }
        InMemoryData.reviews.removeIf { it.id == reviewId }
        ResponseEntity.noContent().build()
    }
}