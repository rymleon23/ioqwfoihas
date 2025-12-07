-- Migration: Enable Personal Tasks (Tasks without Team)
-- Run this in Supabase SQL Editor

-- ==================================================
-- STEP 1: Make team_id nullable in task table
-- ==================================================

ALTER TABLE task ALTER COLUMN team_id DROP NOT NULL;

-- ==================================================
-- STEP 2: Add default workflow_state for personal tasks
-- ==================================================

-- Create a function to get or create personal workflow states
CREATE OR REPLACE FUNCTION get_personal_workflow_state(
    p_workspace_id UUID,
    p_state_type TEXT DEFAULT 'unstarted'
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    v_state_id UUID;
BEGIN
    -- Check if personal workflow state exists
    SELECT id INTO v_state_id
    FROM workflow_state
    WHERE workspace_id = p_workspace_id
      AND team_id IS NULL
      AND type = p_state_type
    LIMIT 1;
    
    -- If not exists, create it
    IF v_state_id IS NULL THEN
        INSERT INTO workflow_state (workspace_id, team_id, name, type, color, position)
        VALUES (
            p_workspace_id,
            NULL,
            CASE p_state_type
                WHEN 'backlog' THEN 'Backlog'
                WHEN 'unstarted' THEN 'Todo'
                WHEN 'started' THEN 'In Progress'
                WHEN 'completed' THEN 'Done'
                WHEN 'canceled' THEN 'Canceled'
                ELSE 'Unknown'
            END,
            p_state_type,
            CASE p_state_type
                WHEN 'backlog' THEN '#6B7280'
                WHEN 'unstarted' THEN '#3B82F6'
                WHEN 'started' THEN '#F59E0B'
                WHEN 'completed' THEN '#10B981'
                WHEN 'canceled' THEN '#EF4444'
                ELSE '#6B7280'
            END,
            CASE p_state_type
                WHEN 'backlog' THEN 0
                WHEN 'unstarted' THEN 1
                WHEN 'started' THEN 2
                WHEN 'completed' THEN 3
                WHEN 'canceled' THEN 4
                ELSE 5
            END
        )
        RETURNING id INTO v_state_id;
    END IF;
    
    RETURN v_state_id;
END;
$$;

-- ==================================================
-- STEP 3: Create personal default workflow states for existing workspaces
-- ==================================================

DO $$
DECLARE
    ws RECORD;
BEGIN
    FOR ws IN SELECT id FROM workspace LOOP
        PERFORM get_personal_workflow_state(ws.id, 'backlog');
        PERFORM get_personal_workflow_state(ws.id, 'unstarted');
        PERFORM get_personal_workflow_state(ws.id, 'started');
        PERFORM get_personal_workflow_state(ws.id, 'completed');
        PERFORM get_personal_workflow_state(ws.id, 'canceled');
    END LOOP;
END;
$$;

-- ==================================================
-- STEP 4: Add index for personal tasks query optimization
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

-- Create new policies
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
    v_state_id UUID;
    v_user_id UUID;
    v_result json;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Not authenticated');
    END IF;
    
    -- Get default state (unstarted/Todo)
    v_state_id := get_personal_workflow_state(p_workspace_id, 'unstarted');
    
    -- Create the task
    INSERT INTO task (
        workspace_id,
        team_id,
        title,
        description,
        priority,
        state_id,
        assignee_id,
        created_by
    ) VALUES (
        p_workspace_id,
        NULL,  -- No team = personal task
        p_title,
        p_description,
        p_priority,
        v_state_id,
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
-- 1. task.team_id is now nullable
-- 2. Personal workflow states created for each workspace
-- 3. Indexes added for performance
-- 4. RLS policies allow users to manage their personal tasks
-- 5. RPC function create_personal_task available
