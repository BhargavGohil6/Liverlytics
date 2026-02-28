import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTodaysVitalsForUser, clearVitalsState, resetVitalsSuccess } from './slices/vitalsSlice';
import CommonLoader from '../../components/CommonLoader';
import colors from '../../theme/color';
import responsive from '../../theme/responsive';
import font from '../../theme/fonts';

const { width } = Dimensions.get('window');

export default function VitalsOverviewScreen() {
  
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { todayData, loading, error } = useSelector((state: any) => state.vitals);
  const { user } = useSelector((state: any) => state.auth);
  const isFocused = useIsFocused();
  
  // Fetch vitals data every time user enters the screen or user email becomes available
  useEffect(() => {
    if (isFocused && user?.email) {
      // Clear any success state when entering this screen
      dispatch(resetVitalsSuccess());
      dispatch(fetchTodaysVitalsForUser() as any);
    }
  }, [isFocused, user?.email, dispatch]);
  


  // Handle error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Dashboard' as never)}>
            <Icon name="arrow-left" size={responsive.fontSize(20)} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddVitalsScreen' as never)}>
            <Icon name="plus" size={responsive.fontSize(18)} color="#333" />
            <Text style={styles.addText}>Add Vitals</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={60} color={colors.orange} />
          <Text style={styles.errorTitle}>Unable to Load Vitals</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => dispatch(fetchTodaysVitalsForUser() as any)}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Extract vital data from the API response
  const vitalData = todayData?.data && Array.isArray(todayData.data) && todayData.data.length > 0 
    ? todayData.data[0] 
    : null;
  
  // Format the vital values for display
  const rhrValue = vitalData?.heart_rate ? `${vitalData.heart_rate} bpm` : '0';
  const glucoseValue = vitalData?.glucose ? `${vitalData.glucose} mg/dL` : '0';
  const sleepValue = vitalData?.sleep ? `${vitalData.sleep}m` : '0';
  const spO2Value = vitalData?.spo2 ? `${vitalData.spo2}%` : '0';
  const weightValue = vitalData?.weight ? `${vitalData.weight} kg` : '0';
  const bpValue = vitalData?.blood_pressure ? `${vitalData.blood_pressure}` : '0';
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Common Loader */}
      <CommonLoader visible={loading} message="Loading vitals data..." />
      
      {/* Header */}
      {/* <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Icon name="trending-up" size={20} color="#fff" />
          </View>
          <Text style={styles.logoText}>Liverlytics</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.vitalsButton}>
            <Text style={styles.vitalsText}>Vitals</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bellIcon}>
            <Icon name="bell" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View> */}

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Dashboard' as never)}>
            <Icon name="arrow-left" size={responsive.fontSize(20)} color="#333" />
            {/* <Text style={styles.backText}>Back</Text> */}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddVitalsScreen' as never)}>
            <Icon name="plus" size={responsive.fontSize(18)} color={colors.white} />
            <Text style={styles.addText}>Add Vitals</Text>
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Vitals Overview</Text>
          <Text style={styles.subtitle}>Latest readings and tracked trends</Text>
        </View>

        {/* Vitals Grid */}
        <View style={styles.vitalsGrid}>
          {/* RHR Card - Clickable */}
          <TouchableOpacity 
            style={styles.vitalCard}
            onPress={() => navigation.navigate('RHRChartScreen' as never)}
          >
            <View style={styles.vitalHeader}>
              <View style={styles.vitalHeaderLeft}>
                <Icon name="heart" size={responsive.fontSize(16)} color="#333" />
                <Text style={styles.vitalLabel}>RHR</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>normal</Text>
              </View>
            </View>
            <Text style={styles.vitalValue}>{rhrValue}</Text>
            <Text style={styles.vitalDescription}>Resting Heart Rate</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.viewChartText}>View Chart</Text>
              <Icon name="chevron-right" size={responsive.fontSize(14)} color={colors.primary} />
            </View>
          </TouchableOpacity>

          {/* Glucose Card - Clickable */}
          <TouchableOpacity 
            style={styles.vitalCard}
            onPress={() => navigation.navigate('GlucoseChartScreen' as never)}
          >
            <View style={styles.vitalHeader}>
              <View style={styles.vitalHeaderLeft}>
                <MaterialCommunityIcons name="water-percent" size={responsive.fontSize(16)} color="#333" />
                <Text style={styles.vitalLabel}>Glucose</Text>
              </View>
              <View style={[styles.statusBadge, styles.statusNormal]}>
                <Text style={[styles.statusText, styles.statusTextNormal]}>normal</Text>
              </View>
            </View>
            <Text style={styles.vitalValue}>{glucoseValue}</Text>
            <Text style={styles.vitalDescription}>Blood Sugar Level</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.viewChartText}>View Chart</Text>
              <Icon name="chevron-right" size={responsive.fontSize(14)} color={colors.primary} />
            </View>
          </TouchableOpacity>

          {/* Sleep Card - Clickable */}
          <TouchableOpacity 
            style={styles.vitalCard}
            onPress={() => navigation.navigate('SleepChartScreen' as never)}
          >
            <View style={styles.vitalHeader}>
              <View style={styles.vitalHeaderLeft}>
                <Icon name="moon" size={responsive.fontSize(16)} color="#333" />
                <Text style={styles.vitalLabel}>Sleep</Text>
              </View>
              <Text style={styles.timeText}>6h 20m</Text>
            </View>
            <Text style={styles.vitalValue}>{sleepValue}</Text>
            <Text style={styles.vitalDescription}>Last Night</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.viewChartText}>View Chart</Text>
              <Icon name="chevron-right" size={responsive.fontSize(14)} color={colors.primary} />
            </View>
          </TouchableOpacity>

          {/* SpO2 Card - Clickable */}
          <TouchableOpacity 
            style={styles.vitalCard}
            onPress={() => navigation.navigate('SpO2ChartScreen' as never)}
          >
            <View style={styles.vitalHeader}>
              <View style={styles.vitalHeaderLeft}>
                <MaterialCommunityIcons name="water-percent" size={responsive.fontSize(16)} color="#333" />
                <Text style={styles.vitalLabel}>SpO₂</Text>
              </View>
              <View style={[styles.statusBadge, styles.statusCheck]}>
                <Text style={[styles.statusText, styles.statusTextCheck]}>check</Text>
              </View>
            </View>
            <Text style={styles.vitalValue}>{spO2Value}</Text>
            <Text style={styles.vitalDescription}>Oxygen Saturation</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.viewChartText}>View Chart</Text>
              <Icon name="chevron-right" size={responsive.fontSize(14)} color={colors.primary} />
            </View>
          </TouchableOpacity>

          {/* Weight Card - Clickable */}
          <TouchableOpacity 
            style={styles.vitalCard}
            onPress={() => navigation.navigate('WeightChartScreen' as never)}
          >
            <View style={styles.vitalHeader}>
              <View style={styles.vitalHeaderLeft}>
                <Icon name="shopping-bag" size={responsive.fontSize(16)} color="#333" />
                <Text style={styles.vitalLabel}>Weight</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>stable</Text>
              </View>
            </View>
            <Text style={styles.vitalValue}>{weightValue}</Text>
            <Text style={styles.vitalDescription}>Body Weight</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.viewChartText}>View Chart</Text>
              <Icon name="chevron-right" size={responsive.fontSize(14)} color={colors.primary} />
            </View>
          </TouchableOpacity>

          {/* BP Card - Clickable */}
          <TouchableOpacity 
            style={styles.vitalCard}
            onPress={() => navigation.navigate('BPChartScreen' as never)}
          >
            <View style={styles.vitalHeader}>
              <View style={styles.vitalHeaderLeft}>
                <Icon name="activity" size={responsive.fontSize(16)} color="#333" />
                <Text style={styles.vitalLabel}>BP</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>normal</Text>
              </View>
            </View>
            <Text style={styles.vitalValue}>{bpValue}</Text>
            <Text style={styles.vitalDescription}>Blood Pressure</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.viewChartText}>View Chart</Text>
              <Icon name="chevron-right" size={responsive.fontSize(14)} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Trends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Trends</Text>
          
          <View style={styles.trendCard}>
            <Icon name="trending-up" size={responsive.fontSize(16)} color="#FF9800" />
            <Text style={styles.trendText}>RHR elevated 3 days</Text>
          </View>

          <View style={styles.trendsRow}>
            <View style={[styles.trendCard, styles.trendCardHalf]}>
              <Icon name="trending-down" size={responsive.fontSize(16)} color="#4CAF50" />
              <Text style={styles.trendText}>Sleep lower than usual</Text>
            </View>
            
            <View style={[styles.trendCard, styles.trendCardHalf]}>
              <Icon name="arrow-up" size={responsive.fontSize(16)} color="#FF9800" />
              <Text style={styles.trendText}>+1.2 kg in 24h</Text>
            </View>
          </View>
        </View>

        {/* Mini Charts */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vitals Mini Charts</Text>
          
          <View style={styles.chartsRow}>
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartLabel}>Heart Rate</Text>
                <Text style={styles.chartPeriod}>7d</Text>
              </View>
              <View style={styles.chartPlaceholder}>
                <View style={styles.chartLine} />
              </View>
            </View>

            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartLabel}>Sleep Duration</Text>
                <Text style={styles.chartPeriod}>7d</Text>
              </View>
              <View style={styles.chartPlaceholder}>
                <View style={styles.chartLine} />
              </View>
            </View>
          </View>
        </View> */}

        {/* Warning Alert */}
        <View style={styles.warningCard}>
          <Icon name="alert-triangle" size={responsive.fontSize(20)} color="#F57C00" />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Low SpO₂ detected</Text>
            <Text style={styles.warningText}>
              93% recorded. If you feel unwell, rest and recheck in 15 minutes.
            </Text>
          </View>
        </View>

        {/* No Warnings Card */}
        <View style={styles.noWarningsCard}>
          <Icon name="shield" size={responsive.fontSize(20)} color="#666" />
          <View style={styles.noWarningsContent}>
            <Text style={styles.noWarningsTitle}>No current warnings</Text>
            <Text style={styles.noWarningsText}>
              We'll notify you if anything needs attention.
            </Text>
          </View>
        </View>

        {/* View All Link */}
        {/* <TouchableOpacity style={styles.viewAllButton} onPress={()=>navigation.navigate('VitalsHistoryScreen' as never)}>
          <Text style={styles.viewAllText}>View All Vitals History</Text>
          <Icon name="arrow-right" size={responsive.fontSize(16)} color="#666" />
        </TouchableOpacity> */}

        {/* Bottom Section Divider */}
        {/* <View style={styles.divider} /> */}

        {/* Warnings & Flags Section */}
        {/* <View style={styles.bottomSection}>
          <Text style={styles.bottomTitle}>Warnings & Flags</Text>
        </View> */}

      </ScrollView>

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoText: {
    fontSize: font.xl,
    fontWeight: '700',
    color: colors.darkGray,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vitalsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.gray100,
    borderRadius: 6,
  },
  vitalsText: {
    fontSize: font.base,
    color: colors.darkGray,
    fontWeight: '500',
  },
  bellIcon: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: responsive.padding(16),
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsive.padding(16),
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.padding(6),
    paddingVertical: responsive.padding(8),
    paddingRight: responsive.padding(12),
  },
  backText: {
    fontSize: font.lg,
    color: colors.darkGray,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.padding(6),
    backgroundColor: colors.primary,
    paddingHorizontal: responsive.padding(12),
    paddingVertical: responsive.padding(6),
    borderRadius: responsive.borderRadius(8),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  addText: {
    fontSize: font.base,
    color: colors.white,
    fontWeight: '600',
  },
  titleSection: {
    marginBottom: responsive.margin(20),
  },
  title: {
    fontSize: font.h4,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: responsive.margin(4),
  },
  subtitle: {
    fontSize: font.base,
    color: colors.gray666,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: responsive.padding(12),
    marginBottom: responsive.margin(24),
  },
  vitalCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    minWidth: '45%', // For responsive grid on different screen sizes
    maxWidth: '48%', // Ensures proper spacing
  },
  vitalCardTouchable: {
    // Inherits all vitalCard styles plus touch feedback
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: responsive.margin(8),
    gap: responsive.padding(4),
  },
  viewChartText: {
    fontSize: font.xs,
    color: colors.primary,
    fontWeight: '600',
  },
  vitalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsive.margin(12),
  },
  vitalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.padding(6),
  },
  vitalLabel: {
    fontSize: font.sm,
    fontWeight: '600',
    color: colors.darkGray,
  },
  statusBadge: {
    paddingHorizontal: responsive.padding(8),
    paddingVertical: responsive.padding(3),
    backgroundColor: colors.grayEFEF,
    borderRadius: responsive.borderRadius(4),
  },
  statusText: {
    fontSize: font.xs,
    color: colors.gray666,
    fontWeight: '500',
  },
  statusLow: {
    backgroundColor: colors.softLavender,
  },
  statusTextLow: {
    color: colors.orange,
  },
  statusCheck: {
    backgroundColor: colors.mintMist,
  },
  statusTextCheck: {
    color: colors.primary,
  },
  statusNormal: {
    backgroundColor: colors.grayEFEF,
  },
  statusTextNormal: {
    color: colors.gray666,
  },
  timeText: {
    fontSize: font.xs,
    color: colors.gray666,
  },
  vitalValue: {
    fontSize: font.h5,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: responsive.margin(4),
  },
  vitalDescription: {
    fontSize: font.sm,
    color: colors.gray666,
  },
  section: {
    marginBottom: responsive.margin(24),
  },
  sectionTitle: {
    fontSize: font.xl,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: responsive.margin(12),
  },
  trendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.padding(10),
    backgroundColor: colors.white,
    borderRadius: responsive.borderRadius(10),
    padding: responsive.padding(14),
    marginBottom: responsive.margin(8),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  trendsRow: {
    flexDirection: 'row',
    gap: responsive.padding(8),
  },
  trendCardHalf: {
    flex: 1,
    marginBottom: 0,
  },
  trendText: {
    fontSize: font.sm,
    color: colors.darkGray,
    fontWeight: '500',
    flex: 1,
  },
  chartsRow: {
    flexDirection: 'row',
    gap: responsive.padding(12),
  },
  chartCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsive.margin(16),
  },
  chartLabel: {
    fontSize: font.sm,
    fontWeight: '600',
    color: colors.darkGray,
  },
  chartPeriod: {
    fontSize: font.xs,
    color: colors.lightGray,
  },
  chartPlaceholder: {
    height: responsive.height(60),
    justifyContent: 'flex-end',
  },
  chartLine: {
    height: responsive.height(3),
    backgroundColor: colors.primary,
    borderRadius: responsive.borderRadius(1.5),
    width: '100%',
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: responsive.padding(12),
    backgroundColor: colors.lightPeach,
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
    marginBottom: responsive.margin(12),
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: font.md,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: responsive.margin(4),
  },
  warningText: {
    fontSize: font.sm,
    color: colors.darkGray,
    lineHeight: responsive.fontSize(18),
  },
  noWarningsCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: responsive.padding(12),
    backgroundColor: colors.white,
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
    marginBottom: responsive.margin(16),
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  noWarningsContent: {
    flex: 1,
  },
  noWarningsTitle: {
    fontSize: font.md,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: responsive.margin(4),
  },
  noWarningsText: {
    fontSize: font.sm,
    color: colors.gray666,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: responsive.padding(6),
    paddingVertical: responsive.padding(12),
    marginBottom: responsive.margin(24),
  },
  viewAllText: {
    fontSize: font.base,
    color: colors.gray666,
    fontWeight: '500',
  },
  divider: {
    height: responsive.height(1),
    backgroundColor: colors.gray200,
    marginBottom: responsive.margin(24),
  },
  bottomSection: {
    marginBottom: responsive.margin(20),
  },
  bottomTitle: {
    fontSize: font.xl,
    fontWeight: '700',
    color: colors.darkGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray100,
  },
  loadingText: {
    marginTop: responsive.margin(10),
    fontSize: responsive.fontSize(16),
    color: colors.darkGray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    padding: responsive.padding(20),
  },
  errorTitle: {
    fontSize: responsive.fontSize(18),
    fontWeight: '600',
    color: colors.darkGray,
    marginTop: responsive.margin(10),
    marginBottom: responsive.margin(5),
  },
  errorText: {
    fontSize: responsive.fontSize(14),
    color: colors.gray666,
    textAlign: 'center',
    marginBottom: responsive.margin(20),
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: responsive.padding(20),
    paddingVertical: responsive.padding(10),
    borderRadius: responsive.borderRadius(8),
  },
  retryText: {
    color: colors.white,
    fontSize: responsive.fontSize(14),
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingVertical: 8,
    paddingBottom: 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: font.xs,
    color: colors.lightGray,
    marginTop: 4,
    fontWeight: '500',
  },
});