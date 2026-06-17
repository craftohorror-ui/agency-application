-- Add currency, discount, tax, and template fields to invoices
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS discount_type TEXT DEFAULT 'fixed',
ADD COLUMN IF NOT EXISTS discount_value NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax_type TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS template_id TEXT DEFAULT 'modern-business';
