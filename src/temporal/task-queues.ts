/**
 * Temporal — Task Queue Names
 *
 * One queue per domain worker. Kept as string constants so activity callers
 * and the worker bootstrap can't drift apart on a typo.
 */
export const TASK_QUEUES = {
  EMAIL: 'dws-email',
  SOCIAL: 'dws-social',
  TED: 'dws-ted',
  REPORTS: 'dws-reports',
  DOCUSIGN: 'dws-docusign',
  STRIPE: 'dws-stripe',
} as const;

export type TaskQueueName = (typeof TASK_QUEUES)[keyof typeof TASK_QUEUES];
