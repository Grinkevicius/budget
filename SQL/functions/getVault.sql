/*
    SELECT * FROM getvault(1000000003, 'VLT2025042021571033');
*/



DROP FUNCTION public.getvault(bigint, text);

CREATE OR REPLACE FUNCTION public.getvault(
    in_userid bigint,
    in_vaultcode text
)
    RETURNS TABLE(
    referencecode text,
    user_id bigint,
    name text,
    description text,
    total_amount numeric,
    target int,
    image text,
    notes text,
    created_at timestamp without time zone,
    transactions jsonb
)
    LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    RETURN QUERY
        SELECT v.referencecode,
               v.user_id,
               v.name,
               v.description,
               v.target,
               COALESCE(SUM(t.amount), 0) as total_amount,
               v.image,
               v.notes,
               v.created_at,
               COALESCE(
               jsonb_agg(
               jsonb_build_object(
                       'referencecode', t.referencecode,
                       'budget_code', t.budget_code,
                       'amount', t.amount,
                       'transaction_date', t.transaction_date,
                       'description', t.description,
                       'created_at', t.created_at
               )) FILTER (WHERE t.referencecode IS NOT NULL),
               '[]'::jsonb
               ) as transactions
        FROM vaults v
                 LEFT JOIN transactions t ON t.vault_code = v.referencecode
        WHERE v.user_id = in_userid
          AND v.referencecode = in_vaultcode
        GROUP BY v.referencecode,
                 v.user_id,
                 v.name,
                 v.description,
                 v.target,
                 v.image,
                 v.notes,
                 v.created_at;
END;
$BODY$;

ALTER FUNCTION public.getvault(bigint, text)
    OWNER TO "default";