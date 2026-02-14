# Code Quality TODO List

This list is prioritized for fixes, updates, and modifications.

## P0 — Critical (Do first)
- [ ] Remove insecure secret fallbacks in auth (`JWT_SECRET`, Google OAuth credentials).
- [ ] Replace hardcoded OAuth callback URL with environment-driven config.
- [ ] Restrict CORS and WebSocket origins to trusted frontend domains per environment.
- [ ] Add startup config validation (required env vars + value constraints).

## P1 — High Priority
- [ ] Run formatter and normalize all style inconsistencies across `src/**`.
- [ ] Change lint workflow:
  - [ ] Keep `lint` as non-mutating check.
  - [ ] Add separate `lint:fix` script for local auto-fix.
- [ ] Remove controller-level `as any` casts and align DTO/service contracts.
- [ ] Replace `any` usage in DTOs/services with explicit interfaces/types.
- [ ] Standardize error handling:
  - [ ] Convert provider errors into `HttpException` subclasses.
  - [ ] Ensure consistent `4xx/5xx` behavior and response shape.
- [ ] Complete `OrdersService.create()` business logic:
  - [ ] validate stock
  - [ ] deduct inventory
  - [ ] update customer loyalty points
  - [ ] define rollback/compensation strategy on partial failure

## P2 — Medium Priority
- [ ] Refactor `Update*Dto` classes to use partial-update semantics.
- [ ] Register `LoggingInterceptor` globally (or apply intentionally per module).
- [ ] Add logging guardrails to avoid sensitive payload logging.
- [ ] Improve Supabase error mapping utility shared across services.
- [ ] Add consistent API response/error envelope for clients.

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
- [ ] Replace starter README with project-specific documentation.
- [ ] Document required env vars with examples.
- [ ] Document local run flow, test flow, and API docs path.
- [ ] Add architecture notes (module boundaries + data ownership).

## Suggested Owners
- Security/config hardening: Backend lead
- Type/lint cleanup: API squad
- Order flow consistency: Domain/operations squad
- Test strategy and CI gates: Platform/QA

## Definition of Done (for this quality pass)
- [ ] Lint clean with zero errors.
- [ ] Build and tests pass in CI.
- [ ] No insecure defaults in runtime config.
- [ ] `any` usage reduced to approved/justified exceptions only.
- [ ] Critical business TODOs in order flow completed and tested.
- [ ] README and env docs updated.
