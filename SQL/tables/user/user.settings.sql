-- Table: "user".settings

-- DROP TABLE IF EXISTS "user".settings;

CREATE TABLE IF NOT EXISTS "user".settings
(
    user_id BIGINT,
    default_income INTEGER DEFAULT 0,
    default_savings_percentage NUMERIC(5) DEFAULT 0,
    default_needs_percentage NUMERIC(5) DEFAULT 0,
    default_wants_percentage NUMERIC(5) DEFAULT 0,
    updated_at DATE,

    CONSTRAINT transactions_pkey PRIMARY KEY (user_id)
);

ALTER TABLE "user".settings
    OWNER TO "default";
