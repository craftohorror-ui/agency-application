alter table files add column lead_id uuid references leads(id) on delete set null;
create index idx_files_lead on files(lead_id);
