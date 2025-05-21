# Stage 1: Build the application using Gradle
FROM gradle:8.4-jdk21 AS builder
WORKDIR /app
COPY . .
RUN gradle clean bootJar --no-daemon

# Stage 2: Create a lightweight image to run the app
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 5170
ENTRYPOINT ["java", "-jar", "app.jar"]