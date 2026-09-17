/**
 * TemplateEditorPage - Firehorse report template editor
 * Create and edit custom report templates (JSON config) for the Report Engine.
 * Stored in Supabase report_templates table.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ReportTemplate {
  id: string;
  template_id: string;
  template_name: string;
  template_version: string;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

const DEFAULT_TEMPLATE: Record<string, unknown> = {
  templateId: 'CUSTOM-TEMPLATE-V1',
  templateName: 'Custom Report Template',
  templateVersion: '1.0',
  standard: { type: 'EN 15978', region: 'Pan-European' },
  metadata: { description: 'Custom template', category: 'Carbon Assessment', languages: ['en'] },
  sections: [
    {
      sectionId: '1',
      sectionName: 'Executive Summary',
      required: true,
      fields: [
        { fieldId: '1.1', fieldName: 'projectName', label: 'Project Name', type: 'text', required: true },
        { fieldId: '1.2', fieldName: 'totalCarbon', label: 'Total Carbon (kg CO2e)', type: 'number', required: true },
      ],
    },
  ],
};

export function TemplateEditorPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ReportTemplate | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [createMode, setCreateMode] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    setLoading(true);
    const { data, error } = await supabase
      .from('report_templates')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading templates:', error);
      setTemplates([]);
    } else {
      setTemplates((data as ReportTemplate[]) || []);
    }
    setLoading(false);
  }

  function selectTemplate(t: ReportTemplate) {
    setSelected(t);
    setCreateMode(false);
    setJsonText(JSON.stringify(t.config, null, 2));
    setSaveError(null);
  }

  function startCreate() {
    setSelected(null);
    setCreateMode(true);
    const defaultCopy = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE));
    defaultCopy.templateId = `CUSTOM-${Date.now().toString(36).toUpperCase()}-V1`;
    setJsonText(JSON.stringify(defaultCopy, null, 2));
    setSaveError(null);
  }

  async function handleSave() {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setSaveError('Invalid JSON');
      return;
    }

    const templateId = parsed.templateId as string;
    const templateName = (parsed.templateName as string) || 'Untitled';
    const templateVersion = (parsed.templateVersion as string) || '1.0';

    if (!templateId || typeof templateId !== 'string') {
      setSaveError('templateId is required');
      return;
    }

    setSaving(true);
    setSaveError(null);

    if (createMode) {
      const { error } = await supabase.from('report_templates').insert({
        template_id: templateId,
        template_name: templateName,
        template_version: templateVersion,
        config: parsed,
      });

      if (error) {
        setSaveError(error.message);
        setSaving(false);
        return;
      }
      setCreateMode(false);
      const { data: created } = await supabase.from('report_templates').select('*').eq('template_id', templateId).single();
      if (created) setSelected(created as ReportTemplate);
      loadTemplates();
    } else if (selected) {
      const { error } = await supabase
        .from('report_templates')
        .update({ template_id: templateId, template_name: templateName, template_version: templateVersion, config: parsed, updated_at: new Date().toISOString() })
        .eq('id', selected.id);

      if (error) {
        setSaveError(error.message);
        setSaving(false);
        return;
      }
      loadTemplates();
      const updated = templates.find(t => t.id === selected.id);
      if (updated) setSelected({ ...updated, config: parsed });
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!selected || !confirm('Delete this template?')) return;
    const { error } = await supabase.from('report_templates').delete().eq('id', selected.id);
    if (error) {
      setSaveError(error.message);
      return;
    }
    setSelected(null);
    setCreateMode(false);
    loadTemplates();
    setJsonText('');
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Report Template Editor</h1>
          <p className="text-fg-muted mt-1">Create and edit Firehorse report templates (EN 15978, RT Card, etc.)</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={startCreate} className="btn-primary">
            + New Template
          </button>
          <button type="button" onClick={() => navigate('/reports')} className="btn-secondary">
            ← Reports
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="card p-4">
            <h2 className="font-semibold text-foreground mb-3">Your Templates</h2>
            {loading ? (
              <div className="text-fg-muted">Loading...</div>
            ) : templates.length === 0 && !createMode ? (
              <p className="text-fg-muted text-sm">No custom templates yet. Create one to get started.</p>
            ) : (
              <ul className="space-y-1">
                {templates.map(t => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => selectTemplate(t)}
                      className={`w-full text-left px-3 py-2 rounded text-sm ${selected?.id === t.id ? 'bg-primary-100 text-primary-800' : 'hover:bg-border'}`}
                    >
                      {t.template_name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="col-span-8">
          <div className="card p-4">
            {(selected || createMode) ? (
              <>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold text-foreground">{createMode ? 'New Template' : selected?.template_name}</h2>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleSave} disabled={saving} className="btn-primary">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    {!createMode && selected && (
                      <button type="button" onClick={handleDelete} className="text-red-600 hover:underline text-sm">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                {saveError && <p className="text-red-600 text-sm mb-2">{saveError}</p>}
                <textarea
                  value={jsonText}
                  onChange={e => setJsonText(e.target.value)}
                  className="w-full h-96 font-mono text-sm p-3 border border-border rounded bg-background"
                  placeholder="Template JSON config..."
                  spellCheck={false}
                />
                <p className="text-xs text-fg-muted mt-2">
                  Follow Firehorse template schema. See Firehorse/templates/template_config.schema.json for reference.
                </p>
              </>
            ) : (
              <div className="text-fg-muted py-12 text-center">
                Select a template or create a new one.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
