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

-- Create a function to initialize the books table
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

  -- Create policies for anonymous access
  create policy if not exists "Allow anonymous select" on books
    for select
    to anon
    using (true);

  create policy if not exists "Allow anonymous insert" on books
    for insert
    to anon
    with check (true);

  create policy if not exists "Allow anonymous update" on books
    for update
    to anon
    using (true)
    with check (true);

  create policy if not exists "Allow anonymous delete" on books
    for delete
    to anon
    using (true);

  -- Create the storage bucket if it doesn't exist
  insert into storage.buckets (id, name)
  values ('book-images', 'book-images')
  on conflict (id) do nothing;

  -- Set up storage bucket policy
  insert into storage.policies (bucket_id, name, permission, definition)
  values
    ('book-images', 'Public Read', 'SELECT', '(bucket_id = ''book-images''::text)'),
    ('book-images', 'Auth Upload', 'INSERT', '(bucket_id = ''book-images''::text)')
  on conflict (bucket_id, name) do nothing;
end;
$$;