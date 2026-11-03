create table if not exists service_requests (
  id text primary key,
  category text not null default '',
  name text not null default '',
  father text not null default '',
  cnic text not null default '',
  dob text not null default '',
  phone text not null default '',
  email text not null default '',
  district text not null default '',
  address text not null default '',
  license_no text not null default '',
  vehicle text not null default '',
  status text not null default 'new',
  psid text not null default '',
  payment text not null default 'Unpaid',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists service_requests_cnic_idx on service_requests (cnic);

create table if not exists accounts (
  id text primary key,
  name text not null default '',
  father text not null default '',
  cnic text not null default '',
  dob text not null default '',
  gender text not null default '',
  phone text not null default '',
  email text not null default '',
  password text not null default '',
  district text not null default '',
  address text not null default '',
  license_type text not null default '',
  photo text not null default '',
  status text not null default 'pending',
  fee_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists accounts_cnic_idx on accounts (cnic);
create unique index if not exists accounts_email_idx on accounts (email);
