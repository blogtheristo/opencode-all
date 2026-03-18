import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { nordicColors, spacing, shadows } from '../theme/nordicTheme';

export default function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      {/* Welcome Card */}
      <Card style={[styles.card, styles.welcomeCard]}>
        <Card.Content>
          <Text style={styles.welcomeTitle}>Tervetuloa Firehorse Mobile</Text>
          <Text style={styles.welcomeSubtitle}>Nordic Construction Management</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>70%</Text>
              <Text style={styles.statLabel}>Automaatio</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>35h</Text>
              <Text style={styles.statLabel}>Säästö/kk</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>540%</Text>
              <Text style={styles.statLabel}>ROI</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Firehorse Products */}
      <Text style={styles.sectionTitle}>FIREHORSE PRODUCTS</Text>

      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={[styles.actionCard, styles.actionPrimary]}
          onPress={() => navigation.navigate('Omnichannel')}
        >
          <Icon name="bullhorn" size={28} color={nordicColors.white} />
          <Text style={styles.actionTitle}>Omnichannel</Text>
          <Text style={styles.actionSubtitle}>Sales & CRM</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, styles.actionSecondary]}
          onPress={() => navigation.navigate('Automation')}
        >
          <Icon name="robot" size={28} color={nordicColors.white} />
          <Text style={styles.actionTitle}>Automation</Text>
          <Text style={styles.actionSubtitle}>Workflows</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, styles.actionSuccess]}
          onPress={() => navigation.navigate('Report')}
        >
          <Icon name="file-chart" size={28} color={nordicColors.white} />
          <Text style={styles.actionTitle}>Report</Text>
          <Text style={styles.actionSubtitle}>Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, styles.actionAccent]}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Icon name="chart-line" size={28} color={nordicColors.text} />
          <Text style={[styles.actionTitle, { color: nordicColors.text }]}>Dashboard</Text>
          <Text style={[styles.actionSubtitle, { color: nordicColors.textSecondary }]}>DWS IQ 6</Text>
        </TouchableOpacity>
      </View>

      {/* Field Operations */}
      <Text style={styles.sectionTitle}>FIELD OPERATIONS</Text>

      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={[styles.actionCard, styles.actionPrimary]}
          onPress={() => navigation.navigate('Diary')}
        >
          <Icon name="notebook-plus" size={28} color={nordicColors.white} />
          <Text style={styles.actionTitle}>Diary</Text>
          <Text style={styles.actionSubtitle}>RT 16-10660</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, styles.actionSecondary]}
          onPress={() => navigation.navigate('Inspection')}
        >
          <Icon name="clipboard-check" size={28} color={nordicColors.white} />
          <Text style={styles.actionTitle}>Inspection</Text>
          <Text style={styles.actionSubtitle}>BIM + AI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, styles.actionSuccess]}
          onPress={() => navigation.navigate('CarbonReport')}
        >
          <Icon name="leaf" size={28} color={nordicColors.white} />
          <Text style={styles.actionTitle}>Carbon Report</Text>
          <Text style={styles.actionSubtitle}>EN 15978</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: nordicColors.primaryDark }]}
          onPress={() => navigation.navigate('ControlRoom')}
        >
          <Icon name="monitor-dashboard" size={28} color={nordicColors.white} />
          <Text style={styles.actionTitle}>Control Room</Text>
          <Text style={styles.actionSubtitle}>Field Ops</Text>
        </TouchableOpacity>
      </View>

      {/* Command Center */}
      <Text style={styles.sectionTitle}>COMMAND CENTER</Text>

      <TouchableOpacity
        style={styles.situationBanner}
        onPress={() => navigation.navigate('SituationRoom')}
      >
        <Icon name="shield-crown" size={32} color={nordicColors.accent} />
        <View style={styles.situationContent}>
          <Text style={styles.situationTitle}>Situation Room</Text>
          <Text style={styles.situationSubtitle}>Strategic Command Center · Portfolio · Compliance</Text>
        </View>
        <Icon name="chevron-right" size={24} color={nordicColors.accent} />
      </TouchableOpacity>

      {/* Recent Activity */}
      <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: nordicColors.primaryLight }]}>
              <Icon name="notebook" size={20} color={nordicColors.white} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Työmaapäiväkirja</Text>
              <Text style={styles.activitySubtitle}>Helsingin Asuinkerrostalo</Text>
              <Text style={styles.activityTime}>2 tuntia sitten</Text>
            </View>
            <Icon name="chevron-right" size={24} color={nordicColors.textSecondary} />
          </View>

          <View style={styles.divider} />

          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: nordicColors.success }]}>
              <Icon name="leaf" size={20} color={nordicColors.white} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Carbon Report</Text>
              <Text style={styles.activitySubtitle}>Tampereen Toimistotalo</Text>
              <Text style={styles.activityTime}>Eilen 14:30</Text>
            </View>
            <Icon name="chevron-right" size={24} color={nordicColors.textSecondary} />
          </View>

          <View style={styles.divider} />

          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: nordicColors.secondary }]}>
              <Icon name="clipboard-check" size={20} color={nordicColors.white} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Vastaanottotarkastus</Text>
              <Text style={styles.activitySubtitle}>Oulun Kauppakeskus</Text>
              <Text style={styles.activityTime}>2 päivää sitten</Text>
            </View>
            <Icon name="chevron-right" size={24} color={nordicColors.textSecondary} />
          </View>
        </Card.Content>
      </Card>

      {/* Sync Status */}
      <Card style={[styles.card, styles.syncCard]}>
        <Card.Content>
          <View style={styles.syncHeader}>
            <Icon name="sync" size={24} color={nordicColors.success} />
            <Text style={styles.syncTitle}>Synkronointi valmis</Text>
          </View>
          <Text style={styles.syncSubtitle}>Kaikki tiedot tallennettu • 3 kohdetta synkronoitu</Text>
          <View style={styles.syncBadge}>
            <Icon name="check-circle" size={16} color={nordicColors.success} />
            <Text style={styles.syncBadgeText}>Online</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Nordic Footer */}
      <View style={styles.footer}>
        <View style={styles.flagsContainer}>
          <Text style={styles.flag}>🇸🇪</Text>
          <Text style={styles.flag}>🇳🇴</Text>
          <Text style={styles.flag}>🇫🇮</Text>
          <Text style={styles.flag}>🇩🇰</Text>
        </View>
        <Text style={styles.footerText}>Nordic Excellence in Construction</Text>
      </View>
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
  welcomeCard: {
    marginTop: spacing.md,
    backgroundColor: nordicColors.primary,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: nordicColors.white,
    marginBottom: spacing.xs,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: nordicColors.white,
    opacity: 0.9,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: nordicColors.accent,
  },
  statLabel: {
    fontSize: 12,
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
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  actionCard: {
    width: '47%',
    margin: '1.5%',
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    ...shadows.medium,
  },
  actionPrimary: {
    backgroundColor: nordicColors.primary,
  },
  actionSecondary: {
    backgroundColor: nordicColors.secondary,
  },
  actionSuccess: {
    backgroundColor: nordicColors.success,
  },
  actionAccent: {
    backgroundColor: nordicColors.accent,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: nordicColors.white,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 11,
    color: nordicColors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  situationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.lg,
    backgroundColor: nordicColors.primaryDark,
    borderRadius: 12,
    ...shadows.medium,
  },
  situationContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  situationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: nordicColors.white,
  },
  situationSubtitle: {
    fontSize: 12,
    color: nordicColors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: nordicColors.text,
  },
  activitySubtitle: {
    fontSize: 13,
    color: nordicColors.textSecondary,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 11,
    color: nordicColors.textDisabled,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: nordicColors.borderLight,
    marginVertical: spacing.sm,
  },
  syncCard: {
    borderLeftWidth: 4,
    borderLeftColor: nordicColors.success,
  },
  syncHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  syncTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: nordicColors.text,
    marginLeft: spacing.sm,
  },
  syncSubtitle: {
    fontSize: 13,
    color: nordicColors.textSecondary,
    marginBottom: spacing.sm,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: nordicColors.surfaceVariant,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  syncBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: nordicColors.success,
    marginLeft: 4,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  flagsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  flag: {
    fontSize: 32,
  },
  footerText: {
    fontSize: 13,
    color: nordicColors.textSecondary,
    fontWeight: '600',
  },
});
