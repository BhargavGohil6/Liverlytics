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
  ChevronRight
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

  // Fetch dashboard data on mount
  useEffect(() => {
    if (user?.email) {
      dispatch(fetchDashboardData({ email: user.email }));
    } else {
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
            <Text style={styles.reminderText}>Reminders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatar}>
            {/* <Image
              source={{ uri: user?.avatar || 'https://via.placeholder.com/40' }}
              style={styles.avatarImage}
            /> */}
            <User size={25} color="#666" />

          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
          onPress={() => navigation.navigate('Vitals')}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Activity size={20} color="#333" />
              <Text style={styles.sectionTitle}>Vitals</Text>
            </View>
            <Text style={styles.sectionTime}>Today</Text>
          </View>

          <View style={styles.vitalsList}>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>BP: <Text style={styles.vitalValue}>{data?.vital?.blood_pressure || '120/80'}</Text></Text>
            </View>
            <View style={styles.vitalItem}>
              <Text style={styles.vitalLabel}>RHR: <Text style={styles.vitalValue}>{data?.vital?.glucose || '98'} mg/dL</Text></Text>
            </View>
            <View style={styles.vitalItemFull}>
              <Text style={styles.vitalLabel}>Oxygen: <Text style={styles.vitalValue}>{data?.vital?.weight ? `${data.vital.weight} kg` : '72 kg'}</Text></Text>
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
            <Text style={styles.meldScore}>Latest: {data?.meld?.inr || '12'}</Text>
          </View>

          <Text style={styles.updateText}>Last updated {data?.meld?.creation ? new Date(data.meld.creation).toLocaleDateString() : '2d ago'}</Text>

          <View style={styles.meldTags}>
            <View style={styles.meldTag}>
              <Text style={styles.meldTagText}>Bilirubin</Text>
            </View>
            <View style={styles.meldTag}>
              <Text style={styles.meldTagText}>INR</Text>
            </View>
            <View style={styles.meldTag}>
              <Text style={styles.meldTagText}>Creatinine</Text>
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
            <Text style={styles.sectionTime}>Today</Text>
          </View>

          <View style={styles.dietRow}>
            <View style={styles.dietItem}>
              <Text style={styles.dietLabel}>Sodium: <Text style={styles.dietValue}>{data?.diet?.sodium ? `${data.diet.sodium} g` : '1.7 g'}</Text></Text>
            </View>
            <View style={styles.dietItem}>
              <Text style={styles.dietLabel}>Fluids: <Text style={styles.dietValue}>{data?.diet?.fluid_ml ? `${(parseFloat(data.diet.fluid_ml) / 1000).toFixed(1)} L` : '1.2 L'}</Text></Text>
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
            <Text style={styles.sectionTime}>Today</Text>
          </View>

          <View style={styles.exerciseList}>
            <View style={styles.exerciseItem}>
              <Text style={styles.exerciseLabel}>Steps: <Text style={styles.exerciseValue}>{data?.exercise?.steps || data?.vital?.steps || '6,420'}</Text></Text>
            </View>
            <View style={styles.exerciseItem}>
              <Text style={styles.exerciseLabel}>Rest HR: <Text style={styles.exerciseValue}>{data?.exercise?.resting_hr || '62'} bpm</Text></Text>
            </View>
            <View style={styles.exerciseItemFull}>
              <Text style={styles.exerciseLabel}>Sleep: <Text style={styles.exerciseValue}>{data?.exercise?.sleep_minutes || data?.vital?.sleep || '410'} min</Text></Text>
            </View>
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

        {/* AI Insights Section */}
        <View style={styles.aiInsightsCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Sparkles size={20} color="#333" />
              <Text style={styles.sectionTitle}>AI Insights</Text>
            </View>
            <Text style={styles.sectionTime}>Updated today</Text>
          </View>

          <View style={styles.insightBox}>
            <Text style={styles.insightText}>
              Your BP is trending slightly high this week. Consider a light walk after dinner and reduce sodium intake.
            </Text>
          </View>
        </View>

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
    height: responsive.height(42),
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
    flexDirection: 'row',
    gap: responsive.width(12),
  },
  dietItem: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingVertical: responsive.padding(10),
    paddingHorizontal: responsive.padding(12),
    borderRadius: responsive.borderRadius(8),
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
  aiInsightsCard: {
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
  insightBox: {
    backgroundColor: '#00796B',
    borderRadius: responsive.borderRadius(8),
    padding: responsive.padding(16),
  },
  insightText: {
    fontSize: responsive.fontSize(14),
    color: '#FFFFFF',
    lineHeight: responsive.height(20),
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