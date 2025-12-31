import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Navigation } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  Activity, 
  Plus, 
  TestTube, 
  Utensils, 
  FileText, 
  Flag, 
  Heart, 
  Scale, 
  Droplet, 
  TrendingUp,
  Pill,
  Sparkles,
  Home,
  BarChart3,
  Bell,
  User,
  History,
  ChevronRight,
  SpaceIcon
} from 'lucide-react-native';

interface AlertItem {
  id: string;
  icon: string;
  iconType: 'MaterialCommunityIcons' | 'MaterialIcons';
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  source: string;
  badge: string;
  badgeColor: string;
}

interface ReminderItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  enabled: boolean;
}

const alertsData: AlertItem[] = [
  {
    id: '1',
    icon: 'water',
    iconType: 'MaterialCommunityIcons',
    iconColor: '#3B82F6',
    iconBg: '#EFF6FF',
    title: 'Weight rising faster than usual — possible fluid retention',
    description: 'Avg ∆ 0.9 kg/day over last 2 days vs usual avg • Today • 07:30',
    source: 'Source: Vitals',
    badge: 'Medium',
    badgeColor: '#F59E0B',
  },
  {
    id: '2',
    icon: 'trending-up',
    iconType: 'MaterialCommunityIcons',
    iconColor: '#EF4444',
    iconBg: '#FEF2F2',
    title: 'Rapid weight gain detected over 48 hrs',
    description: '+ 2 kg in 2 days: baseline 68 kg → 70 kg • Last 2 days • 06:45',
    source: 'Source: Vitals',
    badge: 'High',
    badgeColor: '#EF4444',
  },
  {
    id: '3',
    icon: 'food-apple',
    iconType: 'MaterialCommunityIcons',
    iconColor: '#F97316',
    iconBg: '#FFF7ED',
    title: 'Daily sodium target exceeded',
    description: '3,200 mg logged vs 2,300 mg max threshold • Yesterday • 22:10',
    source: 'Source: Diet',
    badge: 'Medium',
    badgeColor: '#F59E0B',
  },
  {
    id: '4',
    icon: 'heart-pulse',
    iconType: 'MaterialCommunityIcons',
    iconColor: '#EF4444',
    iconBg: '#FEF2F2',
    title: 'Elevated resting heart rate compared to baseline',
    description: 'Resting HR 80 bpm vs baseline 68 bpm • Today • 08:15',
    source: 'Source: Vitals',
    badge: 'Medium',
    badgeColor: '#F59E0B',
  },
  {
    id: '5',
    icon: 'pill',
    iconType: 'MaterialCommunityIcons',
    iconColor: '#8B5CF6',
    iconBg: '#F5F3FF',
    title: 'MELD increased by 3 points since last entry',
    description: 'MELD now 15 • 3 days ago: +30',
    source: 'Source: Labs / MELD',
    badge: 'Medium',
    badgeColor: '#F59E0B',
  },
  {
    id: '6',
    icon: 'alert-circle',
    iconType: 'MaterialCommunityIcons',
    iconColor: '#EF4444',
    iconBg: '#FEF2F2',
    title: 'MELD increased by 5 points — review labs',
    description: 'MELD jumped from 12 → 17 over last 1 week • Last 3 days max 3',
    source: 'Source: Labs / MELD',
    badge: 'High',
    badgeColor: '#EF4444',
  },
  {
    id: '7',
    icon: 'clock-alert',
    iconType: 'MaterialCommunityIcons',
    iconColor: '#F59E0B',
    iconBg: '#FEF3C7',
    title: 'Missed dose window passed',
    description: 'Furosemide missed, no adherence • Yesterday • 21:30',
    source: 'Source: Medications',
    badge: 'Medium',
    badgeColor: '#F59E0B',
  },
  {
    id: '8',
    icon: 'water-percent',
    iconType: 'MaterialCommunityIcons',
    iconColor: '#3B82F6',
    iconBg: '#EFF6FF',
    title: 'Low SpO₂ detected compared to prior baseline',
    description: 'Average SpO₂ 92% vs 96% last week • Ongoing over 3 days',
    source: 'Source: Vitals (A8)',
    badge: '',
    badgeColor: '',
  },
  {
    id: '9',
    icon: 'heart-pulse',
    iconType: 'MaterialCommunityIcons',
    iconColor: '#EF4444',
    iconBg: '#FEF2F2',
    title: 'Sustained + elevated HR pattern — check fatigue',
    description: 'HR sustained 15+ bpm vs baseline • Last 3 days max',
    source: 'Source: Vitals (A8)',
    badge: '',
    badgeColor: '',
  },
  {
    id: '10',
    icon: 'walk',
    iconType: 'MaterialCommunityIcons',
    iconColor: '#10B981',
    iconBg: '#ECFDF5',
    title: 'Steps significantly lower than usual',
    description: 'Average 2,100 steps vs 5,400 typical • Last 3 days',
    source: 'Source: Exercise (A8)',
    badge: '',
    badgeColor: '',
  },
  {
    id: '11',
    icon: 'chart-line',
    iconType: 'MaterialCommunityIcons',
    iconColor: '#6366F1',
    iconBg: '#EEF2FF',
    title: 'Weight trend unusual relative to typical pattern',
    description: 'AI detected mismatch between weight, sleep, and activity • Last 4 days',
    source: 'Source: Vitals & Exercise (A8)',
    badge: '',
    badgeColor: '',
  },
  {
    id: '12',
    icon: 'scale',
    iconType: 'MaterialCommunityIcons',
    iconColor: '#8B5CF6',
    iconBg: '#F5F3FF',
    title: 'INR higher than last report',
    description: 'From 1.3 → 1.9 1 inked to last All spended lab • 4 days ago',
    source: 'Source: Labs (A8)',
    badge: '',
    badgeColor: '',
  },
  {
    id: '13',
    icon: 'alert',
    iconType: 'MaterialCommunityIcons',
    iconColor: '#F59E0B',
    iconBg: '#FEF3C7',
    title: 'ALT/AST ratio trending abnormally',
    description: 'Ratio climbed to 2.1 over past expose • 7 days ago',
    source: 'Source: Labs (A8)',
    badge: '',
    badgeColor: '',
  },
  {
    id: '14',
    icon: 'water-minus',
    iconType: 'MaterialCommunityIcons',
    iconColor: '#3B82F6',
    iconBg: '#EFF6FF',
    title: 'Sodium lower than previous range',
    description: 'Na 130 mmol/L today: 132-138 mmol/L • Last 60 days range',
    source: 'Source: Labs (A8)',
    badge: '',
    badgeColor: '',
  },
  {
    id: '15',
    icon: 'beaker',
    iconType: 'MaterialCommunityIcons',
    iconColor: '#EF4444',
    iconBg: '#FEF2F2',
    title: 'Platelet count unusually reduced',
    description: 'At 95 vs typical 130-160 over last year typical • Last 3 reports',
    source: 'Source: Labs (A8)',
    badge: '',
    badgeColor: '',
  },
];

const remindersData: ReminderItem[] = [
  {
    id: '1',
    title: 'Daily weight check',
    description: '08:00 • Linked to weights trend',
    badge: 'Overdue',
    enabled: true,
  },
  {
    id: '2',
    title: 'Sodium limit reminder',
    description: '21:00 • Evening sodium summary',
    badge: '',
    enabled: true,
  },
  {
    id: '3',
    title: 'Fluid intake reminder',
    description: '10:00 17:00 • Track fluid goal',
    badge: '',
    enabled: true,
  },
  {
    id: '4',
    title: 'Manual vitals check',
    description: '08:30 20:00 • BP, HR (from FR)',
    badge: '',
    enabled: false,
  },
  {
    id: '5',
    title: 'Exercise reminder (walk / light activity)',
    description: '16:00 • Optional short drift stats',
    badge: '',
    enabled: true,
  },
  {
    id: '6',
    title: 'Medication dose reminders',
    description: '08:00 20:00 • Tied to Medications module',
    badge: '',
    enabled: true,
  },
];

const RemindersAlert = () => {
  const [reminders, setReminders] = useState(remindersData);
  const navigation = useNavigation();

  const toggleReminder = (id: string) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id
          ? {...reminder, enabled: !reminder.enabled}
          : reminder,
      ),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      {/* <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Icon name="chart-line" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.logoText}>Liverlytics</Text>
        </View>
      </View> */}

      {/* Navigation Bar */}
      {/* <View style={styles.navBar}>
        <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#374151" /> */}
          {/* <Text style={styles.backText}>Back</Text> */}
        {/* </TouchableOpacity> */}
        {/* <Text style={styles.pageTitle}>Reminders & Alerts</Text> */}
      {/* </View> */}

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Active Alerts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Alerts & Flags</Text>
          <Text style={styles.sectionSubtitle}>
            AI detections on vitals, ranges, diet, sleep, and medication events
          </Text>

          {/* Alert Cards */}
          {alertsData.map(alert => (
            <View key={alert.id} style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <View
                  style={[styles.alertIconContainer, {backgroundColor: alert.iconBg}]}>
                  {alert.iconType === 'MaterialCommunityIcons' ? (
                    <Icon name={alert.icon} size={18} color={alert.iconColor} />
                  ) : (
                    <MaterialIcons
                      name={alert.icon}
                      size={18}
                      color={alert.iconColor}
                    />
                  )}
                </View>
                <Text style={styles.alertTitle}>{alert.title}</Text>
              </View>
              <Text style={styles.alertDescription}>{alert.description}</Text>
              <View style={styles.alertFooter}>
                <Text style={styles.alertSource}>{alert.source}</Text>
                {alert.badge !== '' && (
                  <View
                    style={[
                      styles.badge,
                      {backgroundColor: alert.badgeColor},
                    ]}>
                    <Text style={styles.badgeText}>{alert.badge}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Icon name="information-outline" size={16} color="#6B7280" />
          <Text style={styles.disclaimerText}>
            All AI predictions is informational only and are not FDA diagnostic.
            Discuss with your physician. Do not stop taking any medication without first talking to
            your doctor.
          </Text>
        </View>

        {/* Your Reminders Section */}
        <View style={styles.section}>
          <Text style={styles.remindersSectionTitle}>Your Reminders</Text>
          <Text style={styles.remindersSectionSubtitle}>
            Daily actions and dose reminders you control.
          </Text>

          {/* Reminder Items */}
          {reminders.map(reminder => (
            <View key={reminder.id} style={styles.reminderCard}>
              <View style={styles.reminderContent}>
                <View style={styles.reminderTextContainer}>
                  <Text style={styles.reminderTitle}>{reminder.title}</Text>
                  <Text style={styles.reminderDescription}>
                    {reminder.description}
                  </Text>
                </View>
                {reminder.badge !== '' && (
                  <View style={styles.overdueBadge}>
                    <Text style={styles.overdueBadgeText}>{reminder.badge}</Text>
                  </View>
                )}
                <Switch
                  value={reminder.enabled}
                  onValueChange={() => toggleReminder(reminder.id)}
                  trackColor={{false: '#D1D5DB', true: '#52ab3c'}}
                  thumbColor={reminder.enabled ? '#52ab3c' : '#F3F4F6'}
                  ios_backgroundColor="#D1D5DB"
                />
              </View>
            </View>
          ))}

          {/* Manage Reminders Button */}
          <TouchableOpacity style={styles.manageButton}>
            <Icon name="cog" size={20} color="#FFFFFF" />
            <Text style={styles.manageButtonText}>Manage Reminders</Text>
          </TouchableOpacity>

          {/* Settings Link */}
          <TouchableOpacity style={styles.settingsLink}>
            <Icon name="cog-outline" size={18} color="#6B7280" />
            <Text style={styles.settingsLinkText}>
              Adjust Alert Thresholds in Settings
            </Text>
          </TouchableOpacity>

          {/* Additional Info */}
          <Text style={styles.additionalInfo}>
            Configure weight delta triggers, sodium targets, stacking HR
            patterns, data type reminders, max alerts per day, etc.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
       <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Home size={24} color="#999" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={()=>navigation.navigate('ReportsMainScreen')}>
          <BarChart3 size={24} color="#999" />
          <Text style={styles.navText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={()=>navigation.navigate('RemindersAlertsScreen')}>
          <Bell size={24} color="#52ab3c" />
          <Text style={[styles.navText, styles.navTextActive]}>Reminders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={()=>navigation.navigate('ProfileMainScreen')}>
          <User size={24} color="#999" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#52ab3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.5%'),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 4,
  },
  pageTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingBottom: hp('10%'),
  },
  section: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: hp('2%'),
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  alertIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  alertTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 18,
  },
  alertDescription: {
    fontSize: 11,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 15,
    marginBottom: 8,
    marginLeft: 36,
  },
  alertFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 36,
  },
  alertSource: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    padding: 12,
    marginHorizontal: wp('5%'),
    marginTop: hp('2%'),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  disclaimerText: {
    flex: 1,
    fontSize: 10,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 14,
    marginLeft: 8,
  },
  remindersSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: hp('2%'),
    marginBottom: 4,
  },
  remindersSectionSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: hp('2%'),
  },
  reminderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  reminderTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  reminderDescription: {
    fontSize: 11,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 15,
  },
  overdueBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 12,
  },
  overdueBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#52ab3c',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: hp('2%'),
  },
  manageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  settingsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  settingsLinkText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  additionalInfo: {
    fontSize: 10,
    fontWeight: '400',
    color: '#9CA3AF',
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: wp('5%'),
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  navTextActive: {
    color: '#52ab3c',
    fontWeight: '600',
  },
 
});

export default RemindersAlert;