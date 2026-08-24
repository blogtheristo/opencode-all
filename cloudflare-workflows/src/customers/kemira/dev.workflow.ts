import { WorkflowBase } from '../../base/WorkflowBase.js';
import { WorkflowConfig } from '../../base/types.js';

/**
 * Kemira — Development workflow
 * Trigger: push to `claude/kemira-*` or `feature/kemira-*`
 * URL: https://dev-kemira.dws6.com
 */
export class KemiraDevWorkflow extends WorkflowBase {
  readonly config: WorkflowConfig = {
    customer: 'kemira',
    env: 'dev',
    hostname: 'dev-kemira.dws6.com',
    branchPattern: 'claude/kemira-*',
    wranglerEnv: 'kemira-dev',
    notifyWebhookSecretName: 'KEMIRA_TEAMS_WEBHOOK',
    envVars: {
      CUSTOMER_ID: 'kemira',
      CUSTOMER_NAME: 'Kemira Oyj',
      THEME: 'kemira',
      DEPLOY_ENV: 'dev',
      INDUSTRY: 'chemicals',
    },
  };
}
