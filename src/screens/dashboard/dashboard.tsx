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
  ArrowDownRight,
  ArrowUpRight,
  Info,
  Minus
} from 'lucide-react-native';
import responsive from '../../theme/responsive';  
import { Navigation } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchDashboardData } from './slices/DashboardSlices';
import {colors,font} from '../../theme/index';
import CommonButton from '../../components/CommonButton';
import { formatRelativeTime } from '../../utils/timeUtils';

export default function Dashboard() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  
  // Get time of day for greeting
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };
  
  // Redux state
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);
  const { user } = useSelector((state: RootState) => state.auth);

  useFocusEffect(
    React.useCallback(() => {
      if (user?.email) {
        dispatch(fetchDashboardData({ email: user.email }));
      }
    }, [dispatch, user?.email])
  );

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
            onPress={() => dispatch(fetchDashboardData({ email: user?.email || '' }))}
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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../assets/Transparent 1.png')}
            style={styles.logo}
            resizeMode="cover"
          />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.bellIcon} onPress={() => navigation.navigate('Reminders')}>
            <Bell size={20} color="#333" />
            {/* <Text style={styles.reminderText}>Reminders</Text> */}
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.avatar}> */}
            {/* <Image
              source={{ uri: user?.avatar || 'https://via.placeholder.com/40' }}
              style={styles.avatarImage}
            /> */}
            {/* <User size={25} color="#666" />

          </TouchableOpacity> */}
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* AI Insights Section */}
        {data?.ai_insights && data.ai_insights.status !== 'no_ai_insights' && (
          <View style={styles.newAiInsightsCard}>
            <View style={styles.insightsHeader}>
              <View style={styles.sectionTitleRow}>
                <Sparkles size={20} color="#1A1A1A" />
                <Text style={styles.newInsightsTitle}>AI Insights</Text>
              </View>
              {/* <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>{formatRelativeTime(data?.ai_insights?.timestamp || '')}</Text>
              </View> */}
            </View>

            <View style={styles.newInsightBox}>
              {/* Sodium Insight */}
              {data?.ai_insights?.sodium && (
                <View style={[styles.insightItem, { backgroundColor: '#FFF8E1' }]}>
                  <ArrowUpRight size={22} color="#FBC02D" style={styles.insightIcon} />
                  <View style={styles.insightContent}>
                    <Text style={[styles.insightItemText, { color: '#FBC02D' }]}>Sodium</Text>
                    <Text style={styles.insightItemSubText}>{data.ai_insights.sodium}</Text>
                  </View>
                </View>
              )}

              {/* Blood Pressure Insight */}
              {data?.ai_insights?.blood_pressure && (
                <View style={[styles.insightItem, { backgroundColor: '#E8F5E9' }]}>              
                  <Minus size={22} color="#43A047" style={styles.insightIcon} />
                  <View style={styles.insightContent}>
                    <Text style={[styles.insightItemText, { color: '#43A047' }]}>Blood Pressure</Text>
                    <Text style={styles.insightItemSubText}>{data.ai_insights.blood_pressure}</Text>
                  </View>
                </View>
              )}

              {/* Heart Rate Insight */}
              {data?.ai_insights?.heart_rate && (
                <View style={[styles.insightItem, { backgroundColor: '#FEECEE' }]}>
                  <ArrowDownRight size={22} color="#D32F2F" style={styles.insightIcon} />
                  <View style={styles.insightContent}>
                    <Text style={[styles.insightItemText, { color: '#D32F2F' }]}>Heart Rate</Text>
                    <Text style={styles.insightItemSubText}>{data.ai_insights.heart_rate}</Text>
                  </View>
                </View>
              )}

              {/* Main AI Insights Summary */}
              {data?.ai_insights?.ai_insights && (
                <View style={[styles.insightItem, { backgroundColor: '#F3E5F5' }]}>
                  <Sparkles size={22} color="#7B1FA2" style={styles.insightIcon} />
                  <View style={styles.insightContent}>
                    <Text style={[styles.insightItemText, { color: '#7B1FA2' }]}>Overall Summary</Text>
                    <Text style={styles.insightItemSubText}>{data.ai_insights.ai_insights}</Text>
                  </View>
                </View>
              )}

              <Text style={styles.disclaimerText}>These insights are informational only and not a diagnosis.</Text>
            </View>
          </View>
        )}
        {/* Quick Actions - Top */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => navigation.navigate('UploadLabReportScreen')}
          >
            <View style={[styles.actionIconWrapper, { backgroundColor: '#E8F5E9' }]}>
              <TestTube size={28} color="#4CAF50" />
            </View>
            <Text style={styles.actionTitle}>Add{'\n'}Lab Data</Text>
            <Text style={styles.actionSubtitle}>MELD inputs</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => navigation.navigate('DietFluidsScreen')}
          >
            <View style={[styles.actionIconWrapper, { backgroundColor: '#FFF3E0' }]}>
              <Utensils size={28} color="#FF9800" />
            </View>
            <Text style={styles.actionTitle}>Add{'\n'}Diet Entry</Text>
            <Text style={styles.actionSubtitle}>Sodium & intake</Text>
          </TouchableOpacity>
        </View>

        {/* Vitals Section */}
        <TouchableOpacity 
          style={styles.sectionCard}
          onPress={() => {
            navigation.navigate('Vitals', { screen: 'VitalsOverview' });
          }}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Activity size={20} color="#333" />
              <Text style={styles.sectionTitle}>Vitals</Text>
            </View>
            <Text style={styles.sectionTime}>{formatRelativeTime(data?.vital?.duration || data?.vital?.date || '')}</Text>
          </View>

          <View style={styles.vitalsList}>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>BP: <Text style={styles.vitalValue}>{data?.vital?.blood_pressure || ''}</Text></Text>
            </View>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>RHR: <Text style={styles.vitalValue}>{data?.vital?.resting_heart_rate || ''} bpm</Text></Text>
            </View>
            <View style={styles.vitalItemFull}>
              <Text style={styles.vitalLabel}>Oxygen: <Text style={styles.vitalValue}>{data?.vital?.spo2 ? `${data.vital.spo2} ` : ''}</Text></Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('Vitals', {screen: 'AddVitalsScreen'})}
            >
              <Plus size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.historyButton}
              onPress={() => navigation.navigate('Vitals', { screen: 'VitalsHistoryScreen' })}
            >
              <History size={18} color="#666" />
              <Text style={styles.historyText}>Vitals History</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* MELD Score Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Scale size={20} color="#333" />
              <Text style={styles.sectionTitle}>MELD Score</Text>
            </View>
            <Text style={styles.meldScore}>Latest: {formatRelativeTime(data?.meld?.duration || data?.meld?.creation || '')}</Text>
          </View>

          <Text style={styles.updateText}>Last updated {formatRelativeTime(data?.meld?.duration || data?.meld?.creation || '')}</Text>

          <View style={styles.meldTags}>
            <View style={styles.meldTag}>
              <Text style={styles.meldTagText}>Bilirubin: <Text style={styles.dietValue}>{data?.meld?.total_bilirubin || ''}</Text></Text>
            </View>
            <View style={styles.meldTag}>
              <Text style={styles.meldTagText}>INR: <Text style={styles.dietValue}>{data?.meld?.inr || ''}</Text></Text>
            </View>
            <View style={styles.meldTag}>
              <Text style={styles.meldTagText}>Creatinine : <Text style={styles.dietValue}>{data?.meld?.serum_creatinine || ''}</Text></Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('MELDDataEntryScreen')}
            >
              <Plus size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.historyButton}
              onPress={() => navigation.navigate('MELDHistoryScreen')}
            >
              <History size={18} color="#666" />
              <Text style={styles.historyText}>MELD History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Diet & Fluids Section */}
        <TouchableOpacity 
          style={styles.sectionCard}
          onPress={() => navigation.navigate('DietFluidsScreen')}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Droplet size={20} color="#333" />
              <Text style={styles.sectionTitle}>Diet & Fluids</Text>
            </View>
            {/* <Text style={styles.sectionTime}>{formatRelativeTime(data?.diet?.duration || data?.diet?.creation || '')}</Text> */}
          </View>

          <View style={styles.dietRow}>
            <View style={styles.dietItem}>
              <Text style={styles.dietLabel}>Sodium: <Text style={styles.dietValue}>{data?.diet?.overall_totals?.sodium ? `${data.diet.overall_totals.sodium} g` : '0 g'}</Text></Text>
            </View>
            <View style={styles.dietItem}>
              <Text style={styles.dietLabel}>Fluids: <Text style={styles.dietValue}>{data?.diet?.overall_totals?.fluid_ml ? `${data.diet.overall_totals.fluid_ml} ml` : '0 ml'}</Text></Text>
            </View>
            {/* <View style={styles.dietItem}>
              <Text style={styles.dietLabel}>Fluids: <Text style={styles.dietValue}>{data?.diet?.overall_totals?.fluid_ml ? `${(parseFloat(data.diet.overall_totals.fluid_ml) / 1000).toFixed(1)} L` : '0 L'}</Text></Text>
            </View> */}
            <View style={styles.dietItem}>
              <Text style={styles.dietLabel}>Protein: <Text style={styles.dietValue}>{data?.diet?.overall_totals?.protein ? `${data.diet.overall_totals.protein} g` : '0 g'}</Text></Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Exercise Section */}
        <TouchableOpacity 
          style={styles.sectionCard}
          onPress={() => navigation.navigate('ExerciseActivityScreen')}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Activity size={20} color="#333" />
              <Text style={styles.sectionTitle}>Exercise</Text>
            </View>
            <Text style={styles.sectionTime}>{formatRelativeTime(data?.exercise?.duration || data?.exercise?.date || '')}</Text>
          </View>

          <View style={styles.exerciseList}>
            <View style={styles.exerciseItem}>
              <Text style={styles.exerciseLabel}>Steps: <Text style={styles.exerciseValue}>{data?.exercise?.steps || data?.vital?.steps || '0'}</Text></Text>
            </View>
            <View style={styles.exerciseItem}>
              <Text style={styles.exerciseLabel}>Rest HR: <Text style={styles.exerciseValue}>{data?.exercise?.resting_hr || '0'} bpm</Text></Text>
            </View>
            {/* <View style={styles.exerciseItemFull}>
              <Text style={styles.exerciseLabel}>Sleep: <Text style={styles.exerciseValue}>{data?.exercise?.sleep_hours ? `${data.exercise.sleep_hours} hours` : data?.exercise?.sleep_minutes || data?.vital?.sleep || '0'} min</Text></Text>
            </View> */}
          </View>

          <View style={styles.cardFooter}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('ExerciseActivityScreen')}
            >
              <Plus size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.historyButton}
              onPress={() => navigation.navigate('ExerciseHistoryScreen')}
            >
              <History size={18} color="#666" />
              <Text style={styles.historyText}>Exercise History</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsive.padding(16),
    paddingVertical: responsive.padding(12),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: {
    flex: 1,
  },
  logo: {
    width: responsive.width(120),
    height: responsive.height(35),
    // marginTop:responsive.margin(25),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.width(16),
  },
  bellIcon: {
    alignItems: 'center',
  },
  reminderText: {
    fontSize: responsive.fontSize(10),
    color: '#666',
    marginTop: responsive.margin(2),
  },
  avatar: {
    width: responsive.width(40),
    height: responsive.height(40),
    borderRadius: responsive.borderRadius(20),
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollContent: {
    paddingHorizontal: responsive.padding(16),
    paddingTop: responsive.padding(16),
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: responsive.width(12),
    marginBottom: responsive.margin(16),
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconWrapper: {
    width: responsive.width(56),
    height: responsive.height(56),
    borderRadius: responsive.borderRadius(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsive.margin(12),
  },
  actionTitle: {
    fontSize: responsive.fontSize(14),
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: responsive.margin(4),
    lineHeight: responsive.height(18),
  },
  actionSubtitle: {
    fontSize: responsive.fontSize(12),
    color: '#999',
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
    marginBottom: responsive.margin(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsive.margin(16),
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.width(8),
  },
  sectionTitle: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: '#333',
  },
  sectionTime: {
    fontSize: responsive.fontSize(12),
    color: '#999',
  },
  meldScore: {
    fontSize: responsive.fontSize(12),
    color: '#666',
    fontWeight: '600',
  },
  vitalsList: {
    marginBottom: responsive.margin(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.width(8),
    width: responsive.width(310),
    flexWrap: 'wrap', 
    
  },
  vitalItem: {
    backgroundColor: '#F8F8F8',
    paddingVertical: responsive.padding(10),
    paddingHorizontal: responsive.padding(12),
    borderRadius: responsive.borderRadius(8),
    marginBottom: responsive.margin(8),
    // width: responsive.width(90),
  
    justifyContent: 'center',
   
  },
  vitalItemFull: {
    backgroundColor: '#F8F8F8',
    paddingVertical: responsive.padding(10),
    paddingHorizontal: responsive.padding(12),
    borderRadius: responsive.borderRadius(8),
  },
  vitalLabel: {
    fontSize: responsive.fontSize(14),
    color: '#666',
  },
  vitalValue: {
    fontWeight: '600',
    color: '#333',
  },
  updateText: {
    fontSize: responsive.fontSize(12),
    color: '#999',
    marginBottom: responsive.margin(12),
  },
  meldTags: {
    flexDirection: 'row',
    gap: responsive.width(8),
    marginBottom: responsive.margin(16),
    flexWrap: 'wrap',
  },
  meldTag: {
    backgroundColor: '#F8F8F8',
    paddingVertical: responsive.padding(6),
    paddingHorizontal: responsive.padding(12),
    borderRadius: responsive.borderRadius(6),
  },
  meldTagText: {
    fontSize: responsive.fontSize(12),
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.width(12),
  },
  addButton: {
    width: responsive.width(48),
    height: responsive.height(48),
    borderRadius: responsive.borderRadius(24),
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  historyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsive.width(8),
    backgroundColor: '#F8F8F8',
    paddingVertical: responsive.padding(12),
    borderRadius: responsive.borderRadius(8),
  },
  historyText: {
    fontSize: responsive.fontSize(14),
    color: '#666',
    fontWeight: '500',
  },
  dietRow: {
    // flexDirection: 'row',
    // gap: responsive.width(12),
    //  width: responsive.width(310),
    // flexWrap: 'wrap', 
    marginBottom: responsive.margin(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.width(8),
    width: responsive.width(310),
    flexWrap: 'wrap', 
   
  },
  dietItem: {
    // flex: 1,
    // backgroundColor: '#F8F8F8',
    // paddingVertical: responsive.padding(10),
    // paddingHorizontal: responsive.padding(12),
    // borderRadius: responsive.borderRadius(8),
     backgroundColor: '#F8F8F8',
    paddingVertical: responsive.padding(10),
    paddingHorizontal: responsive.padding(12),
    borderRadius: responsive.borderRadius(8),
    marginBottom: responsive.margin(8),
  },
  dietLabel: {
    fontSize: responsive.fontSize(14),
    color: '#666',
  },
  dietValue: {
    fontWeight: '600',
    color: '#333',
  },
  exerciseList: {
    marginBottom: responsive.margin(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.width(8),
    width: responsive.width(310),
    flexWrap: 'wrap', 
  },
  exerciseItem: {
    backgroundColor: '#F8F8F8',
    paddingVertical: responsive.padding(10),
    paddingHorizontal: responsive.padding(12),
    borderRadius: responsive.borderRadius(8),
    marginBottom: responsive.margin(8),
  },
  exerciseItemFull: {
    backgroundColor: '#F8F8F8',
    paddingVertical: responsive.padding(10),
    paddingHorizontal: responsive.padding(12),
    borderRadius: responsive.borderRadius(8),
  },
  exerciseLabel: {
    fontSize: responsive.fontSize(14),
    color: '#666',
  },
  exerciseValue: {
    fontWeight: '600',
    color: '#333',
  },
  newAiInsightsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: responsive.borderRadius(20),
    padding: responsive.padding(18),
    marginBottom: responsive.margin(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  insightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsive.margin(16),
  },
  newInsightsTitle: {
    fontSize: responsive.fontSize(18),
    fontWeight: '700',
    color: '#1A1A1A',
  },
  infoBadge: {
    backgroundColor: '#E1F5FE',
    paddingHorizontal: responsive.padding(10),
    paddingVertical: responsive.padding(4),
    borderRadius: responsive.borderRadius(12),
  },
  infoBadgeText: {
    fontSize: responsive.fontSize(12),
    fontWeight: '600',
    color: '#0288D1',
  },
  newInsightBox: {
    backgroundColor: 'transparent',
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsive.padding(16),
    paddingVertical: responsive.padding(14),
    borderRadius: responsive.borderRadius(16),
    marginBottom: responsive.margin(10),
  },
  insightIcon: {
    marginRight: responsive.margin(12),
  },
  insightContent: {
    flex: 1,
  },
  insightItemText: {
    fontSize: responsive.fontSize(16),
    fontWeight: '700',
    marginBottom: 2,
  },
  insightItemSubText: {
    fontSize: responsive.fontSize(13),
    color: '#666',
    opacity: 0.8,
    lineHeight: responsive.height(18),
    fontWeight: '500',
  },
  disclaimerText: {
    fontSize: responsive.fontSize(12),
    color: '#9E9E9E',
    marginTop: responsive.margin(8),
    textAlign: 'left',
    lineHeight: responsive.height(18),
  },
  bottomSpacing: {
    height: responsive.height(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: responsive.fontSize(16),
    color: '#666',
    marginTop: responsive.margin(12),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: responsive.padding(20),
  },
  errorText: {
    fontSize: responsive.fontSize(14),
    color: '#F44336',
    textAlign: 'center',
    marginBottom: responsive.margin(20),
  },
});