import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { nordicColors, spacing, shadows } from '../theme/nordicTheme';

export default function CarbonReportScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={[styles.card, styles.headerCard]}>
        <Card.Content>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>EN 15978 Carbon Report</Text>
              <Text style={styles.headerSubtitle}>Fit for 55 Compliance</Text>
            </View>
            <Icon name="leaf" size={40} color={nordicColors.white} />
          </View>

          <View style={styles.carbonBudget}>
            <View style={styles.budgetRow}>
              <Text style={styles.budgetLabel}>Hiilibudjetti</Text>
              <Text style={styles.budgetValue}>87%</Text>
            </View>
            <ProgressBar
              progress={0.87}
              color={nordicColors.warning}
              style={styles.progressBar}
            />
            <Text style={styles.budgetSubtitle}>
              1,740 / 2,000 kg CO₂e käytetty
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Real-time Alert */}
      <Card style={[styles.card, styles.alertCard]}>
        <Card.Content>
          <View style={styles.alertHeader}>
            <Icon name="alert" size={24} color={nordicColors.warning} />
            <Text style={styles.alertTitle}>Varoitus: 90% raja ylitetty!</Text>
          </View>
          <Text style={styles.alertText}>
            Hiilibudjetti on 87% täynnä. Harkitse vaihtoehtoja seuraaviin työvaiheisiin.
          </Text>
        </Card.Content>
      </Card>

      {/* Life Cycle Stages */}
      <Text style={styles.sectionTitle}>ELINKAAREN VAIHEET (A1-C4)</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.stageItem}>
            <View style={styles.stageHeader}>
              <Text style={styles.stageName}>A1-A3: Tuotevaihe</Text>
              <Text style={styles.stageValue}>850 kg CO₂e</Text>
            </View>
            <ProgressBar
              progress={0.425}
              color={nordicColors.primary}
              style={styles.stageBar}
            />
            <Text style={styles.stagePercent}>42.5%</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.stageItem}>
            <View style={styles.stageHeader}>
              <Text style={styles.stageName}>A4-A5: Rakentaminen</Text>
              <Text style={styles.stageValue}>520 kg CO₂e</Text>
            </View>
            <ProgressBar
              progress={0.26}
              color={nordicColors.secondary}
              style={styles.stageBar}
            />
            <Text style={styles.stagePercent}>26%</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.stageItem}>
            <View style={styles.stageHeader}>
              <Text style={styles.stageName}>B1-B7: Käyttövaihe</Text>
              <Text style={styles.stageValue}>280 kg CO₂e</Text>
            </View>
            <ProgressBar
              progress={0.14}
              color={nordicColors.success}
              style={styles.stageBar}
            />
            <Text style={styles.stagePercent}>14%</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.stageItem}>
            <View style={styles.stageHeader}>
              <Text style={styles.stageName}>C1-C4: Purkuvaihe</Text>
              <Text style={styles.stageValue}>90 kg CO₂e</Text>
            </View>
            <ProgressBar
              progress={0.045}
              color={nordicColors.accent}
              style={styles.stageBar}
            />
            <Text style={styles.stagePercent}>4.5%</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Hero Features */}
      <Text style={styles.sectionTitle}>HERO-OMINAISUUDET</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.heroItem}>
            <Icon name="lightning-bolt" size={24} color={nordicColors.primary} />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Reaaliaikainen Seuranta</Text>
              <Text style={styles.heroSubtitle}>Päivittyy automaattisesti DWS IQ 6:sta</Text>
            </View>
            <View style={styles.heroBadge}>
              <Icon name="check" size={16} color={nordicColors.success} />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.heroItem}>
            <Icon name="bell-alert" size={24} color={nordicColors.warning} />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Automaattiset Hälytykset</Text>
              <Text style={styles.heroSubtitle}>SMS + Email kun 90% täynnä</Text>
            </View>
            <View style={styles.heroBadge}>
              <Icon name="check" size={16} color={nordicColors.success} />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.heroItem}>
            <Icon name="flag-checkered" size={24} color={nordicColors.success} />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Fit for 55 / CSRD</Text>
              <Text style={styles.heroSubtitle}>Automaattinen EU Taxonomy</Text>
            </View>
            <View style={styles.heroBadge}>
              <Icon name="check" size={16} color={nordicColors.success} />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.heroItem}>
            <Icon name="link-variant" size={24} color={nordicColors.secondary} />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Audit Trail</Text>
              <Text style={styles.heroSubtitle}>Jokainen luku jäljitettävissä</Text>
            </View>
            <View style={styles.heroBadge}>
              <Icon name="check" size={16} color={nordicColors.success} />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Compliance Status */}
      <Text style={styles.sectionTitle}>COMPLIANCE STATUS</Text>

      <Card style={[styles.card, styles.complianceCard]}>
        <Card.Content>
          <View style={styles.complianceItem}>
            <Icon name="check-circle" size={24} color={nordicColors.success} />
            <Text style={styles.complianceText}>EN 15978:2011</Text>
          </View>

          <View style={styles.complianceItem}>
            <Icon name="check-circle" size={24} color={nordicColors.success} />
            <Text style={styles.complianceText}>Fit for 55</Text>
          </View>

          <View style={styles.complianceItem}>
            <Icon name="check-circle" size={24} color={nordicColors.success} />
            <Text style={styles.complianceText}>CSRD Reporting</Text>
          </View>

          <View style={styles.complianceItem}>
            <Icon name="check-circle" size={24} color={nordicColors.success} />
            <Text style={styles.complianceText}>RT 16-11224</Text>
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
    backgroundColor: nordicColors.success,
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
  carbonBudget: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: spacing.md,
    borderRadius: 8,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  budgetLabel: {
    fontSize: 14,
    color: nordicColors.white,
    fontWeight: '600',
  },
  budgetValue: {
    fontSize: 24,
    fontWeight: '700',
    color: nordicColors.white,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  budgetSubtitle: {
    fontSize: 12,
    color: nordicColors.white,
    opacity: 0.9,
    marginTop: spacing.sm,
  },
  alertCard: {
    borderLeftWidth: 4,
    borderLeftColor: nordicColors.warning,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: nordicColors.text,
    marginLeft: spacing.sm,
  },
  alertText: {
    fontSize: 14,
    color: nordicColors.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: nordicColors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    letterSpacing: 1,
  },
  stageItem: {
    marginBottom: spacing.md,
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  stageName: {
    fontSize: 14,
    fontWeight: '600',
    color: nordicColors.text,
  },
  stageValue: {
    fontSize: 14,
    fontWeight: '700',
    color: nordicColors.primary,
  },
  stageBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: nordicColors.surfaceVariant,
  },
  stagePercent: {
    fontSize: 12,
    color: nordicColors.textSecondary,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: nordicColors.borderLight,
    marginVertical: spacing.md,
  },
  heroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  heroContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: nordicColors.text,
  },
  heroSubtitle: {
    fontSize: 13,
    color: nordicColors.textSecondary,
    marginTop: 2,
  },
  heroBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: nordicColors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  complianceCard: {
    borderLeftWidth: 4,
    borderLeftColor: nordicColors.success,
  },
  complianceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  complianceText: {
    fontSize: 15,
    fontWeight: '600',
    color: nordicColors.text,
    marginLeft: spacing.md,
  },
});
