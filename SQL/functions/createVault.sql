-- DROP FUNCTION public.createvault(in_userid bigint, in_name text);

CREATE OR REPLACE FUNCTION public.createvault(
    in_userid bigint,
    in_name text
)
    RETURNS TABLE(referencecode text)
    LANGUAGE plpgsql
AS $BODY$


    /*
        SELECT * FROM createvault('1000000003', 'Test');
        SELECT * FROM vaults
    */



BEGIN
    RETURN QUERY
        INSERT INTO vaults (user_id, name, created_at)
            VALUES (in_userid, in_name, NOW())
            RETURNING vaults.referencecode;
END;
$BODY$;

ALTER FUNCTION public.createvault(bigint, text)
    OWNER TO "default";

