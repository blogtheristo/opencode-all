import { WorkflowBase } from '../../base/WorkflowBase.js';
import { WorkflowConfig } from '../../base/types.js';

/**
 * Outokumpu — Development workflow
 * Trigger: push to `claude/outokumpu-*` or `feature/outokumpu-*`
 * URL: https://dev-outokumpu.dws6.com
 */
export class OutokumpuDevWorkflow extends WorkflowBase {
  readonly config: WorkflowConfig = {
    customer: 'outokumpu',
    env: 'dev',
    hostname: 'dev-outokumpu.dws6.com',
    branchPattern: 'claude/outokumpu-*',
    wranglerEnv: 'outokumpu-dev',
    notifyWebhookSecretName: 'OUTOKUMPU_TEAMS_WEBHOOK',
    envVars: {
      CUSTOMER_ID: 'outokumpu',
      CUSTOMER_NAME: 'Outokumpu Oyj',
      THEME: 'outokumpu',
      DEPLOY_ENV: 'dev',
      INDUSTRY: 'steel-manufacturing',
    },
  };
}
