-- Table: settings.income

-- DROP TABLE IF EXISTS income;

CREATE TABLE IF NOT EXISTS income
(
    referencecode TEXT NOT NULL DEFAULT (
        'INC'
            || to_char(NOW(), 'YYYYMMDDHH24MISS')
            || upper(substring(gen_random_uuid()::text, 1, 2))
        ),
    user_id BIGINT,
    year integer NOT NULL,
    month integer NOT NULL,
    income_amount numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT income_pkey PRIMARY KEY (referencecode),
    CONSTRAINT income_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES "user".users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT income_income_amount_check CHECK (income_amount >= 0::numeric)
)

    TABLESPACE pg_default;

ALTER TABLE IF EXISTS income
    OWNER to "default";