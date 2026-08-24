import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { nordicColors, spacing, shadows } from '../theme/nordicTheme';

export default function OmnichannelScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={[styles.card, styles.headerCard]}>
        <Card.Content>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Firehorse Omnichannel</Text>
              <Text style={styles.headerSubtitle}>Sales & Outreach Pipeline</Text>
            </View>
            <Icon name="bullhorn" size={36} color={nordicColors.white} />
          </View>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>147</Text>
              <Text style={styles.statLabel}>Active Leads</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>23</Text>
              <Text style={styles.statLabel}>Meetings</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>68%</Text>
              <Text style={styles.statLabel}>Open Rate</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Pipeline Overview */}
      <Text style={styles.sectionTitle}>SALES PIPELINE</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.pipelineItem}>
            <View style={styles.pipelineHeader}>
              <Text style={styles.pipelineName}>New Contacts</Text>
              <Text style={styles.pipelineCount}>42</Text>
            </View>
            <ProgressBar progress={0.42} color={nordicColors.primary} style={styles.pipelineBar} />
          </View>

          <View style={styles.divider} />

          <View style={styles.pipelineItem}>
            <View style={styles.pipelineHeader}>
              <Text style={styles.pipelineName}>Cold 1 Sent</Text>
              <Text style={styles.pipelineCount}>35</Text>
            </View>
            <ProgressBar progress={0.35} color={nordicColors.secondary} style={styles.pipelineBar} />
          </View>

          <View style={styles.divider} />

          <View style={styles.pipelineItem}>
            <View style={styles.pipelineHeader}>
              <Text style={styles.pipelineName}>Engaged</Text>
              <Text style={styles.pipelineCount}>28</Text>
            </View>
            <ProgressBar progress={0.28} color={nordicColors.success} style={styles.pipelineBar} />
          </View>

          <View style={styles.divider} />

          <View style={styles.pipelineItem}>
            <View style={styles.pipelineHeader}>
              <Text style={styles.pipelineName}>Meeting Booked</Text>
              <Text style={styles.pipelineCount}>23</Text>
            </View>
            <ProgressBar progress={0.23} color={nordicColors.accent} style={styles.pipelineBar} />
          </View>
        </Card.Content>
      </Card>

      {/* Channel Performance */}
      <Text style={styles.sectionTitle}>CHANNEL PERFORMANCE</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.channelItem}>
            <View style={[styles.channelIcon, { backgroundColor: nordicColors.primary }]}>
              <Icon name="email" size={24} color={nordicColors.white} />
            </View>
            <View style={styles.channelContent}>
              <Text style={styles.channelTitle}>Email Campaigns</Text>
              <Text style={styles.channelSubtitle}>68% open rate, 12% click rate</Text>
            </View>
            <Chip
              mode="flat"
              style={[styles.chip, { backgroundColor: nordicColors.success + '20' }]}
              textStyle={{ color: nordicColors.success, fontSize: 11, fontWeight: '700' }}
            >
              Active
            </Chip>
          </View>

          <View style={styles.divider} />

          <View style={styles.channelItem}>
            <View style={[styles.channelIcon, { backgroundColor: '#0077B5' }]}>
              <Icon name="linkedin" size={24} color={nordicColors.white} />
            </View>
            <View style={styles.channelContent}>
              <Text style={styles.channelTitle}>LinkedIn Outreach</Text>
              <Text style={styles.channelSubtitle}>45% acceptance, 22% reply</Text>
            </View>
            <Chip
              mode="flat"
              style={[styles.chip, { backgroundColor: nordicColors.success + '20' }]}
              textStyle={{ color: nordicColors.success, fontSize: 11, fontWeight: '700' }}
            >
              Active
            </Chip>
          </View>

          <View style={styles.divider} />

          <View style={styles.channelItem}>
            <View style={[styles.channelIcon, { backgroundColor: nordicColors.secondary }]}>
              <Icon name="phone" size={24} color={nordicColors.white} />
            </View>
            <View style={styles.channelContent}>
              <Text style={styles.channelTitle}>Direct Calls</Text>
              <Text style={styles.channelSubtitle}>15 calls/day, 30% connect</Text>
            </View>
            <Chip
              mode="flat"
              style={[styles.chip, { backgroundColor: nordicColors.warning + '20' }]}
              textStyle={{ color: nordicColors.warning, fontSize: 11, fontWeight: '700' }}
            >
              Paused
            </Chip>
          </View>
        </Card.Content>
      </Card>

      {/* Audience Segments */}
      <Text style={styles.sectionTitle}>AUDIENCE SEGMENTS</Text>

      <View style={styles.segmentGrid}>
        <TouchableOpacity style={[styles.segmentCard, { backgroundColor: nordicColors.primary }]}>
          <Icon name="briefcase" size={28} color={nordicColors.white} />
          <Text style={styles.segmentTitle}>Investors</Text>
          <Text style={styles.segmentCount}>34 contacts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.segmentCard, { backgroundColor: nordicColors.secondary }]}>
          <Icon name="domain" size={28} color={nordicColors.white} />
          <Text style={styles.segmentTitle}>Customers</Text>
          <Text style={styles.segmentCount}>68 contacts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.segmentCard, { backgroundColor: nordicColors.success }]}>
          <Icon name="handshake" size={28} color={nordicColors.white} />
          <Text style={styles.segmentTitle}>Partners</Text>
          <Text style={styles.segmentCount}>25 contacts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.segmentCard, { backgroundColor: nordicColors.warning }]}>
          <Icon name="share-variant" size={28} color={nordicColors.white} />
          <Text style={styles.segmentTitle}>Social</Text>
          <Text style={styles.segmentCount}>20 contacts</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Tasks */}
      <Text style={styles.sectionTitle}>TODAY'S OUTREACH</Text>

      <Card style={[styles.card, styles.taskCard]}>
        <Card.Content>
          <View style={styles.taskItem}>
            <Icon name="checkbox-blank-circle-outline" size={24} color={nordicColors.primary} />
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>Send 20 Cold 1 emails</Text>
              <Text style={styles.taskSubtitle}>Daily capacity: 12/20 sent</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.taskItem}>
            <Icon name="check-circle" size={24} color={nordicColors.success} />
            <View style={styles.taskContent}>
              <Text style={[styles.taskTitle, styles.taskDone]}>Follow up Cold 2 (3-day)</Text>
              <Text style={styles.taskSubtitle}>8 follow-ups sent</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.taskItem}>
            <Icon name="checkbox-blank-circle-outline" size={24} color={nordicColors.primary} />
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>Review 5 meeting requests</Text>
              <Text style={styles.taskSubtitle}>3 pending confirmation</Text>
            </View>
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
    backgroundColor: nordicColors.primary,
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
  pipelineItem: {
    marginBottom: spacing.sm,
  },
  pipelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  pipelineName: {
    fontSize: 14,
    fontWeight: '600',
    color: nordicColors.text,
  },
  pipelineCount: {
    fontSize: 14,
    fontWeight: '700',
    color: nordicColors.primary,
  },
  pipelineBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: nordicColors.surfaceVariant,
  },
  divider: {
    height: 1,
    backgroundColor: nordicColors.borderLight,
    marginVertical: spacing.sm,
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  channelIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  channelTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: nordicColors.text,
  },
  channelSubtitle: {
    fontSize: 13,
    color: nordicColors.textSecondary,
    marginTop: 2,
  },
  chip: {
    height: 28,
  },
  segmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  segmentCard: {
    width: '47%',
    margin: '1.5%',
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    ...shadows.medium,
  },
  segmentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: nordicColors.white,
    marginTop: spacing.sm,
  },
  segmentCount: {
    fontSize: 11,
    color: nordicColors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  taskCard: {
    borderLeftWidth: 4,
    borderLeftColor: nordicColors.primary,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  taskContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: nordicColors.text,
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: nordicColors.textSecondary,
  },
  taskSubtitle: {
    fontSize: 13,
    color: nordicColors.textSecondary,
    marginTop: 2,
  },
});
