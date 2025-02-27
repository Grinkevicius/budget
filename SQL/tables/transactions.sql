-- DEPENDS ON PGCRYPTO
-- Table: transactions

-- DROP TABLE IF EXISTS transactions;

CREATE TABLE IF NOT EXISTS transactions
(
    referencecode TEXT NOT NULL DEFAULT (
        'TRA'
            || to_char(NOW(), 'YYYYMMDDHH24MISS')
            || upper(substring(gen_random_uuid()::text, 1, 2))
        ),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    user_id BIGINT,
    budget_code TEXT NOT NULL,  -- ✅ Link to budgets
    category_code TEXT NOT NULL,  -- ✅ Link to categories
    description TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    transaction_date DATE NOT NULL,
    week INTEGER GENERATED ALWAYS AS (EXTRACT(WEEK FROM transaction_date)) STORED, -- ✅ Only keep week
    is_recurring BOOLEAN DEFAULT FALSE,
    note TEXT,

    CONSTRAINT transactions_pkey PRIMARY KEY (referencecode),

    -- ✅ Foreign Key linking transactions to budgets
    CONSTRAINT transactions_budget_code_fkey FOREIGN KEY (budget_code)
        REFERENCES budgets (referencecode)
        ON UPDATE NO ACTION
        ON DELETE CASCADE,

    -- ✅ Foreign Key linking transactions to categories
    CONSTRAINT transactions_category_code_fkey FOREIGN KEY (category_code)
        REFERENCES categories (referencecode)
        ON UPDATE NO ACTION
        ON DELETE SET NULL,

    CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES "user".users (id)
        ON UPDATE NO ACTION
        ON DELETE CASCADE,

    -- ✅ Ensure amount is positive
    CONSTRAINT transactions_amount_check CHECK (amount > 0)
);

ALTER TABLE transactions
    OWNER TO "default";
