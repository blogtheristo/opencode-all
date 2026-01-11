import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Divider, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { nordicColors, spacing } from '../theme/nordicTheme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import DiaryScreen from '../screens/DiaryScreen';
import InspectionScreen from '../screens/InspectionScreen';
import CarbonReportScreen from '../screens/CarbonReportScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();

// Custom Drawer Content - OneLifetimeWorld Style
function CustomDrawerContent(props: any) {
  const { navigation } = props;

  return (
    <View style={styles.drawerContainer}>
      {/* Header with DWS 6 Logo */}
      <View style={styles.drawerHeader}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>DWS</Text>
            <Text style={styles.logoNumber}>6</Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>Firehorse Mobile</Text>
        <Text style={styles.headerSubtitle}>Nordic Construction Management</Text>
      </View>

      <Divider style={styles.divider} />

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {/* Dashboard Section */}
        <Text style={styles.sectionTitle}>DASHBOARDS</Text>
        
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="view-dashboard" size={24} color={nordicColors.primary} />
          <Text style={styles.menuText}>Overview</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Icon name="chart-box" size={24} color={nordicColors.primary} />
          <Text style={styles.menuText}>DWS IQ 6 Dashboard</Text>
        </TouchableOpacity>

        <Divider style={styles.divider} />

        {/* Firehorse Products Section */}
        <Text style={styles.sectionTitle}>FIREHORSE PRODUCTS</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Diary')}
        >
          <Icon name="notebook" size={24} color={nordicColors.secondary} />
          <Text style={styles.menuText}>Työmaapäiväkirja</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>RT 16-10660</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Inspection')}
        >
          <Icon name="clipboard-check" size={24} color={nordicColors.secondary} />
          <Text style={styles.menuText}>Vastaanottotarkastus</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('CarbonReport')}
        >
          <Icon name="leaf" size={24} color={nordicColors.success} />
          <Text style={styles.menuText}>EN 15978 Carbon Report</Text>
          <View style={[styles.badge, styles.badgeSuccess]}>
            <Text style={styles.badgeText}>Fit for 55</Text>
          </View>
        </TouchableOpacity>

        <Divider style={styles.divider} />

        {/* Settings */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="cog" size={24} color={nordicColors.textSecondary} />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.drawerFooter}>
        <View style={styles.flagsContainer}>
          <Text style={styles.flag}>🇸🇪</Text>
          <Text style={styles.flag}>🇳🇴</Text>
          <Text style={styles.flag}>🇫🇮</Text>
          <Text style={styles.flag}>🇩🇰</Text>
        </View>
        <Text style={styles.footerText}>Nordic Excellence</Text>
        <Text style={styles.versionText}>v1.0.0</Text>
      </View>
    </View>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: nordicColors.white,
          elevation: 2,
          shadowColor: nordicColors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 4,
        },
        headerTintColor: nordicColors.primary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        drawerStyle: {
          backgroundColor: nordicColors.white,
          width: 300,
        },
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Firehorse',
          headerRight: () => (
            <View style={styles.headerLogo}>
              <View style={styles.miniLogo}>
                <Text style={styles.miniLogoText}>DWS 6</Text>
              </View>
            </View>
          ),
        }}
      />
      <Drawer.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'DWS IQ 6 Dashboard' }}
      />
      <Drawer.Screen 
        name="Diary" 
        component={DiaryScreen}
        options={{ title: 'Työmaapäiväkirja' }}
      />
      <Drawer.Screen 
        name="Inspection" 
        component={InspectionScreen}
        options={{ title: 'Vastaanottotarkastus' }}
      />
      <Drawer.Screen 
        name="CarbonReport" 
        component={CarbonReportScreen}
        options={{ title: 'Carbon Report' }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: nordicColors.white,
  },
  drawerHeader: {
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    backgroundColor: nordicColors.primary,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: spacing.md,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: nordicColors.white,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: nordicColors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: nordicColors.primary,
  },
  logoNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: nordicColors.accent,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: nordicColors.white,
    marginTop: spacing.sm,
  },
  headerSubtitle: {
    fontSize: 12,
    color: nordicColors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  menuContainer: {
    flex: 1,
    paddingTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: nordicColors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuText: {
    fontSize: 15,
    color: nordicColors.text,
    marginLeft: spacing.md,
    flex: 1,
  },
  badge: {
    backgroundColor: nordicColors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeSuccess: {
    backgroundColor: nordicColors.success,
  },
  badgeText: {
    fontSize: 9,
    color: nordicColors.white,
    fontWeight: '700',
  },
  divider: {
    marginVertical: spacing.sm,
    backgroundColor: nordicColors.borderLight,
  },
  drawerFooter: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: nordicColors.borderLight,
    alignItems: 'center',
  },
  flagsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  flag: {
    fontSize: 24,
  },
  footerText: {
    fontSize: 12,
    color: nordicColors.textSecondary,
    fontWeight: '600',
  },
  versionText: {
    fontSize: 10,
    color: nordicColors.textDisabled,
    marginTop: spacing.xs,
  },
  headerLogo: {
    marginRight: spacing.md,
  },
  miniLogo: {
    backgroundColor: nordicColors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  miniLogoText: {
    fontSize: 12,
    fontWeight: '700',
    color: nordicColors.white,
  },
});
