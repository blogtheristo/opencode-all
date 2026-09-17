import { WorkflowBase } from '../../base/WorkflowBase.js';
import { WorkflowConfig } from '../../base/types.js';

/**
 * NCC — Development workflow
 * Trigger: push to `claude/ncc-*` or `feature/ncc-*`
 * URL: https://dev-ncc.dws6.com
 */
export class NccDevWorkflow extends WorkflowBase {
  readonly config: WorkflowConfig = {
    customer: 'ncc',
    env: 'dev',
    hostname: 'dev-ncc.dws6.com',
    branchPattern: 'claude/ncc-*',
    wranglerEnv: 'ncc-dev',
    notifyWebhookSecretName: 'NCC_TEAMS_WEBHOOK',
    envVars: {
      CUSTOMER_ID: 'ncc',
      CUSTOMER_NAME: 'NCC AB',
      THEME: 'ncc',
      DEPLOY_ENV: 'dev',
      INDUSTRY: 'construction',
    },
  };
}
