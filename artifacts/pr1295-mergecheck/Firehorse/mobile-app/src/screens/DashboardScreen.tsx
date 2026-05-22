import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { nordicColors, spacing, shadows } from '../theme/nordicTheme';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Card style={[styles.card, styles.headerCard]}>
        <Card.Content>
          <Text style={styles.headerTitle}>DWS IQ 6 Dashboard</Text>
          <Text style={styles.headerSubtitle}>Real-time Project Intelligence</Text>
        </Card.Content>
      </Card>

      {/* KPIs */}
      <Text style={styles.sectionTitle}>KEY PERFORMANCE INDICATORS</Text>

      <View style={styles.kpiGrid}>
        <Card style={[styles.kpiCard, { backgroundColor: nordicColors.primary }]}>
          <Card.Content>
            <Icon name="chart-line" size={32} color={nordicColors.white} />
            <Text style={styles.kpiValue}>1.05</Text>
            <Text style={styles.kpiLabel}>SPI</Text>
          </Card.Content>
        </Card>

        <Card style={[styles.kpiCard, { backgroundColor: nordicColors.success }]}>
          <Card.Content>
            <Icon name="currency-eur" size={32} color={nordicColors.white} />
            <Text style={styles.kpiValue}>0.98</Text>
            <Text style={styles.kpiLabel}>CPI</Text>
          </Card.Content>
        </Card>

        <Card style={[styles.kpiCard, { backgroundColor: nordicColors.secondary }]}>
          <Card.Content>
            <Icon name="folder-multiple" size={32} color={nordicColors.white} />
            <Text style={styles.kpiValue}>24</Text>
            <Text style={styles.kpiLabel}>Active Projects</Text>
          </Card.Content>
        </Card>

        <Card style={[styles.kpiCard, { backgroundColor: nordicColors.warning }]}>
          <Card.Content>
            <Icon name="alert-circle" size={32} color={nordicColors.white} />
            <Text style={styles.kpiValue}>3</Text>
            <Text style={styles.kpiLabel}>At Risk</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Projects */}
      <Text style={styles.sectionTitle}>ACTIVE PROJECTS</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.projectItem}>
            <View style={styles.projectHeader}>
              <Text style={styles.projectName}>Helsingin Asuinkerrostalo</Text>
              <View style={[styles.ragBadge, { backgroundColor: nordicColors.success }]}>
                <Text style={styles.ragText}>G</Text>
              </View>
            </View>
            <View style={styles.projectStats}>
              <View style={styles.projectStat}>
                <Text style={styles.projectStatLabel}>Progress</Text>
                <Text style={styles.projectStatValue}>67%</Text>
              </View>
              <View style={styles.projectStat}>
                <Text style={styles.projectStatLabel}>SPI</Text>
                <Text style={styles.projectStatValue}>1.05</Text>
              </View>
              <View style={styles.projectStat}>
                <Text style={styles.projectStatLabel}>CPI</Text>
                <Text style={styles.projectStatValue}>0.98</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.projectItem}>
            <View style={styles.projectHeader}>
              <Text style={styles.projectName}>Tampereen Toimistotalo</Text>
              <View style={[styles.ragBadge, { backgroundColor: nordicColors.warning }]}>
                <Text style={styles.ragText}>A</Text>
              </View>
            </View>
            <View style={styles.projectStats}>
              <View style={styles.projectStat}>
                <Text style={styles.projectStatLabel}>Progress</Text>
                <Text style={styles.projectStatValue}>45%</Text>
              </View>
              <View style={styles.projectStat}>
                <Text style={styles.projectStatLabel}>SPI</Text>
                <Text style={styles.projectStatValue}>0.92</Text>
              </View>
              <View style={styles.projectStat}>
                <Text style={styles.projectStatLabel}>CPI</Text>
                <Text style={styles.projectStatValue}>1.03</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.projectItem}>
            <View style={styles.projectHeader}>
              <Text style={styles.projectName}>Oulun Kauppakeskus</Text>
              <View style={[styles.ragBadge, { backgroundColor: nordicColors.error }]}>
                <Text style={styles.ragText}>R</Text>
              </View>
            </View>
            <View style={styles.projectStats}>
              <View style={styles.projectStat}>
                <Text style={styles.projectStatLabel}>Progress</Text>
                <Text style={styles.projectStatValue}>23%</Text>
              </View>
              <View style={styles.projectStat}>
                <Text style={styles.projectStatLabel}>SPI</Text>
                <Text style={styles.projectStatValue}>0.78</Text>
              </View>
              <View style={styles.projectStat}>
                <Text style={styles.projectStatLabel}>CPI</Text>
                <Text style={styles.projectStatValue}>0.85</Text>
              </View>
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
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  kpiCard: {
    width: '47%',
    margin: '1.5%',
    borderRadius: 12,
    ...shadows.medium,
  },
  kpiValue: {
    fontSize: 32,
    fontWeight: '700',
    color: nordicColors.white,
    marginTop: spacing.sm,
  },
  kpiLabel: {
    fontSize: 12,
    color: nordicColors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  projectItem: {
    paddingVertical: spacing.sm,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: nordicColors.text,
    flex: 1,
  },
  ragBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ragText: {
    fontSize: 16,
    fontWeight: '700',
    color: nordicColors.white,
  },
  projectStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  projectStat: {
    alignItems: 'center',
  },
  projectStatLabel: {
    fontSize: 11,
    color: nordicColors.textSecondary,
    marginBottom: spacing.xs,
  },
  projectStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: nordicColors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: nordicColors.borderLight,
    marginVertical: spacing.md,
  },
});
