-- Add template_id to contracts table
ALTER TABLE public.contracts 
ADD COLUMN IF NOT EXISTS template_id TEXT DEFAULT 'modern-business' NOT NULL;

-- Create an index to support any potential template-based filtering
CREATE INDEX IF NOT EXISTS idx_contracts_template_id ON public.contracts(template_id);
