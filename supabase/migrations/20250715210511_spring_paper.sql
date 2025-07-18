/*
  # Create empty user profile function

  1. New Functions
    - `create_empty_user_profile`: Creates empty profile data for new users
  
  2. Triggers
    - Add trigger to automatically create empty profile data when a new user signs up
*/

-- Function to create empty user profile data
CREATE OR REPLACE FUNCTION public.create_empty_user_profile()
RETURNS TRIGGER AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Insert user profile
  INSERT INTO public.user_profiles (user_id)
  VALUES (NEW.id)
  RETURNING id INTO new_user_id;
  
  -- Create empty address
  INSERT INTO public.addresses (
    user_id,
    street,
    number,
    neighborhood,
    city,
    state,
    zip_code,
    is_primary
  ) VALUES (
    NEW.id,
    '',
    '',
    '',
    '',
    '',
    '',
    true
  );
  
  -- Create empty emergency contact
  INSERT INTO public.emergency_contacts (
    user_id,
    name,
    relationship,
    phone,
    is_primary
  ) VALUES (
    NEW.id,
    '',
    '',
    '',
    true
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create empty profile data when a new user is created
CREATE TRIGGER create_empty_user_profile_trigger
AFTER INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.create_empty_user_profile();