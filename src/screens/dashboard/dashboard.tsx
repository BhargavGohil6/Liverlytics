import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator
} from 'react-native';
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
import { Navigation } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchDashboardData } from './slices/DashboardSlices';
import {colors,font} from '../../theme/index';
import CommonButton from '../../components/CommonButton';

export default function Dashboard() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);
  const { user } = useSelector((state: RootState) => state.auth);

  // Fetch dashboard data on mount
  useEffect(() => {
    if (user?.email) {
      dispatch(fetchDashboardData({ email: user.email }));
    } else {
      // Fallback email for testing
      dispatch(fetchDashboardData({ email: 'pareshwaghela18mukesoft@gmail.com' }));
    }
  }, [dispatch, user]);

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading Dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <CommonButton
            title="Retry"
            onPress={() => dispatch(fetchDashboardData({ email: user?.email || 'pareshwaghela18mukesoft@gmail.com' }))}
            bgColor={colors.primary}
            textColor={colors.white}
            paddingVertical={responsive.padding(10)}
            fontSize={font.base}
            radius={responsive.borderRadius(8)}
          />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* <View style={styles.logo}> */}
            <Image
                    source={require('../../assets/Transparent 1.png')}
                    style={styles.image}
                  />
          {/* </View> */}
          {/* <Text style={styles.logoText}>Liverlytics</Text> */}
        </View>
        <View style={styles.headerRight}>
          <View style={styles.premiumBadge}>
            <SpaceIcon size={14} color="#666" />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
          <View style={styles.avatar}>
            <User size={20} color="#666" />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.title}>Good Morning — Here's your health summary.</Text>
        <Text style={styles.subtitle}>Data shown is a snapshot. Tap any card to view details.</Text>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard} onPress={()=>navigation.navigate('LabReportDetailsScreen')}>
            <View style={styles.actionIcon}>
              <TestTube size={20} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>Add{'\n'}Lab Data</Text>
            <Text style={styles.actionSubtext}>MELD inputs</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={()=>navigation.navigate('DietFluidsScreen')}>
            <View style={styles.actionIcon}>
              <Utensils size={20} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>Add{'\n'}Diet Entry</Text>
            <Text style={styles.actionSubtext}>Sodium &{'\n'}intake</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <FileText size={20} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>Add{'\n'}Notes</Text>
            <Text style={styles.actionSubtext}>Symptoms &{'\n'}reminders</Text>
          </TouchableOpacity>
        </View>

        {/* Flags Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <Flag size={20} color="#333" />
              <Text style={styles.sectionTitleText}>Flags</Text>
            </View>
            <Text style={styles.sectionBadge}>Attention</Text>
          </View>

          <View style={styles.flagCard}>
            <Text style={styles.flagText}>Missed evening medication yesterday.</Text>
          </View>
          <View style={styles.flagCard}>
            <Text style={styles.flagText}>BP trending near upper range.</Text>
          </View>
        </View>

        {/* Vitals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <Activity size={20} color="#333" />
              <Text style={styles.sectionTitleText}>Vitals</Text>
            </View>
            <Text style={styles.sectionTime}>Today</Text>
          </View>
<TouchableOpacity onPress={()=>navigation.navigate('VitalsOverviewScreen')}>
          <View style={styles.card}>
            <View style={styles.vitalRow}>
              <View style={styles.vitalItem}>
                <Text style={styles.vitalLabel}>BP:</Text>
                <Text style={styles.vitalValue}>{data?.vital?.blood_pressure || '0/0'}</Text>
              </View>
              <View style={styles.vitalItem}>
                <Text style={styles.vitalLabel}>SPO2:</Text>
                <Text style={styles.vitalValue}>{data?.vital?.spo2 || 0}</Text>
              </View>
            </View>
            <View style={styles.vitalRow}>
              <View style={styles.vitalItem}>
                <Text style={styles.vitalLabel}>Weight:</Text>
                <Text style={styles.vitalValue}>{data?.vital?.weight ? `${data.vital.weight} kg` : '0 kg'}</Text>
              </View>
              <View style={styles.vitalItem}>
                <Text style={styles.vitalLabel}>Heart Rate:</Text>
                <Text style={styles.vitalValue}>{data?.vital?.heart_rate ? `${data.vital.heart_rate} bpm` : '0 bpm'}</Text>
              </View>
            </View>
            <View style={styles.cardActions}>
              <View style={{flex: 1}}>
                <CommonButton 
                  title="Add / Update" 
                  onPress={()=>navigation.navigate('AddVitalsScreen')}
                  bgColor={colors.primary}
                  textColor={colors.white}
                  paddingVertical={responsive.padding(10)}
                  fontSize={font.base}
                  radius={responsive.borderRadius(8)}
                />
              </View>
              <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('VitalsHistoryScreen')}>
                <History size={16} color={colors.gray666} />
                <Text style={styles.historyButtonText}>Vitals History</Text>
              </TouchableOpacity>
            </View>
          </View>
          </TouchableOpacity> 
        </View>

        {/* MELD Score Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <Scale size={20} color="#333" />
              <Text style={styles.sectionTitleText}>MELD Score</Text>
            </View>
            <Text style={styles.meldScore}>Latest: {data?.meld?.inr || 0}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.updateText}>Last updated {data?.meld?.creation ? new Date(data.meld.creation).toLocaleDateString() : '2d ago'}</Text>
            <View style={styles.meldTags}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Bilirubin: {data?.meld?.total_bilirubin || 0}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>INR: {data?.meld?.inr || 0}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Creatinine: {data?.meld?.serum_creatinine || 0}</Text>
              </View>
            </View>
            <View style={styles.cardActions}>
              <View style={{flex: 1}}>
                <CommonButton 
                  title="Add / Update" 
                  onPress={()=>navigation.navigate('MELDDataEntryScreen')}
                  bgColor={colors.primary}
                  textColor={colors.white}
                  paddingVertical={responsive.padding(10)}
                  fontSize={font.base}
                  radius={responsive.borderRadius(8)}
                />
              </View>
              <TouchableOpacity style={styles.historyButton} onPress={()=>navigation.navigate('MELDHistoryScreen')}>
                <History size={16} color={colors.gray666} />
                <Text style={styles.historyButtonText}>MELD History</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Diet & Fluids Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <Droplet size={20} color="#333" />
              <Text style={styles.sectionTitleText}>Diet & Fluids</Text>
            </View>
            <Text style={styles.sectionTime}>Today</Text>
          </View>
          <TouchableOpacity onPress={()=>navigation.navigate('DietFluidsScreen')}>
          <View style={styles.card}>
            <View style={styles.dietRow}>
              <Text style={styles.dietLabel}>Sodium: <Text style={styles.dietValue}>{data?.diet?.sodium ? `${data.diet.sodium} mg` : '0 mg'}</Text></Text>
              <Text style={styles.dietLabel}>Fluids: <Text style={styles.dietValue}>{data?.diet?.fluid_ml ? `${data.diet.fluid_ml} mL` : '0 mL'}</Text></Text>
            </View>
          </View>
          </TouchableOpacity>
        </View>

        {/* Exercise Section */}
        <TouchableOpacity onPress={()=>navigation.navigate('ExerciseActivityScreen')}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <Heart size={20} color="#333" />
              <Text style={styles.sectionTitleText}>Exercise</Text>
            </View>
            <Text style={styles.sectionTime}>Today</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.exerciseRow}>
              <Text style={styles.exerciseLabel}>Steps: <Text style={styles.exerciseValue}>{data?.exercise?.steps || data?.vital?.steps || 0}</Text></Text>
              <Text style={styles.exerciseLabel}>Rest HR: <Text style={styles.exerciseValue}>{data?.exercise?.resting_hr || 0} bpm</Text></Text>
            </View>
            <View style={styles.exerciseRow}>
              <Text style={styles.exerciseLabel}>Sleep: <Text style={styles.exerciseValue}>{data?.exercise?.sleep_minutes || data?.vital?.sleep || 0} min</Text></Text>
            </View>
            <View style={styles.cardActions}>
              <View style={{flex: 1}}>
                <CommonButton 
                  title="Add / Update" 
                  onPress={()=>navigation.navigate('ExerciseActivityScreen')}
                  bgColor={colors.primary}
                  textColor={colors.white}
                  paddingVertical={responsive.padding(10)}
                  fontSize={font.base}
                  radius={responsive.borderRadius(8)}
                />
              </View>
              <TouchableOpacity style={styles.historyButton} onPress={()=>navigation.navigate('ExerciseHistoryScreen')}>
                <History size={16} color={colors.gray666} />
                <Text style={styles.historyButtonText}>Exercise History</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </TouchableOpacity>

        {/* Medications Section */}
        <TouchableOpacity onPress={()=>navigation.navigate('MedicationsListScreen')}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <Pill size={20} color="#333" />
              <Text style={styles.sectionTitleText}>Medications</Text>
            </View>
            <Text style={styles.sectionTime}>This week</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.adherenceText}>Medication: {data?.medications?.name1 || '-'}</Text>
            <Text style={styles.adherenceText}>Dose: {data?.medications?.dose || 0} times/day</Text>
            <CommonButton 
              title="Add Medicine" 
              onPress={()=>navigation.navigate('AddMedicationScreen')}
              bgColor={colors.primary}
              textColor={colors.white}
              paddingVertical={responsive.padding(10)}
              fontSize={font.base}
              radius={responsive.borderRadius(8)}
            />
          </View>
        </View>
        </TouchableOpacity>

        {/* AI Insights Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <Sparkles size={20} color="#333" />
              <Text style={styles.sectionTitleText}>AI Insights</Text>
            </View>
            <Text style={styles.sectionTime}>Updated today</Text>
          </View>

          <View style={styles.insightCard}>
            <Text style={styles.insightText}>
              Your BP is trending slightly high this week. Consider a light walk after dinner and reduce sodium intake.
            </Text>
          </View>
        </View>

        {/* Today's Summary */}
        <View style={styles.section}>
          <Text style={styles.summaryTitle}>Today's Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Sodium:</Text>
              <Text style={styles.summaryValue}>{data?.diet?.sodium ? `${data.diet.sodium} mg` : '0 mg'}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Fluids:</Text>
              <Text style={styles.summaryValue}>{data?.diet?.fluid_ml ? `${data.diet.fluid_ml} mL` : '0 mL'}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Steps:</Text>
              <Text style={styles.summaryValue}>{data?.exercise?.steps || data?.vital?.steps || 0}</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>HR:</Text>
            <Text style={styles.summaryValue}>{data?.vital?.heart_rate ? `${data.vital.heart_rate} bpm` : '0 bpm'}</Text>
          </View>
        </View>

       
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
    paddingTop: StatusBar || 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsive.padding(16),
    paddingVertical: responsive.padding(12),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: responsive.width(36),
    height: responsive.height(36),
    borderRadius: responsive.borderRadius(8),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: font.xxl,
    fontWeight: 'bold',
    marginLeft: responsive.margin(8),
    color: colors.darkGray,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.width(4),
    paddingHorizontal: responsive.padding(8),
    paddingVertical: responsive.padding(4),
    backgroundColor: colors.gray100,
    borderRadius: responsive.borderRadius(12),
  },
  premiumText: {
    fontSize: font.sm,
    color: colors.gray666,
    fontWeight: '600',
  },
  avatar: {
    width: responsive.width(32),
    height: responsive.height(32),
    borderRadius: responsive.borderRadius(16),
    backgroundColor: colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: responsive.padding(16),
  },
  title: {
    fontSize: font.h5,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginTop: responsive.margin(20),
    marginBottom: responsive.margin(8),
  },
  subtitle: {
    fontSize: font.base,
    color: colors.gray666,
    marginBottom: responsive.margin(20),
  },
  quickActions: {
    flexDirection: 'row',
    gap: responsive.width(12),
    marginBottom: responsive.margin(24),
  },
  actionCard: {
    flex: 1,
    backgroundColor:colors.whiteFff,
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(12),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: responsive.width(40),
    height: responsive.height(40),
    borderRadius: responsive.borderRadius(8),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsive.margin(8),
  },
  actionLabel: {
    fontSize: font.base,
    fontWeight: '600',
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: responsive.margin(4),
  },
  actionSubtext: {
    fontSize: font.xs,
    color: colors.gray666,
    textAlign: 'center',
  },
  section: {
    marginBottom: responsive.margin(20),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsive.margin(12),
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.width(8),
  },
  sectionTitleText: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.darkGray,
  },
  sectionBadge: {
    fontSize: font.sm,
    color: colors.orange,
    fontWeight: '600',
  },
  sectionTime: {
    fontSize: font.sm,
    color: colors.gray666,
  },
  meldScore: {
    fontSize: font.sm,
    color: colors.gray666,
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
  card: {
    backgroundColor: colors.whiteFff,
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  vitalRow: {
    flexDirection: 'row',
    gap: responsive.width(24),
    marginBottom: responsive.margin(12),
  },
  vitalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.width(8),
  },
  vitalLabel: {
    fontSize: font.base,
    color: colors.gray666,
  },
  vitalValue: {
    fontSize: font.base,
    fontWeight: '600',
    color: colors.darkGray,
    backgroundColor: colors.gray100,
    paddingHorizontal: responsive.padding(8),
    paddingVertical: responsive.padding(4),
    borderRadius: responsive.borderRadius(4),
  },
  cardActions: {
    flexDirection: 'row',
    gap: responsive.width(12),
    marginTop: responsive.margin(12),
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsive.width(6),
    backgroundColor: colors.primary,
    borderRadius: responsive.borderRadius(8),
    paddingVertical: responsive.padding(10),
  },
  addButtonText: {
    color: colors.whiteFff,
    fontSize: font.base,
    fontWeight: '600',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.width(6),
    paddingHorizontal: responsive.padding(12),
  },
  historyButtonText: {
    color: colors.gray666,
    fontSize: font.base,
  },
  updateText: {
    fontSize: font.sm,
    color: colors.gray666,
    marginBottom: responsive.margin(12),
  },
  meldTags: {
    flexDirection: 'row',
    gap: responsive.width(8),
    marginBottom: responsive.margin(12),
  },
  tag: {
    backgroundColor: colors.gray100,
    paddingHorizontal: responsive.padding(12),
    paddingVertical: responsive.padding(6),
    borderRadius: responsive.borderRadius(6),
  },
  tagText: {
    fontSize: font.sm,
    color: colors.gray666,
  },
  dietRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dietLabel: {
    fontSize: font.base,
    color: colors.gray666,
  },
  dietValue: {
    fontWeight: '600',
    color: colors.darkGray,
  },
  exerciseRow: {
    flexDirection: 'row',
    gap: responsive.width(24),
    marginBottom: responsive.margin(8),
  },
  exerciseLabel: {
    fontSize: font.base,
    color: colors.gray666,
  },
  exerciseValue: {
    fontWeight: '600',
    color: colors.darkGray,
  },
  adherenceText: {
    fontSize: font.base,
    color: colors.gray666,
    marginBottom: responsive.margin(12),
  },
  addMedicineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsive.width(6),
    backgroundColor: colors.primary,
    borderRadius: responsive.borderRadius(8),
    paddingVertical: responsive.padding(10),
  },
  insightCard: {
    backgroundColor: colors.tealGreen,
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
  },
  insightText: {
    fontSize: font.base,
    color: colors.white,
    lineHeight: responsive.height(20),
  },
  summaryTitle: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: responsive.margin(12),
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: responsive.width(16),
    marginBottom: responsive.margin(12),
  },
  summaryItem: {
    flex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: responsive.width(8),
  },
  summaryLabel: {
    fontSize: font.base,
    color: colors.gray666,
  },
  summaryValue: {
    fontSize: font.base,
    fontWeight: '600',
    color: colors.darkGray,
  },
  image: {
    width: responsive.width(100),
    height: responsive.height(50),
    // borderRadius: responsive.borderRadius(10),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: responsive.height(16),
  },
  loadingText: {
    fontSize: font.lg,
    color: colors.gray666,
    marginTop: responsive.margin(12),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: responsive.padding(20),
    gap: responsive.height(16),
  },
  errorText: {
    fontSize: font.base,
    color: colors.red,
    textAlign: 'center',
    marginBottom: responsive.margin(20),
  },
});