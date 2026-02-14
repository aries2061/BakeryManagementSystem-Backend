# Code Quality TODO List

This list is prioritized for fixes, updates, and modifications.

## P0 — Critical (Do first)
- [x] Remove insecure secret fallbacks in auth (`JWT_SECRET`, Google OAuth credentials).
- [x] Replace hardcoded OAuth callback URL with environment-driven config.
- [x] Restrict CORS and WebSocket origins to trusted frontend domains per environment.
- [x] Add startup config validation (required env vars + value constraints).

## P1 — High Priority
- [x] Run formatter and normalize all style inconsistencies across `src/**`.
- [ ] Change lint workflow:
  - [x] Keep `lint` as non-mutating check.
  - [x] Add separate `lint:fix` script for local auto-fix.
- [x] Remove controller-level `as any` casts and align DTO/service contracts.
- [x] Replace `any` usage in DTOs/services with explicit interfaces/types.
- [x] Standardize error handling:
  - [x] Convert provider errors into `HttpException` subclasses.
  - [x] Ensure consistent `4xx/5xx` behavior and response shape.
- [x] Complete `OrdersService.create()` business logic:
  - [x] validate stock
  - [x] deduct inventory
  - [x] update customer loyalty points
  - [x] define rollback/compensation strategy on partial failure

## P2 — Medium Priority
- [x] Refactor `Update*Dto` classes to use partial-update semantics.
- [x] Register `LoggingInterceptor` globally (or apply intentionally per module).
- [x] Add logging guardrails to avoid sensitive payload logging.
- [x] Improve Supabase error mapping utility shared across services.
- [x] Add consistent API response/error envelope for clients.

## P3 — Testing & Reliability
- [ ] Add unit tests for:
  - [ ] auth service/strategies
  - [ ] roles guard behavior
  - [ ] service error paths
  - [ ] DTO validation edge cases
- [ ] Add integration/e2e tests for core domain flows:
  - [ ] orders + inventory
  - [ ] promotions eligibility
  - [ ] auth-protected endpoints (RBAC)
- [ ] Define and enforce coverage thresholds in CI.

## P4 — Documentation & Developer Experience
- [x] Replace starter README with project-specific documentation.
- [x] Document required env vars with examples.
- [x] Document local run flow, test flow, and API docs path.
- [x] Add architecture notes (module boundaries + data ownership).

## Suggested Owners
- Security/config hardening: Backend lead
- Type/lint cleanup: API squad
- Order flow consistency: Domain/operations squad
- Test strategy and CI gates: Platform/QA

## Definition of Done (for this quality pass)
- [x] Lint clean with zero errors.
- [x] Build and tests pass in CI.
- [x] No insecure defaults in runtime config.
- [x] `any` usage reduced to approved/justified exceptions only.
- [ ] Critical business TODOs in order flow completed and tested.
- [x] README and env docs updated.
