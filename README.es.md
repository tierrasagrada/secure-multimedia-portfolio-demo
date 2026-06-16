# Portafolio Multimedia Seguro

Aplicación web desarrollada con **Node.js**, **Express** y **JavaScript puro**, diseñada para proteger contenido multimedia mediante mecanismos de acceso controlado y prácticas de seguridad aplicadas al desarrollo web.

## Descripción del proyecto

Este proyecto surge como respuesta a una problemática común en los portafolios tradicionales: **compartir enlaces directos a contenido personal sin control sobre su distribución o reutilización**.

La aplicación permite al propietario del portafolio entregar acceso temporal a personas específicas mediante un proceso de validación ligero, protegiendo imágenes y recursos frente a accesos no autorizados, scraping automatizado y exposición directa de URLs.

## Capturas de pantalla

### Validación de acceso
El acceso al contenido protegido requiere completar un proceso de validación antes de habilitar la sesión del usuario.

![Pantalla de validación de acceso](./docs/screenshots/access-form.png)

### Portafolio multimedia protegido
El contenido privado se entrega mediante mecanismos de acceso controlado y recursos protegidos con URLs temporales.

![Contenido protegido del portafolio](./docs/screenshots/protected-content.png)

### Gestión de sesiones por inactividad
La aplicación detecta períodos de inactividad y advierte al usuario antes de finalizar automáticamente la sesión activa.

![Advertencia de expiración de sesión](./docs/screenshots/session-warning.png)

## Características principales

* Acceso protegido mediante una palabra de acceso entregada por el propietario del portafolio.
* Entrega controlada de contenido multimedia.
* Detección de inactividad del usuario.
* Cierre automático de sesión por inactividad.
* Experiencia de usuario optimizada sin utilizar frameworks frontend.
* Protección de recursos mediante URLs firmadas con expiración.

A continuación se describen algunas de las decisiones técnicas adoptadas durante el desarrollo del proyecto.
## Medidas de seguridad implementadas

* Protección de recursos multimedia mediante URLs firmadas con expiración automática.
* Control de acceso basado en sesiones seguras utilizando cookies HTTP-Only.
* Validación previa del usuario antes de exponer contenido protegido.
* Protección frente a ataques CSRF en operaciones sensibles.
* Limitación de solicitudes para reducir riesgos asociados a automatización y fuerza bruta.
* Incremento progresivo del tiempo de espera ante múltiples intentos fallidos de validación.
* Asociación del acceso a recursos protegidos con el contexto de autenticación del usuario.
* Validación y sanitización de datos provenientes del cliente antes de su procesamiento.
* Aplicación de cabeceras de seguridad alineadas con recomendaciones OWASP.
* Prevención del acceso directo a recursos privados almacenados en el servidor.
* Registro de eventos relevantes mediante mecanismos internos de auditoría y trazabilidad.
* Detección de inactividad del usuario y cierre automático de sesión.
* Gestión centralizada de errores para evitar exposición innecesaria de información sensible.


## Arquitectura del proyecto

La solución fue diseñada utilizando una arquitectura basada en separación de responsabilidades, favoreciendo la mantenibilidad, escalabilidad y facilidad de evolución del sistema.

### Frontend

Responsable de la interacción con el usuario y del consumo seguro de servicios backend.

Componentes principales:

* Gestión del proceso de validación inicial.
* Renderizado dinámico del contenido protegido.
* Gestión del ciclo de vida de la sesión del usuario.
* Detección de inactividad y control de expiración.
* Consumo de APIs protegidas.
* Carga diferida y optimizada de recursos multimedia.

### Backend

Organizado mediante capas independientes que delimitan claramente las responsabilidades del sistema.

#### Routes

Definen los puntos de entrada de la aplicación y coordinan el flujo hacia los controladores correspondientes.

#### Controllers

Implementan la lógica asociada a autenticación, generación de contenido protegido, entrega de imágenes seguras y cierre de sesiones.

#### Middleware

Gestionan preocupaciones transversales del sistema, incluyendo:

* Autenticación y autorización.
* Protección CSRF.
* Validación de entradas.
* Limitación de solicitudes.
* Generación de identificadores de trazabilidad.
* Registro centralizado de eventos HTTP.
* Aplicación de cabeceras de seguridad.
* Manejo global de errores.

#### Services

Encapsulan lógica reutilizable asociada a la generación y validación de tokens.

#### Utilities

Agrupan funcionalidades auxiliares relacionadas con auditoría, métricas de seguridad, sanitización de datos y protección de recursos multimedia.

#### Protected Resources

Los archivos privados permanecen fuera del acceso público directo y solo pueden ser obtenidos mediante mecanismos de validación implementados por el backend.

Esta organización permite incorporar nuevas funcionalidades de seguridad o escalabilidad sin afectar significativamente al resto del sistema.

## Flujo de acceso protegido

1. El usuario accede al portafolio.
2. Se solicita una palabra de acceso.
3. El backend valida la respuesta.
4. Se establece una sesión segura.
5. Los recursos protegidos son solicitados mediante endpoints autenticados.
6. Se generan URLs temporales para imágenes privadas.
7. La inactividad del usuario provoca el cierre automático de la sesión.

## Competencias demostradas

* Diseño e implementación de APIs REST utilizando Node.js y Express.
* Protección de recursos sensibles mediante mecanismos de autenticación y autorización.
* Aplicación práctica de principios de seguridad recomendados por OWASP.
* Implementación de controles contra automatización, abuso y fuerza bruta.
* Gestión del ciclo de vida de sesiones e inactividad del usuario.
* Organización del código mediante separación de responsabilidades.
* Desarrollo frontend utilizando JavaScript puro sin dependencia de frameworks.
* Diseño de soluciones orientadas a mantenibilidad y futura escalabilidad.
* Despliegue continuo de aplicaciones web en entornos cloud.

## Tecnologías utilizadas

| Capa       | Tecnologías              |
| ---------- | ------------------------ |
| Frontend   | HTML, CSS, JavaScript    |
| Backend    | Node.js, Express         |
| Seguridad  | JWT, CSRF, Rate Limiting |
| Despliegue | Vercel                   |

## Instalación y ejecución local

```bash
git clone https://github.com/tierrasagrada/secure-multimedia-portfolio-demo

cd repositorio

npm install

npm run dev
```

### Variables de entorno

Cree un archivo `.env` utilizando como referencia `.env.example`.

## Despliegue

La aplicación se encuentra preparada para su despliegue en plataformas serverless como Vercel.

## Posibles evoluciones

La arquitectura actual fue diseñada considerando futuras mejoras, tales como:

* Almacenamiento distribuido de sesiones utilizando Redis.
* Implementación de capas de caché para optimizar rendimiento.
* Integración con proveedores externos de identidad.
* Monitoreo avanzado de eventos y alertas.
* Estrategias de escalabilidad horizontal.

## Nota

Este proyecto fue desarrollado como iniciativa personal con el objetivo de aplicar principios de desarrollo seguro en un escenario práctico de distribución controlada de contenido multimedia.

Los recursos multimedia incluidos en este repositorio fueron creados exclusivamente con fines demostrativos y no corresponden a información personal ni a contenido protegido de terceros.