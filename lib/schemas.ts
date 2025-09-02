import { z } from 'zod';

// Campaign schemas
export const createCampaignSchema = z.object({
   name: z.string().min(1, 'Name is required'),
   description: z.string().optional(),
});

export const updateCampaignSchema = z.object({
   name: z.string().min(1, 'Name is required').optional(),
   description: z.string().optional(),
});

// Content schemas
export const createContentSchema = z.object({
   title: z.string().min(1, 'Title is required'),
   body: z.string().optional(),
   campaignId: z.string().min(1, 'Campaign ID is required'),
});

export const updateContentSchema = z.object({
   title: z.string().min(1, 'Title is required').optional(),
   body: z.string().optional(),
});

export const generateContentSchema = z.object({
   prompt: z.string().min(1, 'Prompt is required'),
   campaignId: z.string().min(1, 'Campaign ID is required'),
});

// Asset schemas
export const createAssetSchema = z.object({
   url: z.string().url('Invalid URL'),
   name: z.string().optional(),
   type: z.string().min(1, 'Type is required'),
   size: z.number().optional(),
   description: z.string().optional(),
   tags: z.array(z.string()).optional(),
   contentId: z.string().min(1, 'Content ID is required'),
});

export const updateAssetSchema = z.object({
   url: z.string().url('Invalid URL').optional(),
   name: z.string().optional(),
   type: z.string().min(1, 'Type is required').optional(),
   size: z.number().optional(),
   description: z.string().optional(),
   tags: z.array(z.string()).optional(),
});

// Schedule schemas
export const createScheduleSchema = z.object({
   date: z.string().datetime('Invalid date'),
   status: z.string().min(1, 'Status is required'),
   campaignId: z.string().min(1, 'Campaign ID is required'),
   contentId: z.string().optional(),
});

export const updateScheduleSchema = z.object({
   date: z.string().datetime('Invalid date').optional(),
   status: z.string().min(1, 'Status is required').optional(),
   contentId: z.string().optional(),
});

// Analytics schemas
export const createAnalyticsEventSchema = z.object({
   event: z.string().min(1, 'Event is required'),
   data: z.record(z.any()).optional(),
   organizationId: z.string().optional(),
   campaignId: z.string().optional(),
   contentId: z.string().optional(),
});

// OrgRole enum
export const orgRoleSchema = z.enum(['ADMIN', 'BRAND_OWNER', 'CREATOR']);
