CREATE TABLE budget_notes (
referencecode UUID PRIMARY KEY DEFAULT gen_random_uuid(),
budget_code TEXT NOT NULL,
content TEXT NOT NULL,
created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_budget
  FOREIGN KEY (budget_code)
      REFERENCES budgets(referencecode)
      ON DELETE CASCADE
);

CREATE INDEX idx_budget_notes_budget_code ON budget_notes(budget_code);







-- CREATE OR REPLACE FUNCTION update_budget_notes_updated_at()
--     RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$ language 'plpgsql';
--
-- CREATE TRIGGER update_budget_notes_updated_at
--     BEFORE UPDATE ON budget_notes
--     FOR EACH ROW
-- EXECUTE FUNCTION update_budget_notes_updated_at();