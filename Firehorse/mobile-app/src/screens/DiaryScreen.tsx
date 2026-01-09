import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { nordicColors, spacing, shadows } from '../theme/nordicTheme';

export default function DiaryScreen() {
  const [weather, setWeather] = useState('Aurinkoinen');
  const [temperature, setTemperature] = useState('-2°C');
  const [workers, setWorkers] = useState('12');

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={[styles.card, styles.headerCard]}>
        <Card.Content>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Työmaapäiväkirja</Text>
              <Text style={styles.headerSubtitle}>RT 16-10660</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>70% AUTO</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Auto-Fill Section */}
      <Text style={styles.sectionTitle}>AUTO-TÄYTTÖ (EDGE NODES)</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.autoFillItem}>
            <Icon name="weather-partly-cloudy" size={24} color={nordicColors.primary} />
            <View style={styles.autoFillContent}>
              <Text style={styles.autoFillLabel}>Sää</Text>
              <Text style={styles.autoFillValue}>{weather}</Text>
            </View>
            <View style={styles.autoFillBadge}>
              <Icon name="check" size={16} color={nordicColors.success} />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.autoFillItem}>
            <Icon name="thermometer" size={24} color={nordicColors.primary} />
            <View style={styles.autoFillContent}>
              <Text style={styles.autoFillLabel}>Lämpötila</Text>
              <Text style={styles.autoFillValue}>{temperature}</Text>
            </View>
            <View style={styles.autoFillBadge}>
              <Icon name="check" size={16} color={nordicColors.success} />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.autoFillItem}>
            <Icon name="account-group" size={24} color={nordicColors.primary} />
            <View style={styles.autoFillContent}>
              <Text style={styles.autoFillLabel}>Työntekijät</Text>
              <Text style={styles.autoFillValue}>{workers} henkilöä</Text>
            </View>
            <View style={styles.autoFillBadge}>
              <Icon name="check" size={16} color={nordicColors.success} />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Project Info */}
      <Text style={styles.sectionTitle}>PROJEKTIN TIEDOT</Text>

      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Projektikoodi"
            value="FI-BUILD-2024"
            mode="outlined"
            style={styles.input}
            outlineColor={nordicColors.border}
            activeOutlineColor={nordicColors.primary}
            editable={false}
          />

          <TextInput
            label="Kohteen nimi"
            value="Helsingin Asuinkerrostalo"
            mode="outlined"
            style={styles.input}
            outlineColor={nordicColors.border}
            activeOutlineColor={nordicColors.primary}
          />

          <TextInput
            label="Päivämäärä"
            value={new Date().toLocaleDateString('fi-FI')}
            mode="outlined"
            style={styles.input}
            outlineColor={nordicColors.border}
            activeOutlineColor={nordicColors.primary}
            editable={false}
          />
        </Card.Content>
      </Card>

      {/* Work Description */}
      <Text style={styles.sectionTitle}>TEHDYT TYÖT</Text>

      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Kuvaus tehdyistä töistä"
            mode="outlined"
            multiline
            numberOfLines={6}
            style={styles.input}
            outlineColor={nordicColors.border}
            activeOutlineColor={nordicColors.primary}
            placeholder="Kirjoita tähän päivän työt..."
          />
        </Card.Content>
      </Card>

      {/* Photos */}
      <Text style={styles.sectionTitle}>KUVAT JA VIDEOT</Text>

      <Card style={styles.card}>
        <Card.Content>
          <TouchableOpacity style={styles.photoButton}>
            <Icon name="camera" size={32} color={nordicColors.primary} />
            <Text style={styles.photoButtonText}>Ota kuva</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.photoButton}>
            <Icon name="video" size={32} color={nordicColors.secondary} />
            <Text style={styles.photoButtonText}>Tallenna video</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.photoButton}>
            <Icon name="panorama-variant" size={32} color={nordicColors.success} />
            <Text style={styles.photoButtonText}>360° panoraama</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Signature */}
      <Text style={styles.sectionTitle}>ALLEKIRJOITUS</Text>

      <Card style={styles.card}>
        <Card.Content>
          <TouchableOpacity style={styles.signatureButton}>
            <Icon name="draw" size={32} color={nordicColors.primary} />
            <Text style={styles.signatureButtonText}>Allekirjoita</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <Button
          mode="contained"
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
          labelStyle={styles.submitButtonLabel}
          buttonColor={nordicColors.primary}
        >
          Tallenna päiväkirja
        </Button>

        <Button
          mode="outlined"
          style={styles.draftButton}
          contentStyle={styles.submitButtonContent}
          labelStyle={styles.draftButtonLabel}
          textColor={nordicColors.textSecondary}
        >
          Tallenna luonnoksena
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
  badge: {
    backgroundColor: nordicColors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: nordicColors.text,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: nordicColors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    letterSpacing: 1,
  },
  autoFillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  autoFillContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  autoFillLabel: {
    fontSize: 13,
    color: nordicColors.textSecondary,
  },
  autoFillValue: {
    fontSize: 16,
    fontWeight: '600',
    color: nordicColors.text,
    marginTop: 2,
  },
  autoFillBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: nordicColors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: nordicColors.borderLight,
    marginVertical: spacing.sm,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: nordicColors.white,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  photoButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: nordicColors.text,
    marginLeft: spacing.md,
  },
  signatureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: nordicColors.surfaceVariant,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: nordicColors.border,
    borderStyle: 'dashed',
  },
  signatureButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: nordicColors.primary,
    marginLeft: spacing.sm,
  },
  submitContainer: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  submitButton: {
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  submitButtonContent: {
    height: 50,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  draftButton: {
    borderRadius: 8,
    borderColor: nordicColors.border,
  },
  draftButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
