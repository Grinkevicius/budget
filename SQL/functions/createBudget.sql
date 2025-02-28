-- DROP FUNCTION public.createbudget(in_userid bigint, in_year integer, in_month integer);

CREATE OR REPLACE FUNCTION public.createbudget(
    in_userid bigint,
    in_year integer,
    in_month integer
)
    RETURNS TABLE(referencecode text)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000
AS $BODY$

    /*
        SELECT * FROM createbudget('1000000003', 2024, 4);

    */

DECLARE
    newBudgetRef text;
    prev_year INTEGER;
    prev_month INTEGER;
    prevBudgetRef text;
    rec RECORD;
BEGIN
    IF NOT EXISTS(
        SELECT 1 FROM budgets
        WHERE year = in_year
          AND month = in_month
          AND user_id = in_userid
    ) THEN
        -- Create the new budget and capture its reference code.
        INSERT INTO budgets(user_id, year, month, created_at)
        VALUES (in_userid, in_year, in_month, NOW())
        RETURNING budgets.referencecode INTO newBudgetRef;

        -- Insert income if none exists for the current month.
        IF NOT EXISTS(
            SELECT 1 FROM income
            WHERE user_id = in_userid
              AND year = in_year
              AND month = in_month
        ) THEN
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

        -- Insert spending_allocation if none exists for the current month.
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
                        WHERE usr.user_id = in_userid
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

        -- Calculate previous period.
        IF in_month = 1 THEN
            prev_year := in_year - 1;
            prev_month := 12;
        ELSE
            prev_year := in_year;
            prev_month := in_month - 1;
        END IF;

        -- Get the previous budget's reference code (if exists).
        SELECT b.referencecode INTO prevBudgetRef
        FROM budgets b
        WHERE b.user_id = in_userid
          AND b.year = prev_year
          AND b.month = prev_month
        LIMIT 1;

        -- If a previous budget exists, loop through its recurring transactions.
        IF prevBudgetRef IS NOT NULL THEN
            FOR rec IN
                SELECT *
                FROM transactions
                WHERE user_id = in_userid
                  AND is_recurring = true
                  AND budget_code = prevBudgetRef
                LOOP
                    INSERT INTO transactions (user_id, budget_code, category_code, transaction_date, description, amount, is_recurring, note)
                    VALUES (rec.user_id, newBudgetRef, rec.category_code, (SELECT make_date(in_year, in_month, 1)), rec.description, rec.amount, rec.is_recurring, rec.note);
                END LOOP;
        END IF;

        RETURN QUERY
            SELECT newBudgetRef AS referencecode;
    ELSE
        -- If the budget already exists, return reference code.
        RETURN QUERY
            SELECT b.referencecode
            FROM budgets b
            WHERE year = in_year
              AND month = in_month
              AND user_id = in_userid;
    END IF;
END;
$BODY$;

ALTER FUNCTION public.createbudget(bigint, integer, integer)
    OWNER TO "default";
