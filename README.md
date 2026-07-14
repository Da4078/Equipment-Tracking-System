# Summer Practice Project — Equipment Tracking System

Welcome to the Summer Practice at OG-CS Software Company!

Over the next few weeks you will build a small but complete backend application (with a frontend) for keeping track of company equipment. Our equipment manager is responsible for issuing items such as monitors, laptops, and headsets to employees, keeping a record of what each person currently holds, and making sure everything is returned when someone leaves the company. Your job is to build the system that supports this.

---


## Backend Features

You must implement the following:

1. **Manage employees** — create, read, update, and list employees. Listing should support pagination and sorting.
2. **Manage equipment** — create, read, update, and list equipment. Equipment that has a history must never be permanently deleted; mark it as `retired` instead.
3. **Assign and return equipment** — issue a piece of equipment to an employee and later record its return. The status of the equipment must change correctly through this lifecycle (available → assigned → returned/available).
4. **The offboarding rule (the most important feature)** — when an employee is marked as having left the company, the system must **not allow it** if that employee still holds equipment that has not been returned. This is the central business rule of the project.
5. **Operational queries** — provide endpoints that answer real questions the equipment manager has:
    - which equipment is currently held by a given employee,
    - which equipment is currently available,
    - which items are still outstanding (issued but not yet returned).
6. **Validation** — all input must be validated (required fields, valid email, valid status values, etc.) with clear, structured error responses.
7. **Authentication and authorization** — the API must be protected. Define at least two roles with different permissions.

---

## Backend Tech Stack

- **Java** (use a current LTS version)
- **Spring Boot**
- **Spring Web** — for the REST API
- **Spring Data JPA** — for persistence and entity relationships
- **Spring Security** — for authentication and authorization
- **Bean Validation** (Jakarta Validation) — for input validation
- **PostgreSQL** — the database
- **Flyway** — for database schema migrations (do not let the schema auto-generate)
- **Springdoc OpenAPI (Swagger UI)** — so your API is documented and easy to test
- **Build tool** — Maven or Gradle (your choice)

---

## Frontend Features

Build a simple web interface on top of your API. It does not need to be fancy, but it must be functional and cover the main workflows:

1. **Login** — authenticate against the backend and respect the user's role.
2. **Employee list and detail** — view employees, see which equipment each one currently holds, and create/edit an employee.
3. **Equipment list** — view all equipment with its current status and filter by status or type.
4. **Assign / return** — issue a piece of equipment to an employee and record returns from the interface.
5. **Offboarding** — a screen or action to mark an employee as having left, which clearly shows the error when they still hold equipment.
6. **Dashboard or overview** — a simple view of what's outstanding and what's available.
7. **Validation and error handling** — show the backend's validation and business-rule errors to the user in a readable way.

---

## Frontend Tech Stack

- **Vue** or **React** — your team decides which one, then everyone uses the same one
- A component library of your choice is allowed but not required
- Communicate with the backend strictly through its REST API

---


## Tips

- **Plan before you code.** Agree on your data model and your API endpoints as a team before writing the first line. Changing them later is expensive.
- **Use version control properly from day one.** Small, frequent commits, clear messages, and feature branches. This is part of what we want you to practice.
- **Migrations are append-only.** Once a Flyway migration has run, you never edit it — you add a new one.
- **Read the docs, not just tutorials.** The official Spring and Vue/React documentation will serve you far better than copy-pasted snippets.
- **Ask early.** Being stuck for ten minutes is learning; being stuck for two days is not. We're here to help.

Good luck — we're looking forward to seeing what you build.
