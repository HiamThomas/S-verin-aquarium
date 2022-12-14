create table if not exists users
(
    email        text,
    password     text,
    userid       serial
        constraint users_pk
            primary key,
    backgroundid integer
);

alter table users
    owner to postgres;

create unique index if not exists users_email_uindex
    on users (email);

create table if not exists fishs
(
    userid integer not null,
    name   text,
    color  integer,
    speed  double precision,
    size   double precision,
    url    text,
    flip   boolean,
    fishid serial
        constraint fishs_pk
            primary key
);

alter table fishs
    owner to postgres;

create table if not exists backgrounds
(
    backgroundid serial
        constraint backgrounds_pk
            primary key,
    userid       integer,
    url          text
);

alter table backgrounds
    owner to postgres;

