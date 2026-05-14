import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Switch } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { nordicColors, spacing, shadows } from '../theme/nordicTheme';

export default function SettingsScreen() {
  const [offlineMode, setOfflineMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [autoSync, setAutoSync] = React.useState(true);

  return (
    <ScrollView style={styles.container}>
      {/* User Profile */}
      <Card style={[styles.card, styles.profileCard]}>
        <Card.Content>
          <View style={styles.profile}>
            <View style={styles.avatar}>
              <Icon name="account" size={40} color={nordicColors.white} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Matti Meikäläinen</Text>
              <Text style={styles.profileEmail}>matti@example.com</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* General Settings */}
      <Text style={styles.sectionTitle}>GENERAL</Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="wifi-off" size={24} color={nordicColors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Offline Mode</Text>
                <Text style={styles.settingSubtitle}>Work without internet</Text>
              </View>
            </View>
            <Switch
              value={offlineMode}
              onValueChange={setOfflineMode}
              color={nordicColors.primary}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="bell" size={24} color={nordicColors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingSubtitle}>Push notifications</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              color={nordicColors.primary}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="sync" size={24} color={nordicColors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Auto-Sync</Text>
                <Text style={styles.settingSubtitle}>Automatic synchronization</Text>
              </View>
            </View>
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              color={nordicColors.primary}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Language */}
      <Text style={styles.sectionTitle}>LANGUAGE</Text>

      <Card style={styles.card}>
        <Card.Content>
          <TouchableOpacity style={styles.languageItem}>
            <Text style={styles.flag}>🇫🇮</Text>
            <Text style={styles.languageText}>Suomi</Text>
            <Icon name="check" size={24} color={nordicColors.success} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.languageItem}>
            <Text style={styles.flag}>🇸🇪</Text>
            <Text style={styles.languageText}>Svenska</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.languageItem}>
            <Text style={styles.flag}>🇳🇴</Text>
            <Text style={styles.languageText}>Norsk</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.languageItem}>
            <Text style={styles.flag}>🇩🇰</Text>
            <Text style={styles.languageText}>Dansk</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.languageItem}>
            <Text style={styles.flag}>🇬🇧</Text>
            <Text style={styles.languageText}>English</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* About */}
      <Text style={styles.sectionTitle}>ABOUT</Text>

      <Card style={styles.card}>
        <Card.Content>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="information" size={24} color={nordicColors.textSecondary} />
            <Text style={styles.menuText}>About Firehorse</Text>
            <Icon name="chevron-right" size={24} color={nordicColors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <Icon name="file-document" size={24} color={nordicColors.textSecondary} />
            <Text style={styles.menuText}>Terms of Service</Text>
            <Icon name="chevron-right" size={24} color={nordicColors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <Icon name="shield-check" size={24} color={nordicColors.textSecondary} />
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Icon name="chevron-right" size={24} color={nordicColors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <Icon name="help-circle" size={24} color={nordicColors.textSecondary} />
            <Text style={styles.menuText}>Help & Support</Text>
            <Icon name="chevron-right" size={24} color={nordicColors.textSecondary} />
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Version */}
      <View style={styles.version}>
        <Text style={styles.versionText}>Firehorse Mobile v2.0.0</Text>
        <Text style={styles.versionSubtext}>DWS IQ 6 Platform</Text>
        <View style={styles.flagsContainer}>
          <Text style={styles.flag}>🇸🇪</Text>
          <Text style={styles.flag}>🇳🇴</Text>
          <Text style={styles.flag}>🇫🇮</Text>
          <Text style={styles.flag}>🇩🇰</Text>
        </View>
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
  profileCard: {
    marginTop: spacing.md,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: nordicColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: nordicColors.text,
  },
  profileEmail: {
    fontSize: 14,
    color: nordicColors.textSecondary,
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: nordicColors.text,
  },
  settingSubtitle: {
    fontSize: 13,
    color: nordicColors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: nordicColors.borderLight,
    marginVertical: spacing.sm,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  flag: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  languageText: {
    fontSize: 15,
    fontWeight: '600',
    color: nordicColors.text,
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  menuText: {
    fontSize: 15,
    color: nordicColors.text,
    marginLeft: spacing.md,
    flex: 1,
  },
  version: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  versionText: {
    fontSize: 13,
    fontWeight: '600',
    color: nordicColors.textSecondary,
  },
  versionSubtext: {
    fontSize: 11,
    color: nordicColors.textDisabled,
    marginTop: spacing.xs,
  },
  flagsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
