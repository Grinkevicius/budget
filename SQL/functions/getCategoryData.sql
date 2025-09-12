CREATE OR REPLACE FUNCTION public.getcategorydata(
    in_userid bigint,
    in_categorycode text,
    in_year integer,
    in_month integer
)
    RETURNS TABLE(
     category_code text,
     category_type text,
     allocated_percentage numeric,
     income numeric,
     max_spend numeric,
     spent_amount numeric
 )
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000
AS $BODY$

    /*
    SELECT * FROM getCategoryData(1000000003, 'CAT2025022222030415', 2025, 2);


    SELECT * FROM income
    WHERE year = 2025 and month = 3;
    SELECT * FROM categories
    WHERE referencecode = 'CAT2025022222030415'

                  SELECT * FROM budgets b
                      WHERE b.user_id = 1000000003
                          AND b.year = 2025
                          AND b.month = 3

 */

BEGIN
    RETURN QUERY
        SELECT
            c.referencecode AS category_code,
            c.type AS category_type,
            CASE
                WHEN c.type = 'Savings' THEN sa.savings_percentage::numeric
                WHEN c.type = 'Needs'   THEN sa.needs_percentage::numeric
                WHEN c.type = 'Wants'   THEN sa.wants_percentage::numeric
                ELSE 0::numeric
                END AS allocated_percentage,
            COALESCE(i.total_income, 0) AS income,
            (
                CASE
                    WHEN c.type = 'Savings' THEN sa.savings_percentage::numeric
                    WHEN c.type = 'Needs'   THEN sa.needs_percentage::numeric
                    WHEN c.type = 'Wants'   THEN sa.wants_percentage::numeric
                    ELSE 0::numeric
                    END / 100.0
                ) * COALESCE(i.total_income, 0) AS max_spend,
            COALESCE(SUM(t.amount), 0) AS spent_amount
        FROM categories c
                 LEFT JOIN budgets b
                           ON b.user_id = in_userid
                               AND b.year = in_year
                               AND b.month = in_month
                 LEFT JOIN spending_allocation sa
                           ON sa.user_id = in_userid
                               AND sa.year = in_year
                               AND sa.month = in_month
                 LEFT JOIN (
                    SELECT user_id, year, month, SUM(income_amount) AS total_income
                    FROM income
                    GROUP BY user_id, year, month
                 ) i
                   ON i.user_id = in_userid
                       AND i.year = in_year
                       AND i.month = in_month
                 LEFT JOIN transactions t
                           ON t.budget_code   = b.referencecode
                               AND t.category_code = c.referencecode
        WHERE c.referencecode = in_categorycode
        GROUP BY
            c.referencecode,
            c.type,
            sa.savings_percentage,
            sa.needs_percentage,
            sa.wants_percentage,
            i.total_income;
END;
$BODY$;
