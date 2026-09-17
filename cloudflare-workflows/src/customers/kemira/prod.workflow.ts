import { WorkflowBase } from '../../base/WorkflowBase.js';
import { WorkflowConfig } from '../../base/types.js';

/**
 * Kemira — Production workflow
 * Trigger: PR merged to main (manually gated via approval webhook)
 * URL: https://kemira.dws6.com
 */
export class KemiraProdWorkflow extends WorkflowBase {
  readonly config: WorkflowConfig = {
    customer: 'kemira',
    env: 'prod',
    hostname: 'kemira.dws6.com',
    branchPattern: 'main',
    wranglerEnv: 'kemira-prod',
    notifyWebhookSecretName: 'KEMIRA_TEAMS_WEBHOOK',
    envVars: {
      CUSTOMER_ID: 'kemira',
      CUSTOMER_NAME: 'Kemira Oyj',
      THEME: 'kemira',
      DEPLOY_ENV: 'prod',
      INDUSTRY: 'chemicals',
    },
  };
}
