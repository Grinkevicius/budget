CREATE TABLE transaction_notes (
    referencecode UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_code TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transaction
        FOREIGN KEY (transaction_code)
        REFERENCES transactions(referencecode)
        ON DELETE CASCADE
);

CREATE INDEX idx_transaction_notes_transaction_code ON transaction_notes(transaction_code);
