import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { nordicColors, spacing } from '../theme/nordicTheme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import DiaryScreen from '../screens/DiaryScreen';
import InspectionScreen from '../screens/InspectionScreen';
import CarbonReportScreen from '../screens/CarbonReportScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AlertsScreen from '../screens/AlertsScreen';
import OmnichannelScreen from '../screens/OmnichannelScreen';
import ControlRoomScreen from '../screens/ControlRoomScreen';
import SituationRoomScreen from '../screens/SituationRoomScreen';
import ReportScreen from '../screens/ReportScreen';
import AutomationScreen from '../screens/AutomationScreen';
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
        <Text style={styles.headerVersion}>v2.0.0</Text>
      </View>

      <Divider style={styles.divider} />

      {/* Scrollable Menu Items */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {/* Dashboard Section */}
        <Text style={styles.sectionTitle}>DASHBOARDS</Text>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
          <Icon name="view-dashboard" size={22} color={nordicColors.primary} />
          <Text style={styles.menuText}>Overview</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Dashboard')}>
          <Icon name="chart-box" size={22} color={nordicColors.primary} />
          <Text style={styles.menuText}>DWS IQ 6 Dashboard</Text>
        </TouchableOpacity>

        <Divider style={styles.divider} />

        {/* NCC Portfolio Section — folded in from the retired mobile-dashboard shell */}
        <Text style={styles.sectionTitle}>NCC PORTFOLIO</Text>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Alerts')}>
          <Icon name="bell-alert" size={22} color={nordicColors.secondary} />
          <Text style={styles.menuText}>Portfolio Alerts</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>NCC</Text>
          </View>
        </TouchableOpacity>

        <Divider style={styles.divider} />

        {/* Firehorse Products Section */}
        <Text style={styles.sectionTitle}>FIREHORSE PRODUCTS</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Omnichannel')}
        >
          <Icon name="bullhorn" size={22} color={nordicColors.primary} />
          <Text style={styles.menuText}>Omnichannel</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>CRM</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Automation')}>
          <Icon name="robot" size={22} color={nordicColors.secondary} />
          <Text style={styles.menuText}>Automation</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Report')}>
          <Icon name="file-chart" size={22} color={nordicColors.primary} />
          <Text style={styles.menuText}>Report Engine</Text>
        </TouchableOpacity>

        <Divider style={styles.divider} />

        {/* Field Operations */}
        <Text style={styles.sectionTitle}>FIELD OPERATIONS</Text>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Diary')}>
          <Icon name="notebook" size={22} color={nordicColors.secondary} />
          <Text style={styles.menuText}>Diary</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>RT 16-10660</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Inspection')}>
          <Icon name="clipboard-check" size={22} color={nordicColors.secondary} />
          <Text style={styles.menuText}>Inspection</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('CarbonReport')}
        >
          <Icon name="leaf" size={22} color={nordicColors.success} />
          <Text style={styles.menuText}>Carbon Report</Text>
          <View style={[styles.badge, styles.badgeSuccess]}>
            <Text style={styles.badgeText}>Fit for 55</Text>
          </View>
        </TouchableOpacity>

        <Divider style={styles.divider} />

        {/* Command Centers */}
        <Text style={styles.sectionTitle}>COMMAND CENTERS</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ControlRoom')}
        >
          <Icon name="monitor-dashboard" size={22} color={nordicColors.secondary} />
          <Text style={styles.menuText}>Control Room</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('SituationRoom')}
        >
          <Icon name="shield-crown" size={22} color={nordicColors.primaryDark} />
          <Text style={styles.menuText}>Situation Room</Text>
        </TouchableOpacity>

        <Divider style={styles.divider} />

        {/* Settings */}
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
          <Icon name="cog" size={22} color={nordicColors.textSecondary} />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={styles.drawerFooter}>
        <View style={styles.flagsContainer}>
          <Text style={styles.flag}>🇸🇪</Text>
          <Text style={styles.flag}>🇳🇴</Text>
          <Text style={styles.flag}>🇫🇮</Text>
          <Text style={styles.flag}>🇩🇰</Text>
        </View>
        <Text style={styles.footerText}>Nordic Excellence</Text>
        <Text style={styles.versionText}>Lifetime Oy · 2026</Text>
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
        name="Alerts"
        component={AlertsScreen}
        options={{ title: 'Portfolio Alerts' }}
      />
      <Drawer.Screen
        name="Omnichannel"
        component={OmnichannelScreen}
        options={{ title: 'Omnichannel' }}
      />
      <Drawer.Screen
        name="Automation"
        component={AutomationScreen}
        options={{ title: 'Automation' }}
      />
      <Drawer.Screen name="Report" component={ReportScreen} options={{ title: 'Report Engine' }} />
      <Drawer.Screen name="Diary" component={DiaryScreen} options={{ title: 'Diary' }} />
      <Drawer.Screen
        name="Inspection"
        component={InspectionScreen}
        options={{ title: 'Inspection' }}
      />
      <Drawer.Screen
        name="CarbonReport"
        component={CarbonReportScreen}
        options={{ title: 'Carbon Report' }}
      />
      <Drawer.Screen
        name="ControlRoom"
        component={ControlRoomScreen}
        options={{ title: 'Control Room' }}
      />
      <Drawer.Screen
        name="SituationRoom"
        component={SituationRoomScreen}
        options={{ title: 'Situation Room' }}
      />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
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
  headerVersion: {
    fontSize: 10,
    color: nordicColors.accent,
    fontWeight: '700',
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
