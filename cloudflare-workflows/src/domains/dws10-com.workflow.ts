import { WorkflowBase } from '../base/WorkflowBase.js';
import { WorkflowConfig } from '../base/types.js';

/**
 * dws10.com — Development workflow
 * Trigger: push to `feature/dws10-*`
 * URL: https://dev.dws10.com
 */
export class Dws10ComDevWorkflow extends WorkflowBase {
  readonly config: WorkflowConfig = {
    domain: 'dws10-com',
    env: 'dev',
    hostname: 'dev.dws10.com',
    branchPattern: 'feature/dws10-*',
    wranglerEnv: 'dws10-com-dev',
    notifyWebhookSecretName: 'DWS_TEAMS_WEBHOOK',
    envVars: {
      SITE: 'dws10.com',
      DEPLOY_ENV: 'dev',
    },
  };
}

/**
 * dws10.com — Production workflow
 * Trigger: PR merged to main
 * URL: https://dws10.com
 */
export class Dws10ComProdWorkflow extends WorkflowBase {
  readonly config: WorkflowConfig = {
    domain: 'dws10-com',
    env: 'prod',
    hostname: 'dws10.com',
    branchPattern: 'main',
    wranglerEnv: 'dws10-com-prod',
    notifyWebhookSecretName: 'DWS_TEAMS_WEBHOOK',
    envVars: {
      SITE: 'dws10.com',
      DEPLOY_ENV: 'prod',
    },
  };
}
