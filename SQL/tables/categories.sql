-- DEPENDS ON PGCRYPTO

-- Table: categories

-- DROP TABLE IF EXISTS categories CASCADE;

CREATE TABLE IF NOT EXISTS categories
(
    referencecode TEXT NOT NULL DEFAULT (
    'CAT'
        || to_char(NOW(), 'YYYYMMDDHH24MISS')
        || upper(substring(gen_random_uuid()::text, 1, 2))
    ),
    type text check (type IN ('Needs', 'Wants', 'Savings')),
    color character varying,
    created_at timestamp without time zone DEFAULT now(),
    weight integer,
    CONSTRAINT categories_pkey PRIMARY KEY (referencecode)
)

    TABLESPACE pg_default;

ALTER TABLE IF EXISTS categories
    OWNER to "default";