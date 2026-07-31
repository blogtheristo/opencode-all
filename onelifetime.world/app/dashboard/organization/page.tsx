'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/auth';

interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  plan_tier: 'free' | 'starter' | 'professional' | 'enterprise';
  status: string;
}

interface Member {
  id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: string;
  joined_at: string;
  user_profiles: {
    email: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  expires_at: string;
  created_at: string;
}

export default function OrganizationPage() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [userRole, setUserRole] = useState<string>('member');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Invite form
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  
  const supabase = createBrowserClient();

  useEffect(() => {
    loadOrganizationData();
  }, []);

  async function loadOrganizationData() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Get user's organization membership
      const { data: membershipData } = await supabase
        .from('organization_members')
        .select(`
          role,
          organizations (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
      
      if (membershipData?.organizations) {
        setOrganization(membershipData.organizations as Organization);
        setUserRole(membershipData.role);
        
        // Get all members
        const { data: membersData } = await supabase
          .from('organization_members')
          .select(`
            id,
            user_id,
            role,
            status,
            joined_at,
            user_profiles (
              email,
              first_name,
              last_name,
              avatar_url
            )
          `)
          .eq('organization_id', (membershipData.organizations as Organization).id)
          .eq('status', 'active');
        
        if (membersData) {
          setMembers(membersData as Member[]);
        }
        
        // Get pending invitations (if admin/owner)
        if (['owner', 'admin'].includes(membershipData.role)) {
          const { data: invitationsData } = await supabase
            .from('organization_invitations')
            .select('*')
            .eq('organization_id', (membershipData.organizations as Organization).id)
            .is('accepted_at', null)
            .gte('expires_at', new Date().toISOString());
          
          if (invitationsData) {
            setInvitations(invitationsData);
          }
        }
      }
    }
    
    setLoading(false);
  }

  async function handleUpdateOrganization(e: React.FormEvent) {
    e.preventDefault();
    if (!organization) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          name: organization.name,
          description: organization.description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', organization.id);
      
      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Organization updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update organization' });
    } finally {
      setSaving(false);
    }
  }

  async function handleInviteMember(e: React.FormEvent) {
    e.preventDefault();
    if (!organization) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Generate invitation token
      const token = crypto.randomUUID();
      
      const { error } = await supabase
        .from('organization_invitations')
        .insert({
          organization_id: organization.id,
          email: inviteEmail,
          role: inviteRole,
          token: token,
          invited_by: user?.id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        });
      
      if (error) throw error;

      // Send invitation email via backend API
      try {
        await fetch('/api/organization/invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: inviteEmail,
            role: inviteRole,
            token,
            organizationId: organization.id,
            organizationName: organization.name,
          }),
        });
      } catch (emailErr) {
        console.warn('Invitation email could not be sent:', emailErr);
      }

      setMessage({ type: 'success', text: `Invitation sent to ${inviteEmail}` });
      setInviteEmail('');
      setShowInviteForm(false);
      loadOrganizationData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to send invitation' });
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateMemberRole(memberId: string, newRole: string) {
    try {
      const { error } = await supabase
        .from('organization_members')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', memberId);
      
      if (error) throw error;
      
      setMembers(prev => prev.map(m => 
        m.id === memberId ? { ...m, role: newRole as Member['role'] } : m
      ));
      setMessage({ type: 'success', text: 'Member role updated' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update role' });
    }
  }

  async function handleRemoveMember(memberId: string) {
    if (!confirm('Are you sure you want to remove this member?')) return;
    
    try {
      const { error } = await supabase
        .from('organization_members')
        .update({ status: 'removed', updated_at: new Date().toISOString() })
        .eq('id', memberId);
      
      if (error) throw error;
      
      setMembers(prev => prev.filter(m => m.id !== memberId));
      setMessage({ type: 'success', text: 'Member removed' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to remove member' });
    }
  }

  async function handleCancelInvitation(invitationId: string) {
    try {
      const { error } = await supabase
        .from('organization_invitations')
        .delete()
        .eq('id', invitationId);
      
      if (error) throw error;
      
      setInvitations(prev => prev.filter(i => i.id !== invitationId));
      setMessage({ type: 'success', text: 'Invitation cancelled' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to cancel invitation' });
    }
  }

  const isAdmin = ['owner', 'admin'].includes(userRole);

  const planColors: Record<string, string> = {
    free: 'bg-slate-500/20 text-slate-300',
    starter: 'bg-green-500/20 text-green-400',
    professional: 'bg-purple-500/20 text-purple-400',
    enterprise: 'bg-amber-500/20 text-amber-400',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="animate-fadeIn">
        <div className="card p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">No Organization</h2>
          <p className="text-slate-400 mb-6">
            You&apos;re not part of any organization yet.
          </p>
          <button className="btn-primary px-6 py-2">
            Create Organization
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Organization Settings</h1>
        <p className="text-slate-400">Manage your organization and team members</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Organization Info */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Organization Details</h2>
            <p className="text-slate-400 text-sm">Basic information about your organization</p>
          </div>
          <span className={`badge ${planColors[organization.plan_tier] || planColors.free}`}>
            {organization.plan_tier.charAt(0).toUpperCase() + organization.plan_tier.slice(1)} Plan
          </span>
        </div>

        <form onSubmit={handleUpdateOrganization} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Organization Name
            </label>
            <input
              type="text"
              value={organization.name}
              onChange={(e) => setOrganization(prev => prev ? { ...prev, name: e.target.value } : null)}
              className="input w-full"
              disabled={!isAdmin}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              URL Slug
            </label>
            <input
              type="text"
              value={organization.slug}
              className="input w-full opacity-60"
              disabled
            />
            <p className="text-xs text-slate-500 mt-1">Contact support to change your URL</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={organization.description || ''}
              onChange={(e) => setOrganization(prev => prev ? { ...prev, description: e.target.value } : null)}
              className="input w-full h-24 resize-none"
              disabled={!isAdmin}
              placeholder="Brief description of your organization"
            />
          </div>
          
          {isAdmin && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary px-6 py-2 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Team Members */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Team Members</h2>
            <p className="text-slate-400 text-sm">{members.length} member{members.length !== 1 ? 's' : ''}</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowInviteForm(true)}
              className="btn-primary px-4 py-2"
            >
              Invite Member
            </button>
          )}
        </div>

        {/* Invite Form */}
        {showInviteForm && (
          <form onSubmit={handleInviteMember} className="mb-6 p-4 bg-slate-800/50 rounded-lg">
            <h3 className="font-medium text-white mb-4">Invite New Member</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="input w-full"
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="input w-full"
                >
                  <option value="viewer">Viewer</option>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowInviteForm(false)}
                className="btn-secondary px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary px-4 py-2 disabled:opacity-50"
              >
                {saving ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </form>
        )}

        {/* Members List */}
        <div className="space-y-3">
          {members.map(member => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                {member.user_profiles?.avatar_url ? (
                  <img 
                    src={member.user_profiles.avatar_url}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-semibold">
                    {member.user_profiles?.first_name?.charAt(0) || member.user_profiles?.email?.charAt(0) || '?'}
                  </div>
                )}
                <div>
                  <p className="text-white font-medium">
                    {member.user_profiles?.first_name 
                      ? `${member.user_profiles.first_name} ${member.user_profiles.last_name || ''}`
                      : member.user_profiles?.email}
                  </p>
                  <p className="text-slate-400 text-sm">{member.user_profiles?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isAdmin && member.role !== 'owner' ? (
                  <>
                    <select
                      value={member.role}
                      onChange={(e) => handleUpdateMemberRole(member.id, e.target.value)}
                      className="input py-1 px-2 text-sm"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-red-400 text-sm hover:text-red-300"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <span className={`badge ${
                    member.role === 'owner' ? 'badge-warning' :
                    member.role === 'admin' ? 'badge-info' : 'badge-success'
                  }`}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Invitations */}
      {isAdmin && invitations.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Pending Invitations</h2>
          <div className="space-y-3">
            {invitations.map(invitation => (
              <div key={invitation.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="text-white">{invitation.email}</p>
                  <p className="text-slate-400 text-sm">
                    Invited as {invitation.role} • Expires {new Date(invitation.expires_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleCancelInvitation(invitation.id)}
                  className="text-red-400 text-sm hover:text-red-300"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
