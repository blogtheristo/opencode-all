import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { nordicColors, spacing, shadows } from '../theme/nordicTheme';

export default function InspectionScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={[styles.card, styles.headerCard]}>
        <Card.Content>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Vastaanottotarkastus</Text>
              <Text style={styles.headerSubtitle}>BIM + AI + 360°</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>RYL 2010</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Hero Features */}
      <Text style={styles.sectionTitle}>HERO-OMINAISUUDET</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: nordicColors.primary }]}>
              <Icon name="cube-outline" size={24} color={nordicColors.white} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>IFC-Linkitys</Text>
              <Text style={styles.featureSubtitle}>Suora linkki BIM-malliin</Text>
            </View>
            <Icon name="chevron-right" size={24} color={nordicColors.textSecondary} />
          </View>

          <View style={styles.divider} />

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: nordicColors.secondary }]}>
              <Icon name="panorama-variant" size={24} color={nordicColors.white} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>360° Panoraama</Text>
              <Text style={styles.featureSubtitle}>VR-valmis dokumentointi</Text>
            </View>
            <Icon name="chevron-right" size={24} color={nordicColors.textSecondary} />
          </View>

          <View style={styles.divider} />

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: nordicColors.success }]}>
              <Icon name="robot" size={24} color={nordicColors.white} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>AI-Puutelista</Text>
              <Text style={styles.featureSubtitle}>95% tarkkuus</Text>
            </View>
            <Icon name="chevron-right" size={24} color={nordicColors.textSecondary} />
          </View>

          <View style={styles.divider} />

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: nordicColors.accent }]}>
              <Icon name="video" size={24} color={nordicColors.text} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>4K Video</Text>
              <Text style={styles.featureSubtitle}>Puutteiden dokumentointi</Text>
            </View>
            <Icon name="chevron-right" size={24} color={nordicColors.textSecondary} />
          </View>
        </Card.Content>
      </Card>

      {/* Inspection Areas */}
      <Text style={styles.sectionTitle}>TARKASTETTAVAT ALUEET</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.areaItem}>
            <Text style={styles.areaTitle}>Aula ja sisäänkäynti</Text>
            <Chip
              mode="flat"
              style={[styles.chip, { backgroundColor: nordicColors.success + '20' }]}
              textStyle={{ color: nordicColors.success, fontSize: 11, fontWeight: '700' }}
            >
              Hyväksytty
            </Chip>
          </View>

          <View style={styles.divider} />

          <View style={styles.areaItem}>
            <Text style={styles.areaTitle}>Asunnot 1-12</Text>
            <Chip
              mode="flat"
              style={[styles.chip, { backgroundColor: nordicColors.warning + '20' }]}
              textStyle={{ color: nordicColors.warning, fontSize: 11, fontWeight: '700' }}
            >
              Huomautuksia
            </Chip>
          </View>

          <View style={styles.divider} />

          <View style={styles.areaItem}>
            <Text style={styles.areaTitle}>Kellari ja tekniset tilat</Text>
            <Chip
              mode="flat"
              style={[styles.chip, { backgroundColor: nordicColors.textSecondary + '20' }]}
              textStyle={{ color: nordicColors.textSecondary, fontSize: 11, fontWeight: '700' }}
            >
              Ei tarkastettu
            </Chip>
          </View>
        </Card.Content>
      </Card>

      {/* Defects Summary */}
      <Text style={styles.sectionTitle}>PUUTTEET</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.defectSummary}>
            <View style={styles.defectItem}>
              <Text style={styles.defectCount}>3</Text>
              <Text style={styles.defectLabel}>Kriittinen</Text>
              <View style={[styles.defectBar, { backgroundColor: nordicColors.error }]} />
            </View>

            <View style={styles.defectItem}>
              <Text style={styles.defectCount}>7</Text>
              <Text style={styles.defectLabel}>Merkittävä</Text>
              <View style={[styles.defectBar, { backgroundColor: nordicColors.warning }]} />
            </View>

            <View style={styles.defectItem}>
              <Text style={styles.defectCount}>12</Text>
              <Text style={styles.defectLabel}>Vähäinen</Text>
              <View style={[styles.defectBar, { backgroundColor: nordicColors.success }]} />
            </View>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.addDefectButton}>
            <Icon name="plus-circle" size={24} color={nordicColors.primary} />
            <Text style={styles.addDefectText}>Lisää puute</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* RYL Compliance */}
      <Text style={styles.sectionTitle}>RYL 2010 YHTEENSOPIVUUS</Text>

      <Card style={[styles.card, styles.rylCard]}>
        <Card.Content>
          <View style={styles.rylHeader}>
            <Text style={styles.rylTitle}>Automaattitarkistus</Text>
            <View style={styles.rylScore}>
              <Text style={styles.rylScoreValue}>94%</Text>
            </View>
          </View>

          <View style={styles.rylBar}>
            <View style={[styles.rylBarFill, { width: '94%' }]} />
          </View>

          <Text style={styles.rylSubtitle}>Erinomainen yhteensopivuus</Text>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <Button
          mode="contained"
          style={styles.actionButton}
          contentStyle={styles.actionButtonContent}
          labelStyle={styles.actionButtonLabel}
          buttonColor={nordicColors.primary}
          icon="camera"
        >
          Ota 360° kuva
        </Button>

        <Button
          mode="contained"
          style={styles.actionButton}
          contentStyle={styles.actionButtonContent}
          labelStyle={styles.actionButtonLabel}
          buttonColor={nordicColors.secondary}
          icon="video"
        >
          Tallenna video
        </Button>

        <Button
          mode="outlined"
          style={styles.actionButton}
          contentStyle={styles.actionButtonContent}
          labelStyle={styles.outlineButtonLabel}
          textColor={nordicColors.primary}
          icon="cube-outline"
        >
          Avaa BIM-malli
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
    backgroundColor: nordicColors.secondary,
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
  badge: {
    backgroundColor: nordicColors.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: nordicColors.secondary,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: nordicColors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    letterSpacing: 1,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: nordicColors.text,
  },
  featureSubtitle: {
    fontSize: 13,
    color: nordicColors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: nordicColors.borderLight,
    marginVertical: spacing.sm,
  },
  areaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  areaTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: nordicColors.text,
    flex: 1,
  },
  chip: {
    height: 28,
  },
  defectSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
  },
  defectItem: {
    alignItems: 'center',
  },
  defectCount: {
    fontSize: 32,
    fontWeight: '700',
    color: nordicColors.text,
  },
  defectLabel: {
    fontSize: 12,
    color: nordicColors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  defectBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
  },
  addDefectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  addDefectText: {
    fontSize: 15,
    fontWeight: '600',
    color: nordicColors.primary,
    marginLeft: spacing.sm,
  },
  rylCard: {
    borderLeftWidth: 4,
    borderLeftColor: nordicColors.success,
  },
  rylHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  rylTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: nordicColors.text,
  },
  rylScore: {
    backgroundColor: nordicColors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  rylScoreValue: {
    fontSize: 20,
    fontWeight: '700',
    color: nordicColors.white,
  },
  rylBar: {
    height: 8,
    backgroundColor: nordicColors.surfaceVariant,
    borderRadius: 4,
    overflow: 'hidden',
  },
  rylBarFill: {
    height: '100%',
    backgroundColor: nordicColors.success,
  },
  rylSubtitle: {
    fontSize: 13,
    color: nordicColors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  actionContainer: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  actionButton: {
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  actionButtonContent: {
    height: 50,
  },
  actionButtonLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  outlineButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
});
