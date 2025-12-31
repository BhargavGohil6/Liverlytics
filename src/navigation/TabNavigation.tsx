import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Home, BarChart3, Bell, User, Heart } from 'lucide-react-native';
import Dashboard from '../screens/dashboard/dashboard';
import ReportsMainScreen from '../screens/reports/ReportsMainScreen';
import RemindersAlertsScreen from '../screens/reminders/RemindersAlertsScreen';
import ProfileMainScreen from '../screens/profile/ProfileMainScreen';
import VitalsStackNavigation from './VitalsStackNavigation';
import { colors, font } from '../theme/index';
import responsive from '../theme/responsive';
import UploadedLabReportsScreen from "../screens/reports/UploadedLabReportsScreen"
import ViewLabReports from "../screens/reports/ViewLabreports";
import MELDDataEntryScreen from "../screens/meld-calculator/MELDDataEntryScreen";


const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.navItem}>
              <Home size={24} color={focused ? colors.primary : colors.lightGray} />
              <Text style={[styles.navText, focused && styles.navTextActive]}>Home</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsMainScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.navItem}>
              <BarChart3 size={24} color={focused ? colors.primary : colors.lightGray} />
              <Text style={[styles.navText, focused && styles.navTextActive]}>Reports</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Reminders"
        component={RemindersAlertsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.navItem}>
              <Bell size={24} color={focused ? colors.primary : colors.lightGray} />
              <Text style={[styles.navText, focused && styles.navTextActive]}>Reminders</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileMainScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.navItem}>
              <User size={24} color={focused ? colors.primary : colors.lightGray} />
              <Text style={[styles.navText, focused && styles.navTextActive]}>Profile</Text>
            </View>
          ),
        }}
      />
     

      <Tab.Screen
        name="Vitals"
        component={VitalsStackNavigation}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      
      <Tab.Screen
        name="UploadedLabReports"
        component={UploadedLabReportsScreen}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ViewLabReports"
        component={ViewLabReports}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="MELDDataEntryScreen"
        component={MELDDataEntryScreen}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingVertical: responsive.padding(8),
    height: responsive.height(60),
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: responsive.padding(4),
  },
  navText: {
    fontSize: font.sm,
    color: colors.lightGray,
    marginTop: responsive.margin(4),
    width: responsive.width(46),
    textAlign: 'center',
    
  },
  navTextActive: {
    color: colors.primary,
    fontWeight: '600',
    width: responsive.width(46),
    textAlign: 'center',
  },
});
