-- Migration 00017: Remove Manager Role

-- 1. Downgrade existing managers to members
UPDATE public.profiles SET role = 'member' WHERE role = 'manager';

-- 2. Update RLS Helper Functions
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS
$$ SELECT current_user_role() = 'owner' $$;

CREATE OR REPLACE FUNCTION public.is_staff() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS
$$ SELECT current_user_role() IN ('owner', 'member') $$;

-- 3. Rebuild the ENUM to drop the 'manager' value
ALTER TYPE user_role RENAME TO user_role_old;
CREATE TYPE user_role AS ENUM ('owner', 'member', 'client');
ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;
ALTER TABLE public.profiles ALTER COLUMN role TYPE user_role USING role::text::user_role;
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'member'::user_role;
DROP TYPE user_role_old;
