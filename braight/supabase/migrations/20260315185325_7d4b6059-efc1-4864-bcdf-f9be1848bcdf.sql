-- Allow users to delete their own draft projects
CREATE POLICY "Users can delete own projects"
ON public.projects
FOR DELETE
TO authenticated
USING (auth.uid() = user_id AND status = 'draft');