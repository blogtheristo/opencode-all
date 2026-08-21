import { WorkflowBase } from '../base/WorkflowBase.js';
import { WorkflowConfig } from '../base/types.js';

/**
 * dws6.com — Development workflow
 * Trigger: push to any non-customer branch on dws6.com changes
 * URL: https://dev.dws6.com
 */
export class Dws6ComDevWorkflow extends WorkflowBase {
  readonly config: WorkflowConfig = {
    domain: 'dws6-com',
    env: 'dev',
    hostname: 'dev.dws6.com',
    branchPattern: 'feature/*',
    wranglerEnv: 'dws6-com-dev',
    notifyWebhookSecretName: 'DWS_TEAMS_WEBHOOK',
    envVars: {
      SITE: 'dws6.com',
      DEPLOY_ENV: 'dev',
    },
  };
}

/**
 * dws6.com — Production workflow
 * Trigger: PR merged to main
 * URL: https://dws6.com
 */
export class Dws6ComProdWorkflow extends WorkflowBase {
  readonly config: WorkflowConfig = {
    domain: 'dws6-com',
    env: 'prod',
    hostname: 'dws6.com',
    branchPattern: 'main',
    wranglerEnv: 'dws6-com-prod',
    notifyWebhookSecretName: 'DWS_TEAMS_WEBHOOK',
    envVars: {
      SITE: 'dws6.com',
      DEPLOY_ENV: 'prod',
    },
  };
}
