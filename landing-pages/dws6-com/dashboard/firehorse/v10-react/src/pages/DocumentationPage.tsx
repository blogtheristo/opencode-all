// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- dws6.com/dashboard/firehorse/v10-react/src/pages/DocumentationPage.tsx
import { BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import {
  documentationForRole,
  documentationUrl,
  learningHubBaseUrl,
  resolveAudienceRole,
} from '../lib/documentation';

export function DocumentationPage() {
  const { user } = useAuth();
  const role = resolveAudienceRole(user?.user_metadata?.role);
  const documents = documentationForRole(role);
  const baseUrl = learningHubBaseUrl(import.meta.env.VITE_LEARNING_HUB_BASE_URL);

  return (
    <section aria-labelledby="documentation-title" className="space-y-6">
      <div className="card">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary-50 p-3 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            <BookOpen className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h2 id="documentation-title" className="text-2xl font-bold text-foreground">Documentation</h2>
            <p className="mt-2 text-fg-muted">
              Showing the documentation catalogue for audience role{' '}
              <span className="font-semibold capitalize text-foreground">{role}</span>.
            </p>
            <p className="mt-2 text-sm text-fg-muted">
              Role metadata controls discovery only. The linked pack is the physically separated distribution boundary.
            </p>
            {!baseUrl && (
              <p className="mt-3 rounded-lg border border-warning-300 bg-warning-50 px-3 py-2 text-sm text-warning-900 dark:border-warning-700 dark:bg-warning-900/20 dark:text-warning-200">
                This catalogue is available, but the approved pack location has not been configured.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {documents.map((document) => (
          <article key={document.id} className="card flex flex-col">
            <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-wide">{role} pack</span>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-foreground">{document.title}</h3>
            <p className="mt-2 flex-1 text-sm text-fg-muted">{document.summary}</p>
            {baseUrl ? (
              <a
                href={documentationUrl(baseUrl, role, document.output)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 font-semibold text-primary-700 hover:text-primary-800 dark:text-primary-300"
              >
                Open document <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : (
              <p className="mt-4 text-sm font-medium text-fg-muted">Available in the installed {role} pack</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
