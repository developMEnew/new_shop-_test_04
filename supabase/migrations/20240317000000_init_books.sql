-- Create the books table
create table if not exists books (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  purchase_price decimal(10,2) not null,
  selling_price decimal(10,2) not null,
  quantity integer not null,
  category text not null,
  supplier text not null,
  date_added timestamp with time zone default timezone('utc'::text, now()) not null,
  image_url text not null
);

-- Enable RLS
alter table books enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Allow anonymous select" on books;
drop policy if exists "Allow anonymous insert" on books;
drop policy if exists "Allow anonymous update" on books;
drop policy if exists "Allow anonymous delete" on books;

-- Create policies for anonymous access
create policy "Allow anonymous select" on books
  for select
  to anon
  using (true);

create policy "Allow anonymous insert" on books
  for insert
  to anon
  with check (true);

create policy "Allow anonymous update" on books
  for update
  to anon
  using (true)
  with check (true);

create policy "Allow anonymous delete" on books
  for delete
  to anon
  using (true);

-- Create a function to initialize the books table and storage
create or replace function init_books_table()
returns void
language plpgsql
security definer
as $$
begin
  -- Create the books table if it doesn't exist
  create table if not exists books (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    purchase_price decimal(10,2) not null,
    selling_price decimal(10,2) not null,
    quantity integer not null,
    category text not null,
    supplier text not null,
    date_added timestamp with time zone default timezone('utc'::text, now()) not null,
    image_url text not null
  );

  -- Enable RLS
  alter table books enable row level security;

  -- Drop existing policies if they exist
  drop policy if exists "Allow anonymous select" on books;
  drop policy if exists "Allow anonymous insert" on books;
  drop policy if exists "Allow anonymous update" on books;
  drop policy if exists "Allow anonymous delete" on books;

  -- Create policies for anonymous access
  create policy "Allow anonymous select" on books
    for select
    to anon
    using (true);

  create policy "Allow anonymous insert" on books
    for insert
    to anon
    with check (true);

  create policy "Allow anonymous update" on books
    for update
    to anon
    using (true)
    with check (true);

  create policy "Allow anonymous delete" on books
    for delete
    to anon
    using (true);

  -- Create the storage bucket if it doesn't exist
  insert into storage.buckets (id, name, public)
  values ('book-images', 'book-images', true)
  on conflict (id) do update set public = true;

  -- Drop existing storage policies if they exist
  drop policy if exists "Public Access" on storage.objects;

  -- Set up storage bucket policies for anonymous access
  create policy "Public Access"
    on storage.objects for all
    using ( bucket_id = 'book-images' )
    with check ( bucket_id = 'book-images' );
end;
$$;