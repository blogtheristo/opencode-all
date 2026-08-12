import { WorkflowBase } from '../base/WorkflowBase.js';
import { WorkflowConfig } from '../base/types.js';

/**
 * onelifetime.world — Development workflow
 * Trigger: push to `feature/onelifetime-*`
 * URL: https://dev.onelifetime.world
 */
export class OnelifetimeWorldDevWorkflow extends WorkflowBase {
  readonly config: WorkflowConfig = {
    domain: 'onelifetime-world',
    env: 'dev',
    hostname: 'dev.onelifetime.world',
    branchPattern: 'feature/onelifetime-*',
    wranglerEnv: 'onelifetime-world-dev',
    notifyWebhookSecretName: 'DWS_TEAMS_WEBHOOK',
    envVars: {
      SITE: 'onelifetime.world',
      DEPLOY_ENV: 'dev',
    },
  };
}

/**
 * onelifetime.world — Production workflow
 * Trigger: PR merged to main
 * URL: https://onelifetime.world
 */
export class OnelifetimeWorldProdWorkflow extends WorkflowBase {
  readonly config: WorkflowConfig = {
    domain: 'onelifetime-world',
    env: 'prod',
    hostname: 'onelifetime.world',
    branchPattern: 'main',
    wranglerEnv: 'onelifetime-world-prod',
    notifyWebhookSecretName: 'DWS_TEAMS_WEBHOOK',
    envVars: {
      SITE: 'onelifetime.world',
      DEPLOY_ENV: 'prod',
    },
  };
}
