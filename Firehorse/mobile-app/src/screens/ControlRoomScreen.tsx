import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { nordicColors, spacing, shadows } from '../theme/nordicTheme';

export default function ControlRoomScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={[styles.card, styles.headerCard]}>
        <Card.Content>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Control Room</Text>
              <Text style={styles.headerSubtitle}>Field Operations Command</Text>
            </View>
            <Icon name="monitor-dashboard" size={36} color={nordicColors.white} />
          </View>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>658</Text>
              <Text style={styles.statLabel}>Workers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>127</Text>
              <Text style={styles.statLabel}>Days w/o LTI</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Active Sites</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Safety Status */}
      <Text style={styles.sectionTitle}>SAFETY STATUS</Text>

      <Card style={[styles.card, styles.safetyCard]}>
        <Card.Content>
          <View style={styles.safetyHeader}>
            <Icon name="shield-check" size={32} color={nordicColors.success} />
            <View style={styles.safetyContent}>
              <Text style={styles.safetyTitle}>Site Safety Score</Text>
              <Text style={styles.safetySubtitle}>EN 13001 Compliant</Text>
            </View>
            <View style={styles.safetyScore}>
              <Text style={styles.safetyScoreValue}>92</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.weatherRow}>
            <View style={styles.weatherItem}>
              <Icon name="thermometer" size={20} color={nordicColors.primary} />
              <Text style={styles.weatherValue}>-4°C</Text>
              <Text style={styles.weatherLabel}>Temp</Text>
            </View>
            <View style={styles.weatherItem}>
              <Icon name="weather-windy" size={20} color={nordicColors.primary} />
              <Text style={styles.weatherValue}>8 m/s</Text>
              <Text style={styles.weatherLabel}>Wind</Text>
            </View>
            <View style={styles.weatherItem}>
              <Icon name="water-percent" size={20} color={nordicColors.primary} />
              <Text style={styles.weatherValue}>65%</Text>
              <Text style={styles.weatherLabel}>Humidity</Text>
            </View>
            <View style={styles.weatherItem}>
              <Icon name="eye" size={20} color={nordicColors.primary} />
              <Text style={styles.weatherValue}>Good</Text>
              <Text style={styles.weatherLabel}>Visibility</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Role-Based Views */}
      <Text style={styles.sectionTitle}>ROLE-BASED VIEWS</Text>

      <Card style={styles.card}>
        <Card.Content>
          <TouchableOpacity style={styles.roleItem}>
            <View style={[styles.roleIcon, { backgroundColor: nordicColors.primary }]}>
              <Icon name="hard-hat" size={24} color={nordicColors.white} />
            </View>
            <View style={styles.roleContent}>
              <Text style={styles.roleTitle}>Site Chief</Text>
              <Text style={styles.roleSubtitle}>Multi-site operations, workforce, equipment</Text>
            </View>
            <Icon name="chevron-right" size={24} color={nordicColors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.roleItem}>
            <View style={[styles.roleIcon, { backgroundColor: nordicColors.secondary }]}>
              <Icon name="ruler-square-compass" size={24} color={nordicColors.white} />
            </View>
            <View style={styles.roleContent}>
              <Text style={styles.roleTitle}>Engineer</Text>
              <Text style={styles.roleSubtitle}>Technical design, RFI, BIM coordination</Text>
            </View>
            <Icon name="chevron-right" size={24} color={nordicColors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.roleItem}>
            <View style={[styles.roleIcon, { backgroundColor: nordicColors.success }]}>
              <Icon name="hammer-wrench" size={24} color={nordicColors.white} />
            </View>
            <View style={styles.roleContent}>
              <Text style={styles.roleTitle}>Constructor</Text>
              <Text style={styles.roleSubtitle}>Work orders, crew management, field docs</Text>
            </View>
            <Icon name="chevron-right" size={24} color={nordicColors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.roleItem}>
            <View style={[styles.roleIcon, { backgroundColor: nordicColors.warning }]}>
              <Icon name="account-tie" size={24} color={nordicColors.white} />
            </View>
            <View style={styles.roleContent}>
              <Text style={styles.roleTitle}>Contractor</Text>
              <Text style={styles.roleSubtitle}>Contracts, financials, material tracking</Text>
            </View>
            <Icon name="chevron-right" size={24} color={nordicColors.textSecondary} />
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Active Sites */}
      <Text style={styles.sectionTitle}>ACTIVE CONSTRUCTION SITES</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.siteItem}>
            <View style={styles.siteHeader}>
              <Text style={styles.siteName}>Helsinki Residential</Text>
              <Chip
                mode="flat"
                style={[styles.chip, { backgroundColor: nordicColors.success + '20' }]}
                textStyle={{ color: nordicColors.success, fontSize: 10, fontWeight: '700' }}
              >
                On Track
              </Chip>
            </View>
            <View style={styles.siteStats}>
              <Text style={styles.siteStatText}>142 workers</Text>
              <Text style={styles.siteStatDivider}>|</Text>
              <Text style={styles.siteStatText}>12 equipment</Text>
              <Text style={styles.siteStatDivider}>|</Text>
              <Text style={styles.siteStatText}>Safety: 95</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.siteItem}>
            <View style={styles.siteHeader}>
              <Text style={styles.siteName}>Tampere Office Tower</Text>
              <Chip
                mode="flat"
                style={[styles.chip, { backgroundColor: nordicColors.warning + '20' }]}
                textStyle={{ color: nordicColors.warning, fontSize: 10, fontWeight: '700' }}
              >
                Caution
              </Chip>
            </View>
            <View style={styles.siteStats}>
              <Text style={styles.siteStatText}>98 workers</Text>
              <Text style={styles.siteStatDivider}>|</Text>
              <Text style={styles.siteStatText}>8 equipment</Text>
              <Text style={styles.siteStatDivider}>|</Text>
              <Text style={styles.siteStatText}>Safety: 88</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.siteItem}>
            <View style={styles.siteHeader}>
              <Text style={styles.siteName}>Oulu Shopping Center</Text>
              <Chip
                mode="flat"
                style={[styles.chip, { backgroundColor: nordicColors.error + '20' }]}
                textStyle={{ color: nordicColors.error, fontSize: 10, fontWeight: '700' }}
              >
                Alert
              </Chip>
            </View>
            <View style={styles.siteStats}>
              <Text style={styles.siteStatText}>76 workers</Text>
              <Text style={styles.siteStatDivider}>|</Text>
              <Text style={styles.siteStatText}>6 equipment</Text>
              <Text style={styles.siteStatDivider}>|</Text>
              <Text style={styles.siteStatText}>Safety: 72</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Equipment Status */}
      <Text style={styles.sectionTitle}>EQUIPMENT & IoT</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.equipmentRow}>
            <View style={styles.equipmentItem}>
              <Icon name="crane" size={28} color={nordicColors.primary} />
              <Text style={styles.equipmentValue}>4</Text>
              <Text style={styles.equipmentLabel}>Cranes</Text>
              <View style={[styles.equipmentDot, { backgroundColor: nordicColors.success }]} />
            </View>
            <View style={styles.equipmentItem}>
              <Icon name="excavator" size={28} color={nordicColors.primary} />
              <Text style={styles.equipmentValue}>8</Text>
              <Text style={styles.equipmentLabel}>Excavators</Text>
              <View style={[styles.equipmentDot, { backgroundColor: nordicColors.success }]} />
            </View>
            <View style={styles.equipmentItem}>
              <Icon name="truck" size={28} color={nordicColors.primary} />
              <Text style={styles.equipmentValue}>12</Text>
              <Text style={styles.equipmentLabel}>Trucks</Text>
              <View style={[styles.equipmentDot, { backgroundColor: nordicColors.warning }]} />
            </View>
            <View style={styles.equipmentItem}>
              <Icon name="access-point" size={28} color={nordicColors.primary} />
              <Text style={styles.equipmentValue}>6</Text>
              <Text style={styles.equipmentLabel}>Edge Nodes</Text>
              <View style={[styles.equipmentDot, { backgroundColor: nordicColors.success }]} />
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
  safetyCard: {
    borderLeftWidth: 4,
    borderLeftColor: nordicColors.success,
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  safetyContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: nordicColors.text,
  },
  safetySubtitle: {
    fontSize: 12,
    color: nordicColors.textSecondary,
    marginTop: 2,
  },
  safetyScore: {
    backgroundColor: nordicColors.success,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safetyScoreValue: {
    fontSize: 20,
    fontWeight: '700',
    color: nordicColors.white,
  },
  divider: {
    height: 1,
    backgroundColor: nordicColors.borderLight,
    marginVertical: spacing.sm,
  },
  weatherRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.sm,
  },
  weatherItem: {
    alignItems: 'center',
  },
  weatherValue: {
    fontSize: 14,
    fontWeight: '700',
    color: nordicColors.text,
    marginTop: spacing.xs,
  },
  weatherLabel: {
    fontSize: 10,
    color: nordicColors.textSecondary,
    marginTop: 2,
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: nordicColors.text,
  },
  roleSubtitle: {
    fontSize: 13,
    color: nordicColors.textSecondary,
    marginTop: 2,
  },
  siteItem: {
    paddingVertical: spacing.sm,
  },
  siteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  siteName: {
    fontSize: 15,
    fontWeight: '600',
    color: nordicColors.text,
    flex: 1,
  },
  chip: {
    height: 24,
  },
  siteStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  siteStatText: {
    fontSize: 12,
    color: nordicColors.textSecondary,
  },
  siteStatDivider: {
    fontSize: 12,
    color: nordicColors.borderLight,
    marginHorizontal: spacing.sm,
  },
  equipmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.sm,
  },
  equipmentItem: {
    alignItems: 'center',
  },
  equipmentValue: {
    fontSize: 20,
    fontWeight: '700',
    color: nordicColors.text,
    marginTop: spacing.xs,
  },
  equipmentLabel: {
    fontSize: 11,
    color: nordicColors.textSecondary,
    marginTop: 2,
  },
  equipmentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: spacing.xs,
  },
});
