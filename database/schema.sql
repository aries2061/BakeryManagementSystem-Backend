-- Bakery Management System - PostgreSQL schema for Supabase SQL Editor
-- Safe to run multiple times where possible.

begin;

-- -----------------------------------------------------------------------------
-- Extensions
-- -----------------------------------------------------------------------------
create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('ADMIN', 'MANAGER', 'STAFF');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'item_type') then
    create type item_type as enum ('INGREDIENT', 'PRODUCT');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type order_status as enum ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'loyalty_tier') then
    create type loyalty_tier as enum ('BRONZE', 'SILVER', 'GOLD');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'discount_type') then
    create type discount_type as enum ('PERCENTAGE', 'FIXED_AMOUNT', 'BOGO');
  end if;
end
$$;

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------
create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  phone text not null,
  manager_id uuid
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  role user_role not null,
  branch_id uuid,
  provider text
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  loyalty_points integer not null default 0,
  tier loyalty_tier not null default 'BRONZE',
  preferences jsonb
);

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  branch_id uuid not null,
  hourly_rate numeric not null,
  schedule jsonb,
  hired_date date
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type item_type not null,
  quantity numeric not null,
  unit text not null,
  price numeric,
  expiry_date date,
  branch_id uuid not null,
  low_stock_threshold numeric,
  vendor text
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid,
  branch_id uuid not null,
  items jsonb not null,
  total_amount numeric not null,
  status order_status not null,
  payment_method text not null,
  created_at timestamptz default now()
);

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  discount_type discount_type not null,
  discount_value numeric not null,
  start_date date not null,
  end_date date not null,
  branch_id uuid,
  product_id uuid,
  min_order_amount numeric
);

-- -----------------------------------------------------------------------------
-- Foreign Keys
-- -----------------------------------------------------------------------------
alter table public.users
  drop constraint if exists fk_users_branch,
  add constraint fk_users_branch
    foreign key (branch_id)
    references public.branches(id)
    on delete set null;

alter table public.branches
  drop constraint if exists fk_branches_manager,
  add constraint fk_branches_manager
    foreign key (manager_id)
    references public.users(id)
    on delete set null;

alter table public.employees
  drop constraint if exists fk_employees_user,
  add constraint fk_employees_user
    foreign key (user_id)
    references public.users(id)
    on delete cascade;

alter table public.employees
  drop constraint if exists fk_employees_branch,
  add constraint fk_employees_branch
    foreign key (branch_id)
    references public.branches(id)
    on delete cascade;

alter table public.inventory
  drop constraint if exists fk_inventory_branch,
  add constraint fk_inventory_branch
    foreign key (branch_id)
    references public.branches(id)
    on delete cascade;

alter table public.orders
  drop constraint if exists fk_orders_customer,
  add constraint fk_orders_customer
    foreign key (customer_id)
    references public.customers(id)
    on delete set null;

alter table public.orders
  drop constraint if exists fk_orders_branch,
  add constraint fk_orders_branch
    foreign key (branch_id)
    references public.branches(id)
    on delete cascade;

alter table public.promotions
  drop constraint if exists fk_promotions_branch,
  add constraint fk_promotions_branch
    foreign key (branch_id)
    references public.branches(id)
    on delete set null;

alter table public.promotions
  drop constraint if exists fk_promotions_product,
  add constraint fk_promotions_product
    foreign key (product_id)
    references public.inventory(id)
    on delete set null;

-- -----------------------------------------------------------------------------
-- Checks
-- -----------------------------------------------------------------------------
alter table public.promotions
  drop constraint if exists chk_promotions_date_range,
  add constraint chk_promotions_date_range
    check (end_date >= start_date);

alter table public.inventory
  drop constraint if exists chk_inventory_quantity_non_negative,
  add constraint chk_inventory_quantity_non_negative
    check (quantity >= 0);

alter table public.inventory
  drop constraint if exists chk_inventory_price_non_negative,
  add constraint chk_inventory_price_non_negative
    check (price is null or price >= 0);

alter table public.orders
  drop constraint if exists chk_orders_total_non_negative,
  add constraint chk_orders_total_non_negative
    check (total_amount >= 0);

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------
create index if not exists idx_users_email on public.users(email);
create index if not exists idx_users_branch_id on public.users(branch_id);
create index if not exists idx_branches_manager_id on public.branches(manager_id);
create index if not exists idx_employees_user_id on public.employees(user_id);
create index if not exists idx_employees_branch_id on public.employees(branch_id);
create index if not exists idx_inventory_branch_id on public.inventory(branch_id);
create index if not exists idx_orders_branch_id on public.orders(branch_id);
create index if not exists idx_orders_customer_id on public.orders(customer_id);
create index if not exists idx_promotions_branch_id on public.promotions(branch_id);
create index if not exists idx_promotions_product_id on public.promotions(product_id);

commit;
