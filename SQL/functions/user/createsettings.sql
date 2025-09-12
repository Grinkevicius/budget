CREATE OR REPLACE FUNCTION "user".createsettings()
    RETURNS trigger
    LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO "user".settings (
        user_id,
        default_income,
        default_savings_percentage,
        default_needs_percentage,
        default_wants_percentage,
        updated_at
    )
    VALUES (
       NEW.id,
       0,
       0,
       0,
       0,
       NOW()
   );
    RETURN NEW;
END;
$$;


CREATE TRIGGER trigger_insert_default_settings
    AFTER INSERT ON "user".users
    FOR EACH ROW
EXECUTE FUNCTION "user".createsettings();