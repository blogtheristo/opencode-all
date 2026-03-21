import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, Switch } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { nordicColors, spacing, shadows } from '../theme/nordicTheme';

export default function AutomationScreen() {
  const [dailyOutreach, setDailyOutreach] = React.useState(true);
  const [followUp, setFollowUp] = React.useState(true);
  const [leadScoring, setLeadScoring] = React.useState(true);

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={[styles.card, styles.headerCard]}>
        <Card.Content>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Firehorse Automation</Text>
              <Text style={styles.headerSubtitle}>Campaign Workflows & Scheduling</Text>
            </View>
            <Icon name="robot" size={36} color={nordicColors.white} />
          </View>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Active Flows</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>847</Text>
              <Text style={styles.statLabel}>Actions/Week</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>99%</Text>
              <Text style={styles.statLabel}>Uptime</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Active Workflows */}
      <Text style={styles.sectionTitle}>ACTIVE WORKFLOWS</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.workflowItem}>
            <View style={styles.workflowLeft}>
              <Icon name="email-send" size={24} color={nordicColors.primary} />
              <View style={styles.workflowContent}>
                <Text style={styles.workflowTitle}>Daily Outreach</Text>
                <Text style={styles.workflowSubtitle}>20 emails/day, 08:00 trigger</Text>
              </View>
            </View>
            <Switch
              value={dailyOutreach}
              onValueChange={setDailyOutreach}
              color={nordicColors.success}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.workflowItem}>
            <View style={styles.workflowLeft}>
              <Icon name="email-check" size={24} color={nordicColors.secondary} />
              <View style={styles.workflowContent}>
                <Text style={styles.workflowTitle}>Follow-up Sequence</Text>
                <Text style={styles.workflowSubtitle}>Cold 1 → 2 → 3, every 6h</Text>
              </View>
            </View>
            <Switch
              value={followUp}
              onValueChange={setFollowUp}
              color={nordicColors.success}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.workflowItem}>
            <View style={styles.workflowLeft}>
              <Icon name="star-check" size={24} color={nordicColors.accent} />
              <View style={styles.workflowContent}>
                <Text style={styles.workflowTitle}>Lead Scoring</Text>
                <Text style={styles.workflowSubtitle}>AI-powered intent analysis</Text>
              </View>
            </View>
            <Switch
              value={leadScoring}
              onValueChange={setLeadScoring}
              color={nordicColors.success}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Lead State Machine */}
      <Text style={styles.sectionTitle}>LEAD STATE MACHINE</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.stateFlow}>
            <View style={[styles.stateItem, { backgroundColor: nordicColors.surfaceVariant }]}>
              <Text style={styles.stateText}>New</Text>
              <Text style={styles.stateCount}>42</Text>
            </View>
            <Icon name="arrow-right" size={16} color={nordicColors.textSecondary} />
            <View style={[styles.stateItem, { backgroundColor: nordicColors.primary + '20' }]}>
              <Text style={styles.stateText}>Cold 1</Text>
              <Text style={styles.stateCount}>35</Text>
            </View>
            <Icon name="arrow-right" size={16} color={nordicColors.textSecondary} />
            <View style={[styles.stateItem, { backgroundColor: nordicColors.secondary + '20' }]}>
              <Text style={styles.stateText}>Cold 2</Text>
              <Text style={styles.stateCount}>18</Text>
            </View>
            <Icon name="arrow-right" size={16} color={nordicColors.textSecondary} />
            <View style={[styles.stateItem, { backgroundColor: nordicColors.success + '20' }]}>
              <Text style={styles.stateText}>Engaged</Text>
              <Text style={styles.stateCount}>28</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.stateFlow}>
            <View style={[styles.stateItem, { backgroundColor: nordicColors.accent + '30' }]}>
              <Text style={styles.stateText}>Meeting</Text>
              <Text style={styles.stateCount}>23</Text>
            </View>
            <Icon name="arrow-right" size={16} color={nordicColors.textSecondary} />
            <View style={[styles.stateItem, { backgroundColor: nordicColors.success + '30' }]}>
              <Text style={styles.stateText}>Won</Text>
              <Text style={styles.stateCount}>12</Text>
            </View>
            <View style={{ width: spacing.md }} />
            <View style={[styles.stateItem, { backgroundColor: nordicColors.textSecondary + '20' }]}>
              <Text style={styles.stateText}>Parked</Text>
              <Text style={styles.stateCount}>15</Text>
            </View>
            <View style={{ width: spacing.md }} />
            <View style={[styles.stateItem, { backgroundColor: nordicColors.error + '20' }]}>
              <Text style={styles.stateText}>Lost</Text>
              <Text style={styles.stateCount}>8</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Scheduled Jobs */}
      <Text style={styles.sectionTitle}>SCHEDULED JOBS</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.jobItem}>
            <View style={[styles.jobIcon, { backgroundColor: nordicColors.success }]}>
              <Icon name="check" size={16} color={nordicColors.white} />
            </View>
            <View style={styles.jobContent}>
              <Text style={styles.jobTitle}>Daily new leads</Text>
              <Text style={styles.jobSubtitle}>08:00 | 30 contacts/day</Text>
            </View>
            <Chip
              mode="flat"
              style={[styles.chip, { backgroundColor: nordicColors.success + '20' }]}
              textStyle={{ color: nordicColors.success, fontSize: 10, fontWeight: '700' }}
            >
              Ran 2h ago
            </Chip>
          </View>

          <View style={styles.divider} />

          <View style={styles.jobItem}>
            <View style={[styles.jobIcon, { backgroundColor: nordicColors.success }]}>
              <Icon name="check" size={16} color={nordicColors.white} />
            </View>
            <View style={styles.jobContent}>
              <Text style={styles.jobTitle}>Follow-up processing</Text>
              <Text style={styles.jobSubtitle}>Every 6h | Next: 14:00</Text>
            </View>
            <Chip
              mode="flat"
              style={[styles.chip, { backgroundColor: nordicColors.primary + '20' }]}
              textStyle={{ color: nordicColors.primary, fontSize: 10, fontWeight: '700' }}
            >
              Queued
            </Chip>
          </View>

          <View style={styles.divider} />

          <View style={styles.jobItem}>
            <View style={[styles.jobIcon, { backgroundColor: nordicColors.success }]}>
              <Icon name="check" size={16} color={nordicColors.white} />
            </View>
            <View style={styles.jobContent}>
              <Text style={styles.jobTitle}>Daily report generation</Text>
              <Text style={styles.jobSubtitle}>18:00 | PDF + CSV export</Text>
            </View>
            <Chip
              mode="flat"
              style={[styles.chip, { backgroundColor: nordicColors.textSecondary + '20' }]}
              textStyle={{ color: nordicColors.textSecondary, fontSize: 10, fontWeight: '700' }}
            >
              Pending
            </Chip>
          </View>

          <View style={styles.divider} />

          <View style={styles.jobItem}>
            <View style={[styles.jobIcon, { backgroundColor: nordicColors.success }]}>
              <Icon name="check" size={16} color={nordicColors.white} />
            </View>
            <View style={styles.jobContent}>
              <Text style={styles.jobTitle}>Weekly summary</Text>
              <Text style={styles.jobSubtitle}>Monday 08:00 | Stakeholders</Text>
            </View>
            <Chip
              mode="flat"
              style={[styles.chip, { backgroundColor: nordicColors.textSecondary + '20' }]}
              textStyle={{ color: nordicColors.textSecondary, fontSize: 10, fontWeight: '700' }}
            >
              Sunday
            </Chip>
          </View>
        </Card.Content>
      </Card>

      {/* Webhook Events */}
      <Text style={styles.sectionTitle}>RECENT WEBHOOK EVENTS</Text>

      <Card style={[styles.card, styles.webhookCard]}>
        <Card.Content>
          <View style={styles.webhookItem}>
            <Icon name="email-open" size={20} color={nordicColors.success} />
            <Text style={styles.webhookText}>Email opened by investor@example.com</Text>
            <Text style={styles.webhookTime}>2m ago</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.webhookItem}>
            <Icon name="cursor-default-click" size={20} color={nordicColors.primary} />
            <Text style={styles.webhookText}>Link clicked - DWS IQ brochure</Text>
            <Text style={styles.webhookTime}>15m ago</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.webhookItem}>
            <Icon name="email-receive" size={20} color={nordicColors.accent} />
            <Text style={styles.webhookText}>Reply received - meeting request</Text>
            <Text style={styles.webhookTime}>1h ago</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: nordicColors.background,
  },
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: nordicColors.white,
    borderRadius: 12,
    ...shadows.medium,
  },
  headerCard: {
    marginTop: spacing.md,
    backgroundColor: nordicColors.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: nordicColors.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: nordicColors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: spacing.md,
    borderRadius: 8,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: nordicColors.accent,
  },
  statLabel: {
    fontSize: 11,
    color: nordicColors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: nordicColors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    letterSpacing: 1,
  },
  workflowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  workflowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workflowContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  workflowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: nordicColors.text,
  },
  workflowSubtitle: {
    fontSize: 13,
    color: nordicColors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: nordicColors.borderLight,
    marginVertical: spacing.sm,
  },
  stateFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  stateItem: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: 60,
  },
  stateText: {
    fontSize: 10,
    fontWeight: '700',
    color: nordicColors.text,
  },
  stateCount: {
    fontSize: 16,
    fontWeight: '700',
    color: nordicColors.text,
    marginTop: 2,
  },
  jobItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  jobIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: nordicColors.text,
  },
  jobSubtitle: {
    fontSize: 12,
    color: nordicColors.textSecondary,
    marginTop: 2,
  },
  chip: {
    height: 24,
  },
  webhookCard: {
    borderLeftWidth: 4,
    borderLeftColor: nordicColors.success,
  },
  webhookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  webhookText: {
    fontSize: 13,
    color: nordicColors.text,
    flex: 1,
    marginLeft: spacing.sm,
  },
  webhookTime: {
    fontSize: 11,
    color: nordicColors.textSecondary,
  },
});
