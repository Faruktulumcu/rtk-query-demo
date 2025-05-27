package com.demo.rtk.storage

import com.demo.rtk.model.Book
import com.demo.rtk.model.Review
import com.demo.rtk.model.User
import com.demo.rtk.model.UserBook

object InMemoryData {
    var alice = User("1", "alice", "token-alice")
    var bob = User("2", "bob", "token-bob")
    val carol = User("3", "carol", "token-carol")

    val cleanCode = Book(
        "b1",
        "Clean Code",
        "Robert C. Martin",
        "9783826696398",
        "https://books.google.com/books/content?id=HGxKPgAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
    )

    val pragmaticProgrammer = Book(
        "b2",
        "The Pragmatic Programmer",
        "Andrew Hunt",
        "9780132119177",
        "https://books.google.com/books/content?id=5wBQEp6ruIAC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
    )


    val users = listOf(alice, bob, carol)

    val books = mutableListOf(
        cleanCode,
        pragmaticProgrammer
    )

    val userBooks = mutableListOf(
        UserBook(alice.id, cleanCode),
        UserBook(alice.id, pragmaticProgrammer),
        UserBook(bob.id, pragmaticProgrammer),
        UserBook(carol.id, pragmaticProgrammer)
    )

    val reviews = mutableListOf(
        Review("r1", cleanCode.id, alice.id, alice.username, "Great book!", true, "2025-05-01T11:45:00Z"),
        Review("r2", cleanCode.id, alice.id, alice.username, "My personal notes...", false, "2025-05-02T20:13:00Z"),
        Review("r3", pragmaticProgrammer.id, bob.id, bob.username, "Loved the patterns.", true, "2025-05-03T14:53:00Z"),
        Review("r4", pragmaticProgrammer.id, carol.id, carol.username, "Patterns are so smart!", true, "2025-05-09T14:53:00Z")
    )

    var nextBookId = 3
    var nextReviewId = 5
}