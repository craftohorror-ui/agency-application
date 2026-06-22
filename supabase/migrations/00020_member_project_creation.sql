-- Migration 00020: Enable Member Project Creation

-- 1. Idempotency Cleanup
DROP POLICY IF EXISTS projects_member_insert ON public.projects;
DROP TRIGGER IF EXISTS trg_auto_assign_project_creator ON public.projects;

-- 2. Allow Members (staff) to insert projects into their agency
CREATE POLICY projects_member_insert ON public.projects FOR INSERT 
WITH CHECK (public.is_staff() AND agency_id = public.current_agency_id());

-- 3. Create the Trigger Function to auto-assign the creator
CREATE OR REPLACE FUNCTION public.auto_assign_project_creator()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only auto-assign if the creator is a Member (Owners don't need it for visibility)
  -- The trigger fires exactly once per newly created project.
  IF EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = NEW.created_by 
    AND role = 'member'
  ) THEN
    INSERT INTO public.project_members (project_id, profile_id, role_in_project, agency_id)
    VALUES (NEW.id, NEW.created_by, 'contributor', NEW.agency_id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- 4. Attach the Trigger to the projects table
CREATE TRIGGER trg_auto_assign_project_creator
AFTER INSERT ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.auto_assign_project_creator();
