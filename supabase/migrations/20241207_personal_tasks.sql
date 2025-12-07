-- Migration: Enable Personal Tasks (Tasks without Team)
-- Run this in Supabase SQL Editor
-- SIMPLIFIED VERSION - No workflow state changes needed

-- ==================================================
-- STEP 1: Make team_id nullable in task table
-- ==================================================

ALTER TABLE task ALTER COLUMN team_id DROP NOT NULL;

-- ==================================================
-- STEP 2: Make state_id nullable for personal tasks
-- ==================================================

ALTER TABLE task ALTER COLUMN state_id DROP NOT NULL;

-- ==================================================
-- STEP 3: Add status field for personal tasks
-- ==================================================

-- Add a simple status field for tasks without workflow_state
ALTER TABLE task ADD COLUMN IF NOT EXISTS status text 
    CHECK (status IN ('todo', 'in_progress', 'done', 'canceled'));

-- Set default status
ALTER TABLE task ALTER COLUMN status SET DEFAULT 'todo';

-- ==================================================
-- STEP 4: Add index for personal tasks query
-- ==================================================

CREATE INDEX IF NOT EXISTS idx_task_personal 
ON task (workspace_id, assignee_id) 
WHERE team_id IS NULL;

-- ==================================================
-- STEP 5: RLS Policies for Personal Tasks
-- ==================================================

-- Drop existing policies if they conflict
DROP POLICY IF EXISTS "Users can view their personal tasks" ON task;
DROP POLICY IF EXISTS "Users can create personal tasks" ON task;
DROP POLICY IF EXISTS "Users can update their personal tasks" ON task;
DROP POLICY IF EXISTS "Users can delete their personal tasks" ON task;

-- Create new policies for personal tasks
CREATE POLICY "Users can view their personal tasks"
ON task FOR SELECT
USING (
    team_id IS NULL 
    AND assignee_id = auth.uid()
);

CREATE POLICY "Users can create personal tasks"
ON task FOR INSERT
WITH CHECK (
    team_id IS NULL 
    AND assignee_id = auth.uid()
);

CREATE POLICY "Users can update their personal tasks"
ON task FOR UPDATE
USING (
    team_id IS NULL 
    AND assignee_id = auth.uid()
);

CREATE POLICY "Users can delete their personal tasks"
ON task FOR DELETE
USING (
    team_id IS NULL 
    AND assignee_id = auth.uid()
);

-- ==================================================
-- STEP 6: RPC Function to create personal task
-- ==================================================

CREATE OR REPLACE FUNCTION create_personal_task(
    p_workspace_id UUID,
    p_title TEXT,
    p_description TEXT DEFAULT NULL,
    p_priority INTEGER DEFAULT 0
)
RETURNS json
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_task_id UUID;
    v_user_id UUID;
    v_result json;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Not authenticated');
    END IF;
    
    -- Create the personal task (no team_id, no state_id, use status instead)
    INSERT INTO task (
        workspace_id,
        team_id,
        title,
        description,
        priority,
        state_id,
        status,
        assignee_id,
        created_by
    ) VALUES (
        p_workspace_id,
        NULL,           -- No team = personal task
        p_title,
        p_description,
        p_priority,
        NULL,           -- No workflow state
        'todo',         -- Simple status
        v_user_id,
        v_user_id
    )
    RETURNING id INTO v_task_id;
    
    RETURN json_build_object(
        'success', true,
        'task_id', v_task_id
    );
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$;

GRANT EXECUTE ON FUNCTION create_personal_task(UUID, TEXT, TEXT, INTEGER) TO authenticated;

-- ==================================================
-- DONE! 
-- ==================================================
-- Summary:
-- 1. task.team_id is now nullable (personal tasks)
-- 2. task.state_id is now nullable
-- 3. Added task.status field for simple status tracking
-- 4. Indexes added for performance
-- 5. RLS policies allow users to manage their personal tasks
-- 6. RPC function create_personal_task available
