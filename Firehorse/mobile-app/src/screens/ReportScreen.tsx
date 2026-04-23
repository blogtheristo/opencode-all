import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { nordicColors, spacing, shadows } from '../theme/nordicTheme';

export default function ReportScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={[styles.card, styles.headerCard]}>
        <Card.Content>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Firehorse Report</Text>
              <Text style={styles.headerSubtitle}>Analytics & Report Engine</Text>
            </View>
            <Icon name="file-chart" size={36} color={nordicColors.white} />
          </View>
        </Card.Content>
      </Card>

      {/* Daily Summary */}
      <Text style={styles.sectionTitle}>TODAY'S SUMMARY</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.metricGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>20</Text>
              <Text style={styles.metricLabel}>Emails Sent</Text>
              <View style={[styles.metricDot, { backgroundColor: nordicColors.success }]} />
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>14</Text>
              <Text style={styles.metricLabel}>Delivered</Text>
              <View style={[styles.metricDot, { backgroundColor: nordicColors.success }]} />
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>9</Text>
              <Text style={styles.metricLabel}>Opened</Text>
              <View style={[styles.metricDot, { backgroundColor: nordicColors.primary }]} />
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>3</Text>
              <Text style={styles.metricLabel}>Replied</Text>
              <View style={[styles.metricDot, { backgroundColor: nordicColors.accent }]} />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Campaign Performance */}
      <Text style={styles.sectionTitle}>CAMPAIGN PERFORMANCE</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.campaignItem}>
            <View style={styles.campaignHeader}>
              <Text style={styles.campaignName}>Investor Outreach Q1</Text>
              <Text style={[styles.campaignRate, { color: nordicColors.success }]}>68%</Text>
            </View>
            <ProgressBar progress={0.68} color={nordicColors.success} style={styles.campaignBar} />
            <Text style={styles.campaignSubtitle}>Open rate | 142 sent, 97 opened</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.campaignItem}>
            <View style={styles.campaignHeader}>
              <Text style={styles.campaignName}>Customer Acquisition</Text>
              <Text style={[styles.campaignRate, { color: nordicColors.primary }]}>52%</Text>
            </View>
            <ProgressBar progress={0.52} color={nordicColors.primary} style={styles.campaignBar} />
            <Text style={styles.campaignSubtitle}>Open rate | 89 sent, 46 opened</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.campaignItem}>
            <View style={styles.campaignHeader}>
              <Text style={styles.campaignName}>Partner Onboarding</Text>
              <Text style={[styles.campaignRate, { color: nordicColors.success }]}>74%</Text>
            </View>
            <ProgressBar progress={0.74} color={nordicColors.success} style={styles.campaignBar} />
            <Text style={styles.campaignSubtitle}>Open rate | 35 sent, 26 opened</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Conversion Funnel */}
      <Text style={styles.sectionTitle}>CONVERSION FUNNEL</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.funnelItem}>
            <View style={[styles.funnelBar, { width: '100%', backgroundColor: nordicColors.primary }]}>
              <Text style={styles.funnelText}>Contacts: 500</Text>
            </View>
          </View>
          <View style={styles.funnelItem}>
            <View style={[styles.funnelBar, { width: '60%', backgroundColor: nordicColors.primaryLight }]}>
              <Text style={styles.funnelText}>Engaged: 300</Text>
            </View>
          </View>
          <View style={styles.funnelItem}>
            <View style={[styles.funnelBar, { width: '30%', backgroundColor: nordicColors.secondary }]}>
              <Text style={styles.funnelText}>Meetings: 150</Text>
            </View>
          </View>
          <View style={styles.funnelItem}>
            <View style={[styles.funnelBar, { width: '15%', backgroundColor: nordicColors.success }]}>
              <Text style={styles.funnelText}>Won: 75</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Report Types */}
      <Text style={styles.sectionTitle}>GENERATE REPORTS</Text>

      <Card style={styles.card}>
        <Card.Content>
          <TouchableOpacity style={styles.reportItem}>
            <View style={[styles.reportIcon, { backgroundColor: nordicColors.primary }]}>
              <Icon name="calendar-today" size={24} color={nordicColors.white} />
            </View>
            <View style={styles.reportContent}>
              <Text style={styles.reportTitle}>Daily Report</Text>
              <Text style={styles.reportSubtitle}>Email performance, delivery stats</Text>
            </View>
            <Icon name="download" size={24} color={nordicColors.primary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.reportItem}>
            <View style={[styles.reportIcon, { backgroundColor: nordicColors.secondary }]}>
              <Icon name="calendar-week" size={24} color={nordicColors.white} />
            </View>
            <View style={styles.reportContent}>
              <Text style={styles.reportTitle}>Weekly Summary</Text>
              <Text style={styles.reportSubtitle}>Campaign trends, top templates</Text>
            </View>
            <Icon name="download" size={24} color={nordicColors.primary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.reportItem}>
            <View style={[styles.reportIcon, { backgroundColor: nordicColors.success }]}>
              <Icon name="calendar-month" size={24} color={nordicColors.white} />
            </View>
            <View style={styles.reportContent}>
              <Text style={styles.reportTitle}>Monthly Analytics</Text>
              <Text style={styles.reportSubtitle}>ROI, health metrics, pipeline</Text>
            </View>
            <Icon name="download" size={24} color={nordicColors.primary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.reportItem}>
            <View style={[styles.reportIcon, { backgroundColor: nordicColors.accent }]}>
              <Icon name="leaf" size={24} color={nordicColors.text} />
            </View>
            <View style={styles.reportContent}>
              <Text style={styles.reportTitle}>Sustainability Report</Text>
              <Text style={styles.reportSubtitle}>EN 15978, CSRD, Fit for 55</Text>
            </View>
            <Icon name="download" size={24} color={nordicColors.primary} />
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Export Options */}
      <View style={styles.exportContainer}>
        <Button
          mode="contained"
          style={styles.exportButton}
          contentStyle={styles.exportButtonContent}
          labelStyle={styles.exportButtonLabel}
          buttonColor={nordicColors.primary}
          icon="file-pdf-box"
        >
          Export PDF
        </Button>
        <Button
          mode="outlined"
          style={styles.exportButton}
          contentStyle={styles.exportButtonContent}
          labelStyle={styles.exportOutlineLabel}
          textColor={nordicColors.primary}
          icon="file-excel"
        >
          Export CSV
        </Button>
      </View>

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
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: nordicColors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    letterSpacing: 1,
  },
  metricGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.sm,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: nordicColors.text,
  },
  metricLabel: {
    fontSize: 11,
    color: nordicColors.textSecondary,
    marginTop: spacing.xs,
  },
  metricDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: spacing.xs,
  },
  campaignItem: {
    marginBottom: spacing.xs,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  campaignName: {
    fontSize: 14,
    fontWeight: '600',
    color: nordicColors.text,
  },
  campaignRate: {
    fontSize: 14,
    fontWeight: '700',
  },
  campaignBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: nordicColors.surfaceVariant,
  },
  campaignSubtitle: {
    fontSize: 11,
    color: nordicColors.textSecondary,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: nordicColors.borderLight,
    marginVertical: spacing.sm,
  },
  funnelItem: {
    marginBottom: spacing.sm,
  },
  funnelBar: {
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  funnelText: {
    fontSize: 12,
    fontWeight: '700',
    color: nordicColors.white,
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  reportTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: nordicColors.text,
  },
  reportSubtitle: {
    fontSize: 13,
    color: nordicColors.textSecondary,
    marginTop: 2,
  },
  exportContainer: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  exportButton: {
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  exportButtonContent: {
    height: 50,
  },
  exportButtonLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  exportOutlineLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
});
