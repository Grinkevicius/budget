-- DEPENDS ON PGCRYPTO

-- DROP TABLE IF EXISTS spending_allocation;
CREATE TABLE IF NOT EXISTS spending_allocation
(
    referencecode TEXT NOT NULL DEFAULT (
    'ALL'
        || to_char(NOW(), 'YYYYMMDDHH24MISS')
        || upper(substring(gen_random_uuid()::text, 1, 2))
    ),
    user_id             INTEGER,
    year                INTEGER NOT NULL,
    month               INTEGER NOT NULL,
    savings_percentage  INTEGER NOT NULL,
    needs_percentage    INTEGER NOT NULL,
    wants_percentage    INTEGER NOT NULL,
    created_at          TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),

    -- Make referencecode the primary key
    CONSTRAINT spending_allocation_pkey PRIMARY KEY (referencecode),

    -- Keep the unique constraint for (user_id, year, month) if desired
    CONSTRAINT spending_allocation_user_id_year_month_key
        UNIQUE (user_id, year, month),

    -- Foreign key to users table
    CONSTRAINT spending_allocation_user_id_fkey
        FOREIGN KEY (user_id)
            REFERENCES "user".users (id)
            ON UPDATE NO ACTION
            ON DELETE CASCADE,

    -- Check constraints
    CONSTRAINT spending_allocation_savings_percentage_check
        CHECK (savings_percentage::numeric >= 0::numeric
            AND savings_percentage::numeric <= 100::numeric),

    CONSTRAINT spending_allocation_needs_percentage_check
        CHECK (needs_percentage::numeric >= 0::numeric
            AND needs_percentage::numeric <= 100::numeric),

    CONSTRAINT spending_allocation_wants_percentage_check
        CHECK (wants_percentage::numeric >= 0::numeric
            AND wants_percentage::numeric <= 100::numeric)
)
    TABLESPACE pg_default;

ALTER TABLE spending_allocation
    OWNER TO "default";
