CREATE OR REPLACE FUNCTION public.createbudget(
    in_userid bigint,
    in_year integer,
    in_month integer
)
    RETURNS TABLE(
    referencecode text
    )
    LANGUAGE 'plpgsql'
AS $BODY$

    /*

     SELECT * FROM public.createbudget(1000000000, 2025, 3)

     */

BEGIN
    IF NOT EXISTS(
        SELECT 1 FROM budgets
        WHERE year = in_year
          AND month = in_month
          AND user_id = in_userid
    ) THEN

        -- Create the new budget
        INSERT INTO budgets(user_id, year, month, created_at)
        VALUES (in_userid, in_year, in_month, NOW());

        -- Check and copy income record if none exists for the current month.
        IF NOT EXISTS(
            SELECT 1 FROM income
            WHERE user_id = in_userid
              AND year = in_year
              AND month = in_month
        ) THEN
            -- Default income.
            INSERT INTO income(user_id, year, month, income_amount)
            VALUES (
               in_userid,
               in_year,
               in_month,
               COALESCE(
                       (SELECT usr.default_income
                        FROM "user".settings usr
                        WHERE usr.user_id = in_userid
                        LIMIT 1),
                       0
               )
            );

        END IF;

        -- Check and copy spending_allocation record if none exists for the current month.
        IF NOT EXISTS(
            SELECT 1 FROM spending_allocation
            WHERE user_id = in_userid
              AND year = in_year
              AND month = in_month
        ) THEN
            INSERT INTO spending_allocation(
                user_id,
                year,
                month,
                savings_percentage,
                needs_percentage,
                wants_percentage
            )
            VALUES (
                       in_userid,
                       in_year,
                       in_month,
                       COALESCE(
                               (SELECT usr.default_savings_percentage
                                FROM "user".settings usr
                                WHERE usr.user_id = 1000000003
                                LIMIT 1),
                               0
                       ),
                       COALESCE(
                               (SELECT usr.default_needs_percentage
                                FROM "user".settings usr
                                WHERE usr.user_id = in_userid
                                LIMIT 1),
                               0
                       ),
                       COALESCE(
                               (SELECT usr.default_wants_percentage
                                FROM "user".settings usr
                                WHERE usr.user_id = in_userid
                                LIMIT 1),
                               0
                       )
                   );
        END IF;


        RETURN QUERY
            SELECT b.referencecode FROM budgets b
            WHERE year = in_year
              AND month = in_month
              AND user_id = in_userid;

    ELSE
        -- If the budget already exists, just return the reference code.
        RETURN QUERY
            SELECT b.referencecode FROM budgets b
            WHERE year = in_year
              AND month = in_month
              AND user_id = in_userid;
    END IF;
END;
$BODY$;

ALTER FUNCTION public.createbudget(bigint, integer, integer)
    OWNER TO "default";
