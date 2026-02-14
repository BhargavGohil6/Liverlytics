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
import responsive from '../../theme/responsive'; 
import {colors,font} from '../../theme/index';
import { useEffect } from 'react';
import api from '../../services/api';
import { ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';

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

interface WebAlert {
  type: string;
  status: string;
  message: string;
  alert_flag?: number;
  threshold?: number;
  flag?: number;
  weight_gain?: number;
  continuous_rise?: boolean;
  source?: string;
  from_score?: number;
  to_score?: number;
  meld_na?: number;
  difference?: number;
  days_ago?: string;
  time?: string;
  severity?: string;
  alert?: any;
}

// Static data removed after API implementation

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
  // {
  //   id: '6',
  //   title: 'Medication dose reminders',
  //   description: '08:00 20:00 • Tied to Medications module',
  //   badge: '',
  //   enabled: true,
  // },
];

const RemindersAlert = () => {
  const [reminders, setReminders] = useState(remindersData);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  
  // Get logged-in user's email from Redux store
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    fetchAlerts();
  }, [user]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      // Use the logged-in user's email instead of hardcoded email
      const userEmail = user?.email || ''; // Fallback to default email if user data not available
      const response = await api.get(`cirrhosis_custom.notification_alert.get_all_health_alerts?user=${userEmail}`);
      
      if (response.data?.message?.status === 'success') {
        const webAlerts: WebAlert[] = response.data.message.alerts;
        const mappedAlerts: AlertItem[] = webAlerts.map((alert, index) => {
          const config = getAlertIconConfig(alert.type);
          return {
            id: index.toString(),
            icon: config.icon,
            iconType: config.iconType,
            iconColor: config.iconColor,
            iconBg: config.iconBg,
            title: alert.type,
            description: alert.message,
            source: alert.source || 'N/A',
            badge: alert.severity || (alert.alert_flag === 1 ? 'High' : ''),
            badgeColor: getSeverityColor(alert.severity || (alert.alert_flag === 1 ? 'High' : '')),
          };
        });
        setAlerts(mappedAlerts);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertIconConfig = (type: string) => {
    switch (type) {
      case 'Weight':
        return {
          icon: 'scale',
          iconType: 'MaterialCommunityIcons' as const,
          iconColor: '#3B82F6',
          iconBg: '#EFF6FF',
        };
      case 'Resting HR':
        return {
          icon: 'heart-pulse',
          iconType: 'MaterialCommunityIcons' as const,
          iconColor: '#EF4444',
          iconBg: '#FEF2F2',
        };
      case 'Sodium':
        return {
          icon: 'food-apple',
          iconType: 'MaterialCommunityIcons' as const,
          iconColor: '#F97316',
          iconBg: '#FFF7ED',
        };
      case 'MELD Latest':
      case 'MELD Alert':
        return {
          icon: 'trending-up',
          iconType: 'MaterialCommunityIcons' as const,
          iconColor: '#8B5CF6',
          iconBg: '#F5F3FF',
        };
      case 'Medication':
        return {
          icon: 'pill',
          iconType: 'MaterialCommunityIcons' as const,
          iconColor: '#10B981',
          iconBg: '#ECFDF5',
        };
      default:
        return {
          icon: 'alert-circle',
          iconType: 'MaterialCommunityIcons' as const,
          iconColor: '#6B7280',
          iconBg: '#F3F4F6',
        };
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'normal':
        return '#3B82F6';
      default:
        return '#F59E0B';
    }
  };

  const handleAlertPress = (alert: AlertItem) => {
    // Navigate based on alert type
    switch (alert.title) {
      case 'Weight':
        // Navigate to weight tracking/vitals
        (navigation as any).navigate('Vitals', { screen: 'WeightChartScreen' });
        break;
      case 'Resting HR':
        // Navigate to heart rate monitoring
        (navigation as any).navigate('Vitals', { screen: 'RHRChartScreen' });
        break;
      case 'Sodium':
        // Navigate to diet and fluids
        (navigation as any).navigate('DietFluidsScreen');
        break;
      case 'MELD Latest':
      case 'MELD Alert':
        // Navigate to MELD calculator or reports
        (navigation as any).navigate('ReportsScreen');
        break;
      case 'Medication':
        // Navigate to medications list
        (navigation as any).navigate('MedicationsListScreen');
        break;
      default:
        // Default to dashboard for unknown alert types
        (navigation as any).navigate('Dashboard');
        break;
    }
  };

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
          <Text style={styles.sectionTitle}>Active Alerts & Flags </Text>
          <Text style={styles.sectionSubtitle}>
            AI detections on vitals, ranges, diet, sleep events
          </Text>

          {/* Flags Section - styled like Your Reminders */}
          {/* <View style={styles.remindersSectionHeaderRow}>
            <Flag size={20} color="#333" />
            <Text style={styles.remindersSectionTitle}>Flags</Text>
          </View>
          <Text style={styles.remindersSectionSubtitle}>
            Important alerts requiring your attention.
          </Text> */}

          {/* <View style={styles.reminderCard}>
            <View style={styles.reminderContent}>
              <View style={styles.reminderTextContainer}>
                <View style={styles.alertHeader}>
                  <View style={[styles.alertIconContainer, {backgroundColor: '#FEF3C7'}]}>
                    <Flag size={18} color="#F59E0B" />
                  </View>
                  <View>
                    <Text style={styles.reminderTitle}>Missed evening medication yesterday</Text>
                    <Text style={styles.reminderDescription}>Action required: Take missed dose or consult your doctor</Text>
                  </View>
                  <View style={styles.overdueBadge}>
                  <Text style={styles.overdueBadgeText}>Attention</Text>
                </View>
                </View>
                
              </View>
            </View>
          </View> */}
          
          <TouchableOpacity 
            style={styles.reminderCard}
            onPress={() => (navigation as any).navigate('Vitals', { screen: 'BPChartScreen' })}
          >
            <View style={styles.reminderContent}>
              <View style={styles.reminderTextContainer}>
                <View style={styles.alertHeader}>
                  <View style={[styles.alertIconContainer, {backgroundColor: '#FEF3C7'}]}>
                    <Flag size={18} color="#F59E0B" />
                  </View>
                  <View>
                    <Text style={styles.reminderTitle}>BP trending near upper range</Text>
                    <Text style={styles.reminderDescription}>Monitor blood pressure closely and follow prescribed regimen</Text>
                  </View>
                  <View style={styles.overdueBadge}>
                  <Text style={styles.overdueBadgeText}>Warning</Text>
                </View>
                </View>
                
              </View>
            </View>
          </TouchableOpacity>

          {/* Alert Cards */}
          {loading ? (
            <ActivityIndicator size="large" color="#52ab3c" style={{ marginVertical: 20 }} />
          ) : alerts.length > 0 ? (
            alerts.map(alert => (
              <TouchableOpacity 
                key={alert.id} 
                style={styles.alertCard}
                onPress={() => handleAlertPress(alert)}
              >
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
                  <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    {alert.badge !== '' && (
                      <View
                        style={[
                          styles.badge,
                          {backgroundColor: alert.badgeColor, marginLeft: 8},
                        ]}>
                        <Text style={styles.badgeText}>{alert.badge}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={styles.alertDescription}>{alert.description}</Text>
                <View style={styles.alertFooter}>
                  <Text style={styles.alertSource}>Source: {alert.source}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ textAlign: 'center', color: '#6B7280', marginVertical: 20 }}>No active alerts</Text>
          )}
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
    flexWrap: 'wrap',
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
  remindersSectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
   flagCard: {
    backgroundColor: colors.lightPeach,
    borderRadius: responsive.borderRadius(8),
    padding: responsive.padding(12),
    marginBottom: responsive.margin(8),
  },
  flagText: {
    fontSize: font.base,
    color: colors.darkGray,
  },
 
});

export default RemindersAlert;