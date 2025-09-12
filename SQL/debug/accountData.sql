SELECT b.referencecode AS budgetCode,
       i.referencecode AS incomeCode,
       i.income_amount AS income,
       t.referencecode AS transactionCode,
       c.type AS categoryType,
       sa.referencecode AS allocationsCode
FROM budgets b
   LEFT JOIN income i ON i.user_id = b.user_id
   LEFT JOIN transactions t ON t.user_id = b.user_id
   LEFT JOIN categories c ON c.referencecode = t.category_code
   LEFT JOIN spending_allocation sa ON sa.user_id = b.user_id
WHERE b.user_id = '1000000000';


--BUDGET

SELECT b.referencecode, i.* FROM budgets b
    LEFT OUTER JOIN income i
        ON i.year = b.year AND i.month = b.month
    WHERE b.referencecode = 'BUD20250227013819D0'
