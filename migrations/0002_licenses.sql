create table if not exists licenses (
  id text primary key,
  cnic text not null default '',
  name text not null default '',
  father text not null default '',
  dob text not null default '',
  district text not null default '',
  address text not null default '',
  phone text not null default '',
  email text not null default '',
  photo text not null default '',
  license_no text not null default '',
  kind text not null default 'REGULAR',
  vehicles text not null default '',
  issue_date text not null default '',
  valid_from text not null default '',
  valid_to text not null default '',
  status text not null default 'Valid',
  tracking_no text not null default '',
  printed_on text not null default '',
  dispatch_on text not null default '',
  handler text not null default '',
  ecard text not null default '',
  learner_permit text not null default '',
  fee_confirmed boolean not null default false,
  updated_at timestamptz not null default now()
);

create index if not exists licenses_cnic_idx on licenses (cnic);
