-- DEPENDS ON PGCRYPTO

-- Table: budgets

-- DROP TABLE IF EXISTS budgets CASCADE;

CREATE TABLE IF NOT EXISTS budgets
(
    referencecode TEXT NOT NULL DEFAULT (
        'BUD'
            || to_char(NOW(), 'YYYYMMDDHH24MISS')
            || upper(substring(gen_random_uuid()::text, 1, 2))
        ),
    user_id INTEGER NOT NULL,
    year INTEGER NOT NULL,  -- ✅ Moved from transactions
    month INTEGER NOT NULL,  -- ✅ Moved from transactions
    adjusted_income NUMERIC(10,2) NULL,  -- ✅ Allows user to adjust income per month
    adjusted_savings_percentage NUMERIC(5,2) NULL,  -- ✅ Allows user to override default savings %
    adjusted_needs_percentage NUMERIC(5,2) NULL,  -- ✅ Allows user to override default needs %
    adjusted_wants_percentage NUMERIC(5,2) NULL,  -- ✅ Allows user to override default wants %
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),

    CONSTRAINT budgets_pkey PRIMARY KEY (referencecode),

    -- ✅ Link to Users Table
    CONSTRAINT budgets_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES "user".users (id)
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

ALTER TABLE budgets
    OWNER TO "default";
