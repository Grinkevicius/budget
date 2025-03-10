-- DEPENDS ON PGCRYPTO

-- DROP TABLE vaults CASCADE

CREATE TABLE IF NOT EXISTS vaults
(
    referencecode TEXT NOT NULL DEFAULT ('VLT'|| to_char(NOW(), 'YYYYMMDDHH24MISS')|| upper(substring(gen_random_uuid()::text, 1, 2))),
    user_id BIGINT,
    name TEXT NOT NULL,
    description TEXT,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),

    CONSTRAINT vaults_pkey PRIMARY KEY (referencecode),

    CONSTRAINT vaults_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES "user".users (id)
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

ALTER TABLE vaults
    OWNER TO "default";
