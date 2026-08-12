import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { nordicColors, spacing, shadows } from '../theme/nordicTheme';

interface PortfolioAlert {
  id: string;
  projectName: string;
  type: 'schedule' | 'cost' | 'safety' | 'quality' | 'resource';
  severity: 'red' | 'amber' | 'green';
  message: string;
  ageHours: number;
  acknowledged: boolean;
}

const ALERT_ICONS: Record<PortfolioAlert['type'], string> = {
  schedule: 'calendar-alert',
  cost: 'currency-eur',
  safety: 'shield-alert',
  quality: 'clipboard-alert',
  resource: 'account-group',
};

const SEVERITY_COLORS: Record<PortfolioAlert['severity'], string> = {
  red: nordicColors.error,
  amber: nordicColors.warning,
  green: nordicColors.success,
};

const INITIAL_ALERTS: PortfolioAlert[] = [
  {
    id: 'AL-101',
    projectName: 'HQ Expansion',
    type: 'schedule',
    severity: 'red',
    message: 'Critical path slip 5d',
    ageHours: 48,
    acknowledged: false,
  },
  {
    id: 'AL-102',
    projectName: 'Office Retrofit',
    type: 'quality',
    severity: 'red',
    message: 'NCR overdue 3',
    ageHours: 24,
    acknowledged: false,
  },
  {
    id: 'AL-103',
    projectName: 'HQ Expansion',
    type: 'safety',
    severity: 'amber',
    message: 'Near-miss rate up 15% MTD',
    ageHours: 12,
    acknowledged: false,
  },
  {
    id: 'AL-104',
    projectName: 'Tampere Logistics Hub',
    type: 'resource',
    severity: 'amber',
    message: 'Overtime 40% over budgeted hours',
    ageHours: 6,
    acknowledged: false,
  },
];

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<PortfolioAlert[]>(INITIAL_ALERTS);

  const acknowledge = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  };

  const acknowledgeAll = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
  };

  const openCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <ScrollView style={styles.container}>
      <Card style={[styles.card, styles.headerCard]}>
        <Card.Content>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Portfolio Alert Center</Text>
              <Text style={styles.headerSubtitle}>Corporate portfolio · cross-project alerts</Text>
            </View>
            <Icon name="bell-alert" size={40} color={nordicColors.white} />
          </View>
          <Text style={styles.openCount}>
            {openCount} open alert{openCount === 1 ? '' : 's'}
          </Text>
        </Card.Content>
      </Card>

      {openCount > 0 && (
        <Button
          mode="outlined"
          onPress={acknowledgeAll}
          style={styles.bulkButton}
          textColor={nordicColors.primary}
        >
          Acknowledge all
        </Button>
      )}

      <Text style={styles.sectionTitle}>ALERTS</Text>

      <Card style={styles.card}>
        <Card.Content>
          {alerts.map((alert, index) => (
            <View key={alert.id}>
              <View style={styles.alertRow}>
                <View
                  style={[styles.severityDot, { backgroundColor: SEVERITY_COLORS[alert.severity] }]}
                />
                <Icon name={ALERT_ICONS[alert.type]} size={22} color={nordicColors.textSecondary} />
                <View style={styles.alertBody}>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                  <Text style={styles.alertMeta}>
                    {alert.projectName} · {alert.type} · {alert.ageHours}h ago
                  </Text>
                </View>
                {alert.acknowledged ? (
                  <View style={styles.ackBadge}>
                    <Icon name="check" size={14} color={nordicColors.white} />
                  </View>
                ) : (
                  <Button
                    mode="text"
                    compact
                    onPress={() => acknowledge(alert.id)}
                    textColor={nordicColors.primary}
                  >
                    Ack
                  </Button>
                )}
              </View>
              {index < alerts.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
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
  headerRow: {
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
  openCount: {
    fontSize: 14,
    color: nordicColors.white,
    marginTop: spacing.md,
    fontWeight: '600',
  },
  bulkButton: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderColor: nordicColors.primary,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: nordicColors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    letterSpacing: 1,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  alertBody: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  alertMessage: {
    fontSize: 14,
    fontWeight: '600',
    color: nordicColors.text,
  },
  alertMeta: {
    fontSize: 12,
    color: nordicColors.textSecondary,
    marginTop: 2,
  },
  ackBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: nordicColors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: nordicColors.borderLight,
    marginVertical: spacing.xs,
  },
});
