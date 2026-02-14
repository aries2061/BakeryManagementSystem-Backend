-- Bakery Management System - Supabase RLS Policies
-- Run this AFTER database/schema.sql in Supabase SQL Editor.
--
-- Expected JWT claims (set by your backend token generation):
--   role      -> ADMIN | MANAGER | STAFF
--   branch_id -> uuid string (optional for ADMIN)
--   email     -> user email

begin;

-- -----------------------------------------------------------------------------
-- Enable RLS on all application tables
-- -----------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.branches enable row level security;
alter table public.customers enable row level security;
alter table public.employees enable row level security;
alter table public.inventory enable row level security;
alter table public.orders enable row level security;
alter table public.promotions enable row level security;

-- -----------------------------------------------------------------------------
-- Cleanup old policies (idempotent reruns)
-- -----------------------------------------------------------------------------
drop policy if exists users_select_policy on public.users;
drop policy if exists users_insert_policy on public.users;
drop policy if exists users_update_policy on public.users;
drop policy if exists users_delete_policy on public.users;

drop policy if exists branches_select_policy on public.branches;
drop policy if exists branches_insert_policy on public.branches;
drop policy if exists branches_update_policy on public.branches;
drop policy if exists branches_delete_policy on public.branches;

drop policy if exists customers_select_policy on public.customers;
drop policy if exists customers_insert_policy on public.customers;
drop policy if exists customers_update_policy on public.customers;
drop policy if exists customers_delete_policy on public.customers;

drop policy if exists employees_select_policy on public.employees;
drop policy if exists employees_insert_policy on public.employees;
drop policy if exists employees_update_policy on public.employees;
drop policy if exists employees_delete_policy on public.employees;

drop policy if exists inventory_select_policy on public.inventory;
drop policy if exists inventory_insert_policy on public.inventory;
drop policy if exists inventory_update_policy on public.inventory;
drop policy if exists inventory_delete_policy on public.inventory;

drop policy if exists orders_select_policy on public.orders;
drop policy if exists orders_insert_policy on public.orders;
drop policy if exists orders_update_policy on public.orders;
drop policy if exists orders_delete_policy on public.orders;

drop policy if exists promotions_select_policy on public.promotions;
drop policy if exists promotions_insert_policy on public.promotions;
drop policy if exists promotions_update_policy on public.promotions;
drop policy if exists promotions_delete_policy on public.promotions;

-- -----------------------------------------------------------------------------
-- USERS
-- -----------------------------------------------------------------------------
create policy users_select_policy
on public.users
for select
to authenticated
using (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or email = (auth.jwt() ->> 'email')
);

create policy users_insert_policy
on public.users
for insert
to authenticated
with check ((auth.jwt() ->> 'role') = 'ADMIN');

create policy users_update_policy
on public.users
for update
to authenticated
using (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or email = (auth.jwt() ->> 'email')
)
with check (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or email = (auth.jwt() ->> 'email')
);

create policy users_delete_policy
on public.users
for delete
to authenticated
using ((auth.jwt() ->> 'role') = 'ADMIN');

-- -----------------------------------------------------------------------------
-- BRANCHES
-- -----------------------------------------------------------------------------
create policy branches_select_policy
on public.branches
for select
to authenticated
using (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or id::text = (auth.jwt() ->> 'branch_id')
);

create policy branches_insert_policy
on public.branches
for insert
to authenticated
with check ((auth.jwt() ->> 'role') = 'ADMIN');

create policy branches_update_policy
on public.branches
for update
to authenticated
using (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or (
    (auth.jwt() ->> 'role') = 'MANAGER'
    and id::text = (auth.jwt() ->> 'branch_id')
  )
)
with check (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or (
    (auth.jwt() ->> 'role') = 'MANAGER'
    and id::text = (auth.jwt() ->> 'branch_id')
  )
);

create policy branches_delete_policy
on public.branches
for delete
to authenticated
using ((auth.jwt() ->> 'role') = 'ADMIN');

-- -----------------------------------------------------------------------------
-- CUSTOMERS
-- -----------------------------------------------------------------------------
create policy customers_select_policy
on public.customers
for select
to authenticated
using ((auth.jwt() ->> 'role') in ('ADMIN', 'MANAGER', 'STAFF'));

create policy customers_insert_policy
on public.customers
for insert
to authenticated
with check ((auth.jwt() ->> 'role') in ('ADMIN', 'MANAGER', 'STAFF'));

create policy customers_update_policy
on public.customers
for update
to authenticated
using ((auth.jwt() ->> 'role') in ('ADMIN', 'MANAGER', 'STAFF'))
with check ((auth.jwt() ->> 'role') in ('ADMIN', 'MANAGER', 'STAFF'));

create policy customers_delete_policy
on public.customers
for delete
to authenticated
using ((auth.jwt() ->> 'role') in ('ADMIN', 'MANAGER'));

-- -----------------------------------------------------------------------------
-- EMPLOYEES
-- -----------------------------------------------------------------------------
create policy employees_select_policy
on public.employees
for select
to authenticated
using (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or (
    (auth.jwt() ->> 'role') in ('MANAGER', 'STAFF')
    and branch_id::text = (auth.jwt() ->> 'branch_id')
  )
);

create policy employees_insert_policy
on public.employees
for insert
to authenticated
with check (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or (
    (auth.jwt() ->> 'role') = 'MANAGER'
    and branch_id::text = (auth.jwt() ->> 'branch_id')
  )
);

create policy employees_update_policy
on public.employees
for update
to authenticated
using (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or (
    (auth.jwt() ->> 'role') = 'MANAGER'
    and branch_id::text = (auth.jwt() ->> 'branch_id')
  )
)
with check (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or (
    (auth.jwt() ->> 'role') = 'MANAGER'
    and branch_id::text = (auth.jwt() ->> 'branch_id')
  )
);

create policy employees_delete_policy
on public.employees
for delete
to authenticated
using (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or (
    (auth.jwt() ->> 'role') = 'MANAGER'
    and branch_id::text = (auth.jwt() ->> 'branch_id')
  )
);

-- -----------------------------------------------------------------------------
-- INVENTORY
-- -----------------------------------------------------------------------------
create policy inventory_select_policy
on public.inventory
for select
to authenticated
using (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or branch_id::text = (auth.jwt() ->> 'branch_id')
);

create policy inventory_insert_policy
on public.inventory
for insert
to authenticated
with check (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or (
    (auth.jwt() ->> 'role') = 'MANAGER'
    and branch_id::text = (auth.jwt() ->> 'branch_id')
  )
);

create policy inventory_update_policy
on public.inventory
for update
to authenticated
using (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or (
    (auth.jwt() ->> 'role') in ('MANAGER', 'STAFF')
    and branch_id::text = (auth.jwt() ->> 'branch_id')
  )
)
with check (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or (
    (auth.jwt() ->> 'role') in ('MANAGER', 'STAFF')
    and branch_id::text = (auth.jwt() ->> 'branch_id')
  )
);

create policy inventory_delete_policy
on public.inventory
for delete
to authenticated
using (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or (
    (auth.jwt() ->> 'role') = 'MANAGER'
    and branch_id::text = (auth.jwt() ->> 'branch_id')
  )
);

-- -----------------------------------------------------------------------------
-- ORDERS
-- -----------------------------------------------------------------------------
create policy orders_select_policy
on public.orders
for select
to authenticated
using (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or branch_id::text = (auth.jwt() ->> 'branch_id')
);

create policy orders_insert_policy
on public.orders
for insert
to authenticated
with check (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or (
    (auth.jwt() ->> 'role') in ('MANAGER', 'STAFF')
    and branch_id::text = (auth.jwt() ->> 'branch_id')
  )
);

create policy orders_update_policy
on public.orders
for update
to authenticated
using (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or (
    (auth.jwt() ->> 'role') in ('MANAGER', 'STAFF')
    and branch_id::text = (auth.jwt() ->> 'branch_id')
  )
)
with check (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or (
    (auth.jwt() ->> 'role') in ('MANAGER', 'STAFF')
    and branch_id::text = (auth.jwt() ->> 'branch_id')
  )
);

create policy orders_delete_policy
on public.orders
for delete
to authenticated
using (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or (
    (auth.jwt() ->> 'role') = 'MANAGER'
    and branch_id::text = (auth.jwt() ->> 'branch_id')
  )
);

-- -----------------------------------------------------------------------------
-- PROMOTIONS
-- -----------------------------------------------------------------------------
create policy promotions_select_policy
on public.promotions
for select
to authenticated
using (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or branch_id is null
  or branch_id::text = (auth.jwt() ->> 'branch_id')
);

create policy promotions_insert_policy
on public.promotions
for insert
to authenticated
with check (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or (
    (auth.jwt() ->> 'role') = 'MANAGER'
    and branch_id::text = (auth.jwt() ->> 'branch_id')
  )
);

create policy promotions_update_policy
on public.promotions
for update
to authenticated
using (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or (
    (auth.jwt() ->> 'role') = 'MANAGER'
    and branch_id::text = (auth.jwt() ->> 'branch_id')
  )
)
with check (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or (
    (auth.jwt() ->> 'role') = 'MANAGER'
    and branch_id::text = (auth.jwt() ->> 'branch_id')
  )
);

create policy promotions_delete_policy
on public.promotions
for delete
to authenticated
using (
  (auth.jwt() ->> 'role') = 'ADMIN'
  or (
    (auth.jwt() ->> 'role') = 'MANAGER'
    and branch_id::text = (auth.jwt() ->> 'branch_id')
  )
);

commit;
