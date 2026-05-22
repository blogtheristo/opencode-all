export type PipelineStage =
  | 'idea'
  | 'research'
  | 'outline'
  | 'draft'
  | 'media'
  | 'review'
  | 'approved'
  | 'published';

export type ContentType =
  | 'blog'
  | 'social'
  | 'video'
  | 'email'
  | 'whitepaper'
  | 'presentation'
  | 'podcast'
  | 'newsletter'
  | 'case-study';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface MediaAttachment {
  id: string;
  name: string;
  dataUrl: string;
  mimeType: string;
  size: number;
  addedAt: string;
}

export interface ResearchNote {
  id: string;
  content: string;
  source?: string;
  createdAt: string;
}

export interface ReviewNote {
  id: string;
  content: string;
  author: string;
  status: 'comment' | 'revision-needed' | 'approved';
  createdAt: string;
}

export interface ContentItem {
  id: string;
  title: string;
  stage: PipelineStage;
  type: ContentType;
  priority: Priority;
  idea: string;
  researchNotes: ResearchNote[];
  outline: string;
  script: string;
  media: MediaAttachment[];
  reviewNotes: ReviewNote[];
  tags: string[];
  platforms: string[];
  scheduledDate: string;
  publishedDate: string;
  publishedUrl: string;
  assignee: string;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineStageConfig {
  id: PipelineStage;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export const STAGES: PipelineStageConfig[] = [
  {
    id: 'idea',
    label: 'Idea',
    icon: '💡',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    description: 'Raw ideas and concepts',
  },
  {
    id: 'research',
    label: 'Research',
    icon: '🔍',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    description: 'Gathering information and references',
  },
  {
    id: 'outline',
    label: 'Outline',
    icon: '📋',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    description: 'Structuring the content',
  },
  {
    id: 'draft',
    label: 'Script / Draft',
    icon: '✏️',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    description: 'Writing the full content',
  },
  {
    id: 'media',
    label: 'Media',
    icon: '🖼️',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    description: 'Attach images, videos, assets',
  },
  {
    id: 'review',
    label: 'Review',
    icon: '👀',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    description: 'Feedback and revisions',
  },
  {
    id: 'approved',
    label: 'Approved',
    icon: '✅',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    description: 'Ready for publishing',
  },
  {
    id: 'published',
    label: 'Published',
    icon: '🚀',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    description: 'Live and published',
  },
];

export const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: 'blog', label: 'Blog Post' },
  { value: 'social', label: 'Social Media' },
  { value: 'video', label: 'Video Script' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'whitepaper', label: 'Whitepaper' },
  { value: 'presentation', label: 'Presentation' },
  { value: 'podcast', label: 'Podcast Script' },
  { value: 'case-study', label: 'Case Study' },
];

export const PLATFORMS = [
  'LinkedIn',
  'Twitter/X',
  'YouTube',
  'Blog',
  'Email',
  'Instagram',
  'TikTok',
  'Medium',
  'Substack',
  'Website',
];
