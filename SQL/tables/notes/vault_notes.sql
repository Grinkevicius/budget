CREATE TABLE vault_notes (
 referencecode UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 vault_code TEXT NOT NULL,
 content TEXT NOT NULL,
 created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_vault
     FOREIGN KEY (vault_code)
         REFERENCES vaults(referencecode)
         ON DELETE CASCADE
);

CREATE INDEX idx_vault_notes_vault_code ON vault_notes(vault_code);
