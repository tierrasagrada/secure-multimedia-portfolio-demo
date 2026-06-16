# Secure Multimedia Portfolio

A web application built with **Node.js**, **Express**, and **vanilla JavaScript**, designed to protect multimedia content through controlled access mechanisms and security-oriented development practices.

## Project Overview

This project addresses a common issue found in traditional portfolios: **sharing direct links to personal content without control over its distribution or reuse**.

The application enables portfolio owners to grant temporary access to selected individuals through a lightweight validation process, protecting multimedia resources against unauthorized access, automated scraping, and direct URL exposure.

## Screenshots

### Access Validation

Users must complete a validation process before gaining access to protected content.

![Access validation screen](./docs/screenshots/access-form.png)

### Protected Portfolio Content

Private multimedia resources are delivered through controlled access mechanisms and temporary protected URLs.

![Protected portfolio](./docs/screenshots/protected-content.png)

### Session Management

The application monitors user inactivity and warns users before automatically terminating inactive sessions.

![Session warning](./docs/screenshots/session-warning.png)

## Key Features

* Protected access using an owner-provided access word.
* Controlled delivery of multimedia resources.
* User inactivity detection.
* Automatic session expiration.
* Optimized user experience without frontend frameworks.
* Protection of sensitive resources through signed URLs with expiration.

The following sections describe some of the technical decisions adopted during development.

## Security Measures Implemented

* Protection of multimedia resources using signed URLs with automatic expiration.
* Secure session management through HTTP-only cookies.
* User validation before exposing protected content.
* CSRF protection for sensitive operations.
* Request limiting to reduce risks associated with automation and brute-force attacks.
* Progressive delay increments after multiple failed validation attempts.
* Association of protected resources with the user's authenticated context.
* Input validation and sanitization before processing client-provided data.
* Security headers aligned with OWASP recommendations.
* Prevention of direct access to private resources stored on the server.
* Internal auditing and traceability mechanisms for relevant security events.
* User inactivity detection and automatic session termination.
* Centralized error handling to prevent unnecessary exposure of sensitive information.

## Project Architecture

The solution was designed using a separation-of-concerns approach to improve maintainability, scalability, and future extensibility.

### Frontend

Responsible for user interaction and secure backend service consumption.

Main responsibilities:

* Initial validation workflow.
* Dynamic rendering of protected content.
* Session lifecycle management.
* Inactivity detection and expiration handling.
* Consumption of protected APIs.
* Deferred and optimized multimedia loading.

### Backend

Organized into independent layers with clearly defined responsibilities.

#### Routes

Define application entry points and coordinate requests toward the appropriate controllers.

#### Controllers

Implement business logic related to authentication, protected content generation, secure image delivery, and session termination.

#### Middleware

Handle cross-cutting concerns, including:

* Authentication and authorization.
* CSRF protection.
* Input validation.
* Request limiting.
* Traceability identifier generation.
* Centralized HTTP event logging.
* Security header enforcement.
* Global error handling.

#### Services

Encapsulate reusable logic related to token generation and validation.

#### Utilities

Provide auxiliary functionality related to auditing, security metrics, data sanitization, and multimedia protection.

#### Protected Resources

Private files remain inaccessible through direct public URLs and can only be obtained through backend validation mechanisms.

This organization facilitates the addition of future security enhancements and scalability strategies without significantly impacting other parts of the system.

## Protected Access Flow

1. The user accesses the portfolio.
2. An access word is requested.
3. The backend validates the provided response.
4. A secure session is established.
5. Protected resources are requested through authenticated endpoints.
6. Temporary signed URLs are generated for private multimedia assets.
7. User inactivity automatically triggers session termination.

## Competencies Demonstrated

* REST API design and implementation using Node.js and Express.
* Practical implementation of authentication and authorization mechanisms.
* Protection of sensitive resources through controlled access strategies.
* Application of OWASP security principles.
* Protection against automation, abuse, and brute-force scenarios.
* Session lifecycle and inactivity management.
* Code organization through separation of responsibilities.
* Frontend development using vanilla JavaScript without framework dependencies.
* Design of maintainable solutions prepared for future scalability.
* Continuous deployment of web applications in cloud environments.

## Technologies Used

| Layer      | Technologies             |
| ---------- | ------------------------ |
| Frontend   | HTML, CSS, JavaScript    |
| Backend    | Node.js, Express         |
| Security   | JWT, CSRF, Rate Limiting |
| Deployment | Vercel                   |

## Installation and Local Execution

```bash
git clone https://github.com/tierrasagrada/secure-multimedia-portfolio-demo

cd your-repository

npm install

npm run dev
```

### Environment Variables

Create a `.env` file using `.env.example` as a reference.

## Deployment

The application is prepared for deployment on serverless platforms such as Vercel.

## Future Enhancements

The current architecture was designed considering future improvements such as:

* Distributed session storage using Redis.
* Caching layers to improve performance.
* Integration with external identity providers.
* Advanced monitoring and alerting mechanisms.
* Horizontal scalability strategies.

## Disclaimer

This project was developed as a personal initiative focused on applying secure development principles to a real-world scenario involving controlled access to multimedia resources.

The multimedia assets included in this repository were created exclusively for demonstration purposes.
