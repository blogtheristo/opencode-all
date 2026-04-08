import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { nordicColors, spacing, shadows } from '../theme/nordicTheme';

export default function SituationRoomScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={[styles.card, styles.headerCard]}>
        <Card.Content>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Situation Room</Text>
              <Text style={styles.headerSubtitle}>Strategic Command Center</Text>
            </View>
            <Icon name="shield-crown" size={36} color={nordicColors.accent} />
          </View>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>92M</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>94%</Text>
              <Text style={styles.statLabel}>Compliance</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Portfolio Health */}
      <Text style={styles.sectionTitle}>PORTFOLIO HEALTH</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.healthRow}>
            <View style={styles.healthItem}>
              <View style={[styles.healthDot, { backgroundColor: nordicColors.success }]} />
              <Text style={styles.healthLabel}>On Track</Text>
              <Text style={styles.healthValue}>18</Text>
            </View>
            <View style={styles.healthItem}>
              <View style={[styles.healthDot, { backgroundColor: nordicColors.warning }]} />
              <Text style={styles.healthLabel}>At Risk</Text>
              <Text style={styles.healthValue}>4</Text>
            </View>
            <View style={styles.healthItem}>
              <View style={[styles.healthDot, { backgroundColor: nordicColors.error }]} />
              <Text style={styles.healthLabel}>Critical</Text>
              <Text style={styles.healthValue}>2</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.barRow}>
            <View style={[styles.barSegment, { flex: 18, backgroundColor: nordicColors.success }]} />
            <View style={[styles.barSegment, { flex: 4, backgroundColor: nordicColors.warning }]} />
            <View style={[styles.barSegment, { flex: 2, backgroundColor: nordicColors.error }]} />
          </View>
        </Card.Content>
      </Card>

      {/* Executive Views */}
      <Text style={styles.sectionTitle}>EXECUTIVE VIEWS</Text>

      <Card style={styles.card}>
        <Card.Content>
          <TouchableOpacity style={styles.viewItem}>
            <View style={[styles.viewIcon, { backgroundColor: nordicColors.primary }]}>
              <Icon name="account-supervisor" size={24} color={nordicColors.white} />
            </View>
            <View style={styles.viewContent}>
              <Text style={styles.viewTitle}>Manager Dashboard</Text>
              <Text style={styles.viewSubtitle}>Portfolio health, resource allocation</Text>
            </View>
            <Icon name="chevron-right" size={24} color={nordicColors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.viewItem}>
            <View style={[styles.viewIcon, { backgroundColor: nordicColors.secondary }]}>
              <Icon name="gavel" size={24} color={nordicColors.white} />
            </View>
            <View style={styles.viewContent}>
              <Text style={styles.viewTitle}>Board Overview</Text>
              <Text style={styles.viewSubtitle}>Governance, stakeholder value</Text>
            </View>
            <Icon name="chevron-right" size={24} color={nordicColors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.viewItem}>
            <View style={[styles.viewIcon, { backgroundColor: nordicColors.success }]}>
              <Icon name="chart-areaspline" size={24} color={nordicColors.white} />
            </View>
            <View style={styles.viewContent}>
              <Text style={styles.viewTitle}>Finance & CxO</Text>
              <Text style={styles.viewSubtitle}>P&L, cash flow, strategic execution</Text>
            </View>
            <Icon name="chevron-right" size={24} color={nordicColors.textSecondary} />
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Financial Summary */}
      <Text style={styles.sectionTitle}>FINANCIAL SUMMARY</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.finRow}>
            <View style={styles.finItem}>
              <Text style={styles.finLabel}>Revenue YTD</Text>
              <Text style={[styles.finValue, { color: nordicColors.success }]}>92.4M</Text>
            </View>
            <View style={styles.finItem}>
              <Text style={styles.finLabel}>Budget Var.</Text>
              <Text style={[styles.finValue, { color: nordicColors.success }]}>+2.1%</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.finRow}>
            <View style={styles.finItem}>
              <Text style={styles.finLabel}>EBITDA</Text>
              <Text style={[styles.finValue, { color: nordicColors.primary }]}>14.8M</Text>
            </View>
            <View style={styles.finItem}>
              <Text style={styles.finLabel}>Cash Flow</Text>
              <Text style={[styles.finValue, { color: nordicColors.success }]}>+5.2M</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Compliance Radar */}
      <Text style={styles.sectionTitle}>REGULATORY COMPLIANCE</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.complianceItem}>
            <View style={styles.complianceHeader}>
              <Text style={styles.complianceName}>Fit for 55</Text>
              <Text style={[styles.complianceScore, { color: nordicColors.success }]}>94%</Text>
            </View>
            <ProgressBar progress={0.94} color={nordicColors.success} style={styles.complianceBar} />
          </View>

          <View style={styles.divider} />

          <View style={styles.complianceItem}>
            <View style={styles.complianceHeader}>
              <Text style={styles.complianceName}>ETS Phase 4</Text>
              <Text style={[styles.complianceScore, { color: nordicColors.success }]}>91%</Text>
            </View>
            <ProgressBar progress={0.91} color={nordicColors.success} style={styles.complianceBar} />
          </View>

          <View style={styles.divider} />

          <View style={styles.complianceItem}>
            <View style={styles.complianceHeader}>
              <Text style={styles.complianceName}>CBAM Reporting</Text>
              <Text style={[styles.complianceScore, { color: nordicColors.warning }]}>78%</Text>
            </View>
            <ProgressBar progress={0.78} color={nordicColors.warning} style={styles.complianceBar} />
          </View>

          <View style={styles.divider} />

          <View style={styles.complianceItem}>
            <View style={styles.complianceHeader}>
              <Text style={styles.complianceName}>CSRD Disclosure</Text>
              <Text style={[styles.complianceScore, { color: nordicColors.success }]}>88%</Text>
            </View>
            <ProgressBar progress={0.88} color={nordicColors.success} style={styles.complianceBar} />
          </View>

          <View style={styles.divider} />

          <View style={styles.complianceItem}>
            <View style={styles.complianceHeader}>
              <Text style={styles.complianceName}>EU AI Act</Text>
              <Text style={[styles.complianceScore, { color: nordicColors.success }]}>85%</Text>
            </View>
            <ProgressBar progress={0.85} color={nordicColors.success} style={styles.complianceBar} />
          </View>
        </Card.Content>
      </Card>

      {/* Risk Heat Map */}
      <Text style={styles.sectionTitle}>RISK OVERVIEW</Text>

      <Card style={[styles.card, styles.riskCard]}>
        <Card.Content>
          <View style={styles.riskItem}>
            <Icon name="alert-circle" size={24} color={nordicColors.error} />
            <View style={styles.riskContent}>
              <Text style={styles.riskTitle}>Oulu Shopping Center - Schedule Delay</Text>
              <Text style={styles.riskSubtitle}>SPI 0.78 - 3 weeks behind schedule</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.riskItem}>
            <Icon name="alert" size={24} color={nordicColors.warning} />
            <View style={styles.riskContent}>
              <Text style={styles.riskTitle}>CBAM Reporting Gap</Text>
              <Text style={styles.riskSubtitle}>Steel imports require additional documentation</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.riskItem}>
            <Icon name="alert" size={24} color={nordicColors.warning} />
            <View style={styles.riskContent}>
              <Text style={styles.riskTitle}>Tampere - Cost Overrun Risk</Text>
              <Text style={styles.riskSubtitle}>Material price escalation +4.2%</Text>
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
    backgroundColor: nordicColors.primaryDark,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.sm,
  },
  healthItem: {
    alignItems: 'center',
  },
  healthDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: spacing.xs,
  },
  healthLabel: {
    fontSize: 12,
    color: nordicColors.textSecondary,
  },
  healthValue: {
    fontSize: 28,
    fontWeight: '700',
    color: nordicColors.text,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: nordicColors.borderLight,
    marginVertical: spacing.sm,
  },
  barRow: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barSegment: {
    height: '100%',
  },
  viewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  viewIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  viewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: nordicColors.text,
  },
  viewSubtitle: {
    fontSize: 13,
    color: nordicColors.textSecondary,
    marginTop: 2,
  },
  finRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.sm,
  },
  finItem: {
    alignItems: 'center',
    flex: 1,
  },
  finLabel: {
    fontSize: 12,
    color: nordicColors.textSecondary,
    marginBottom: spacing.xs,
  },
  finValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  complianceItem: {
    marginBottom: spacing.xs,
  },
  complianceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  complianceName: {
    fontSize: 14,
    fontWeight: '600',
    color: nordicColors.text,
  },
  complianceScore: {
    fontSize: 14,
    fontWeight: '700',
  },
  complianceBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: nordicColors.surfaceVariant,
  },
  riskCard: {
    borderLeftWidth: 4,
    borderLeftColor: nordicColors.warning,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  riskContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  riskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: nordicColors.text,
  },
  riskSubtitle: {
    fontSize: 12,
    color: nordicColors.textSecondary,
    marginTop: 2,
  },
});
