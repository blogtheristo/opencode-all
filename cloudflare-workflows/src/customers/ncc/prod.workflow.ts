import { WorkflowBase } from '../../base/WorkflowBase.js';
import { WorkflowConfig } from '../../base/types.js';

/**
 * NCC — Production workflow
 * Trigger: PR merged to main (manually gated via approval webhook)
 * URL: https://ncc.dws6.com
 */
export class NccProdWorkflow extends WorkflowBase {
  readonly config: WorkflowConfig = {
    customer: 'ncc',
    env: 'prod',
    hostname: 'ncc.dws6.com',
    branchPattern: 'main',
    wranglerEnv: 'ncc-prod',
    notifyWebhookSecretName: 'NCC_TEAMS_WEBHOOK',
    envVars: {
      CUSTOMER_ID: 'ncc',
      CUSTOMER_NAME: 'NCC AB',
      THEME: 'ncc',
      DEPLOY_ENV: 'prod',
      INDUSTRY: 'construction',
    },
  };
}
