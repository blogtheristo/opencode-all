import { WorkflowBase } from '../../base/WorkflowBase.js';
import { WorkflowConfig } from '../../base/types.js';

/**
 * Outokumpu — Production workflow
 * Trigger: PR merged to main (manually gated via approval webhook)
 * URL: https://outokumpu.dws6.com
 *
 * Prod gate: a human must POST to /workflows/approve/:instanceId
 * before the deploy step executes.
 */
export class OutokumpuProdWorkflow extends WorkflowBase {
  readonly config: WorkflowConfig = {
    customer: 'outokumpu',
    env: 'prod',
    hostname: 'outokumpu.dws6.com',
    branchPattern: 'main',
    wranglerEnv: 'outokumpu-prod',
    notifyWebhookSecretName: 'OUTOKUMPU_TEAMS_WEBHOOK',
    envVars: {
      CUSTOMER_ID: 'outokumpu',
      CUSTOMER_NAME: 'Outokumpu Oyj',
      THEME: 'outokumpu',
      DEPLOY_ENV: 'prod',
      INDUSTRY: 'steel-manufacturing',
    },
  };
}
