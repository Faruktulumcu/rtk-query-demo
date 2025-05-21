# RTK Query Demo Backend

This is the backend project for the RTK Query frontend demo. 

It is built using **Kotlin + Spring Boot** and exposes a minimal set of REST APIs for managing books, users, and reviews. 

The project is intended for use with an in-memory data store to simplify setup and demonstration.

---

## Getting Started

### Requirements

- Java 21
- Gradle (via wrapper or installed)
- Kotlin (bundled via Gradle plugin)

---

## Running the Application

From the root of the project, run:

```bash
./gradlew bootRun
```
#### The server will start at:
http://localhost:5170/rtk-demo

#### All endpoints are prefixed with:
http://localhost:5170/rtk-demo/api

#### Swagger UI
http://localhost:5170/rtk-demo/swagger-ui.html