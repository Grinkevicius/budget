INSERT INTO categories (type) VALUES
('Needs'),
('Wants'),
('Savings');

INSERT INTO budgets (referencecode, user_id, year, month, adjusted_income, adjusted_savings_percentage, adjusted_needs_percentage, adjusted_wants_percentage, created_at)
VALUES
    ('BUD202502190210XY', 1000000000, 2025, 2, 4000.00, 20.00, 50.00, 30.00, NOW());


INSERT INTO transactions (referencecode, user_id, budget_code, category_code, description, amount, transaction_date, note)
VALUES
    -- 🔹 Needs Transactions
    ('TRA202502190210A1', 1000000000, 'BUD202502190210XY', 'CAT20250219020744B7', 'February Rent', 1200.00, '2025-02-01', 'Monthly rent payment'),
    ('TRA202502190211B2', 1000000000, 'BUD202502190210XY', 'CAT20250219020744B7', 'Grocery Shopping', 250.00, '2025-02-03', 'Walmart groceries'),
    ('TRA202502190212C3', 1000000000, 'BUD202502190210XY', 'CAT20250219020744B7', 'Electricity Bill', 150.00, '2025-02-05', 'February utility bill'),

    -- 🔹 Wants Transactions
    ('TRA202502190213D4', 1000000000, 'BUD202502190210XY', 'CAT20250219020744C6', 'Netflix Subscription', 15.99, '2025-02-07', 'Netflix monthly payment'),
    ('TRA202502190214E5', 1000000000, 'BUD202502190210XY', 'CAT20250219020744C6', 'Clothes Shopping', 89.50, '2025-02-08', 'Bought new jeans'),
    ('TRA202502190215F6', 1000000000, 'BUD202502190210XY', 'CAT20250219020744C6', 'Concert Tickets', 120.00, '2025-02-09', 'Drake concert ticket'),

    -- 🔹 Savings Transactions
    ('TRA202502190216G7', 1000000000, 'BUD202502190210XY', 'CAT2025021902074470', 'Savings Deposit', 500.00, '2025-02-10', 'Added to emergency fund'),
    ('TRA202502190217H8', 1000000000, 'BUD202502190210XY', 'CAT2025021902074470', 'Stock Investment', 200.00, '2025-02-11', 'Bought Tesla stocks'),
    ('TRA202502190218I9', 1000000000, 'BUD202502190210XY', 'CAT2025021902074470', 'Retirement Contribution', 300.00, '2025-02-12', '401(k) contribution');
