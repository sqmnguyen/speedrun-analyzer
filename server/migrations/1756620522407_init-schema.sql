create table runs (
  id bigserial primary key,
  run_number text unique not null,
  run_ts timestamptz not null,
  rta_seconds int not null,
  igt_seconds int,
  seed text,
  spawn_biome text,
  iron_source text,
  enter_type text,
  gold_source text,
  bastion_type text,
  end_fight_type text,
  recent_version boolean default false,
  vod text,
  notes text
);

create table run_splits (
  run_id bigint references runs(id) on delete cascade,
  split_name text not null,
  t_seconds int,
  primary key (run_id, split_name)
);

create table run_metrics (
  run_id bigint references runs(id) on delete cascade,
  metric text not null,
  value numeric not null,
  primary key (run_id, metric)
);

create index runs_ts_idx on runs(run_ts);
create index rm_metric_val_idx on run_metrics(metric, value desc);
create index rs_name_idx on run_splits(split_name, t_seconds);
