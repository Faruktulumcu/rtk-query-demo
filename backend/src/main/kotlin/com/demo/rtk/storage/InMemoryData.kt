package com.demo.rtk.storage

import com.demo.rtk.model.Book
import com.demo.rtk.model.Review
import com.demo.rtk.model.User
import com.demo.rtk.model.UserBook

object InMemoryData {
    val users = listOf(
        User("1", "alice", "token-alice"),
        User("2", "bob", "token-bob"),
        User("3", "carol", "token-carol")
    )

    val books = mutableListOf(
        Book("b1", "Clean Code", "Robert C. Martin", "9783826655487", "https://books.google.com/books/content?id=HGxKPgAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"),
        Book("b2", "The Pragmatic Programmer", "Andrew Hunt", "9780132119177", "https://books.google.com/books/content?id=5wBQEp6ruIAC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api")
    )

    val userBooks = mutableListOf(
        UserBook("1", books.find { it.id == "b1" }!!),
        UserBook("1", books.find { it.id == "b2" }!!),
        UserBook("2", books.find { it.id == "b2" }!!)
    )

    val reviews = mutableListOf(
        Review("r1", "b1", "1", "alice","Great book!", true, "2025-05-01T11:45:00Z"),
        Review("r2", "b1", "1", "alice","My personal notes...", false, "2025-05-02T20:13:00Z"),
        Review("r3", "b2", "2", "bob","Loved the patterns.", true, "2025-05-03T14:53:00Z")
    )

    var nextBookId = 3
    var nextReviewId = 4
}