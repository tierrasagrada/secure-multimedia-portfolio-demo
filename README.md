# Secure Multimedia Portfolio

A web application built with Node.js, Express and Vanilla JavaScript that demonstrates secure multimedia content delivery through controlled access mechanisms and the practical application of web security controls.

## Project Overview

Traditional portfolios often expose multimedia content through direct links that can be shared, indexed, or reused without control.

This project addresses that problem by implementing an access validation process before protected content becomes available. Private resources are delivered through backend-controlled mechanisms, including secure sessions and short-lived signed URLs for multimedia assets.

The main goal is to reduce the direct exposure of private resources while applying practical secure development concepts in a real-world scenario.

---

## Screenshots

### Access Validation

Users must complete an access validation process before protected content becomes available.

![Access validation screen](./docs/screenshots/access-form.png)

### Protected Multimedia Portfolio

Private content is delivered through controlled access mechanisms and protected resources using short-lived signed URLs.

![Protected portfolio content](./docs/screenshots/protected-content.png)

### Session Inactivity Management

The application detects periods of user inactivity, warns the user before expiration, and automatically terminates inactive sessions.

![Session expiration warning](./docs/screenshots/session-warning.png)

---

## How It Works

1. The user accesses the portfolio.
2. An access word is requested.
3. The backend validates the response.
4. A secure session is established.
5. Protected content is requested through authenticated APIs.
6. The backend generates signed URLs for private images.
7. Multimedia resources are securely delivered.
8. The session automatically expires after a period of inactivity.

---

## Key Features

* Access validation using a predefined access word.
* Secure session management using HTTP-Only cookies.
* Controlled multimedia content delivery.
* Automatic session expiration after inactivity.
* Session expiration warning system.
* Resource protection through signed URLs.
* Structured event logging for auditing and diagnostics.
* Frontend developed without frameworks.

---

## Security Highlights

* Secure session management using HTTP-Only cookies.
* Signed URLs with automatic expiration.
* CSRF protection.
* Rate limiting to mitigate automation and brute-force attempts.
* Progressive delays after multiple failed validation attempts.
* Input validation and sanitization.
* Security headers aligned with OWASP recommendations.
* Private resources stored outside direct public access.
* Centralized error handling.
* Structured event logging for auditing and diagnostics.

---

## Architecture

The application follows a layered architecture designed to promote maintainability and clear separation of responsibilities.

### Frontend

Responsible for:

* Access validation.
* Dynamic rendering of protected content.
* Session lifecycle management.
* User inactivity detection.
* Secure API consumption.
* Optimized multimedia loading.

### Backend

#### Routes

Define the application's entry points.

#### Controllers

Implement authentication, session management, and protected content delivery logic.

#### Middleware

Handle:

* Authentication and authorization.
* CSRF protection.
* Input validation.
* Rate limiting.
* Security headers.
* Event logging.
* Global error handling.

#### Services

Encapsulate reusable token generation and validation logic.

#### Utilities

Provide supporting functionality for auditing, security metrics, and multimedia protection.

#### Views

Templates responsible for rendering public content and protected content accessible only after successful access validation.

#### Protected Resources

Private files remain outside direct public access and can only be retrieved through backend validation mechanisms.

---

## Technologies

| Layer      | Technologies             |
| ---------- | ------------------------ |
| Frontend   | HTML, CSS, JavaScript    |
| Backend    | Node.js, Express         |
| Security   | JWT, CSRF, Rate Limiting |
| Deployment | Vercel                   |

---

## Installation

```bash
git clone https://github.com/tierrasagrada/secure-multimedia-portfolio-demo

cd secure-multimedia-portfolio-demo

npm install

npm run dev
```

## Environment Variables

Create a `.env` file using `.env.example` as a reference.

---

## Future Enhancements

* Migrate to a custom multimedia gallery to improve maintainability, performance, and interface control.
* Lazy loading for embedded content.
* Distributed session management using Redis.
* Persistent storage of security events and audit logs.
* Monitoring dashboard with security metrics, charts, and statistics.
* Automatic alerts for relevant security events.
* Advanced abuse mitigation through distributed rate limiting.

---

## Skills Demonstrated

* REST API development using Node.js and Express.
* Secure multimedia content delivery.
* Authentication and authorization implementation.
* Implementation of security controls aligned with OWASP recommendations.
* Brute-force mitigation techniques.
* Session lifecycle management.
* Layered backend architecture.
* Frontend development using Vanilla JavaScript.
* Cloud deployment using Vercel.
* Structured logging implementation for auditing and diagnostics.

---

### Note

This project was developed as a personal initiative to apply practical web security concepts in a real-world controlled multimedia content delivery scenario.

All multimedia assets included in this repository are demonstration resources only and do not contain personal information or third-party protected content.