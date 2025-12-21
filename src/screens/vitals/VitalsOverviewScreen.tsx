import React from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {colors, font} from '../../theme/index';

const { width } = Dimensions.get('window');

export default function VitalsOverviewScreen() {
  
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
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
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={20} color="#333" />
            {/* <Text style={styles.backText}>Back</Text> */}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddVitalsScreen')}>
            <Icon name="plus" size={18} color="#333" />
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
          {/* RHR Card */}
          <View style={styles.vitalCard}>
            <View style={styles.vitalHeader}>
              <View style={styles.vitalHeaderLeft}>
                <Icon name="heart" size={16} color="#333" />
                <Text style={styles.vitalLabel}>RHR</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>normal</Text>
              </View>
            </View>
            <Text style={styles.vitalValue}>72 bpm</Text>
            <Text style={styles.vitalDescription}>Resting Heart Rate</Text>
          </View>

          {/* Steps Card */}
          <View style={styles.vitalCard}>
            <View style={styles.vitalHeader}>
              <View style={styles.vitalHeaderLeft}>
                <MaterialCommunityIcons name="shoe-print" size={16} color="#333" />
                <Text style={styles.vitalLabel}>Steps</Text>
              </View>
              <View style={[styles.statusBadge, styles.statusLow]}>
                <Text style={[styles.statusText, styles.statusTextLow]}>low</Text>
              </View>
            </View>
            <Text style={styles.vitalValue}>2,145</Text>
            <Text style={styles.vitalDescription}>Steps Today</Text>
          </View>

          {/* Sleep Card */}
          <View style={styles.vitalCard}>
            <View style={styles.vitalHeader}>
              <View style={styles.vitalHeaderLeft}>
                <Icon name="moon" size={16} color="#333" />
                <Text style={styles.vitalLabel}>Sleep</Text>
              </View>
              <Text style={styles.timeText}>6h 20m</Text>
            </View>
            <Text style={styles.vitalValue}>6h 20m</Text>
            <Text style={styles.vitalDescription}>Last Night</Text>
          </View>

          {/* SpO2 Card */}
          <View style={styles.vitalCard}>
            <View style={styles.vitalHeader}>
              <View style={styles.vitalHeaderLeft}>
                <MaterialCommunityIcons name="water-percent" size={16} color="#333" />
                <Text style={styles.vitalLabel}>SpO₂</Text>
              </View>
              <View style={[styles.statusBadge, styles.statusCheck]}>
                <Text style={[styles.statusText, styles.statusTextCheck]}>check</Text>
              </View>
            </View>
            <Text style={styles.vitalValue}>93%</Text>
            <Text style={styles.vitalDescription}>Oxygen Saturation</Text>
          </View>

          {/* Weight Card */}
          <View style={styles.vitalCard}>
            <View style={styles.vitalHeader}>
              <View style={styles.vitalHeaderLeft}>
                <Icon name="shopping-bag" size={16} color="#333" />
                <Text style={styles.vitalLabel}>Weight</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>stable</Text>
              </View>
            </View>
            <Text style={styles.vitalValue}>72.8 kg</Text>
            <Text style={styles.vitalDescription}>Body Weight</Text>
          </View>

          {/* BP Card */}
          <View style={styles.vitalCard}>
            <View style={styles.vitalHeader}>
              <View style={styles.vitalHeaderLeft}>
                <Icon name="activity" size={16} color="#333" />
                <Text style={styles.vitalLabel}>BP</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>normal</Text>
              </View>
            </View>
            <Text style={styles.vitalValue}>118/76</Text>
            <Text style={styles.vitalDescription}>Blood Pressure</Text>
          </View>
        </View>

        {/* Recent Trends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Trends</Text>
          
          <View style={styles.trendCard}>
            <Icon name="trending-up" size={16} color="#FF9800" />
            <Text style={styles.trendText}>RHR elevated 3 days</Text>
          </View>

          <View style={styles.trendsRow}>
            <View style={[styles.trendCard, styles.trendCardHalf]}>
              <Icon name="trending-down" size={16} color="#4CAF50" />
              <Text style={styles.trendText}>Sleep lower than usual</Text>
            </View>
            
            <View style={[styles.trendCard, styles.trendCardHalf]}>
              <Icon name="arrow-up" size={16} color="#FF9800" />
              <Text style={styles.trendText}>+1.2 kg in 24h</Text>
            </View>
          </View>
        </View>

        {/* Mini Charts */}
        <View style={styles.section}>
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
        </View>

        {/* Warning Alert */}
        <View style={styles.warningCard}>
          <Icon name="alert-triangle" size={20} color="#F57C00" />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Low SpO₂ detected</Text>
            <Text style={styles.warningText}>
              93% recorded. If you feel unwell, rest and recheck in 15 minutes.
            </Text>
          </View>
        </View>

        {/* No Warnings Card */}
        <View style={styles.noWarningsCard}>
          <Icon name="shield" size={20} color="#666" />
          <View style={styles.noWarningsContent}>
            <Text style={styles.noWarningsTitle}>No current warnings</Text>
            <Text style={styles.noWarningsText}>
              We'll notify you if anything needs attention.
            </Text>
          </View>
        </View>

        {/* View All Link */}
        <TouchableOpacity style={styles.viewAllButton} onPress={()=>navigation.navigate('VitalsHistoryScreen')}>
          <Text style={styles.viewAllText}>View All Vitals History</Text>
          <Icon name="arrow-right" size={16} color="#666" />
        </TouchableOpacity>

        {/* Bottom Section Divider */}
        <View style={styles.divider} />

        {/* Warnings & Flags Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.bottomTitle}>Warnings & Flags</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={()=>navigation.navigate('Dashboard')} >
          <Icon name="home" size={24} color="#999" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={()=>navigation.navigate('VitalsHistoryScreen')} >
          <Icon name="bar-chart-2" size={24} color="#999" />
          <Text style={styles.navText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="clock" size={24} color="#999" />
          <Text style={styles.navText}>Reminders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="user" size={24} color="#999" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 16,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingRight: 12,
  },
  backText: {
    fontSize: font.lg,
    color: colors.darkGray,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.gray100,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addText: {
    fontSize: font.base,
    color: colors.darkGray,
    fontWeight: '600',
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: font.h4,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: font.base,
    color: colors.gray666,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  vitalCard: {
    width: (width - 44) / 2,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  vitalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vitalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vitalLabel: {
    fontSize: font.sm,
    fontWeight: '600',
    color: colors.darkGray,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: colors.grayEFEF,
    borderRadius: 4,
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
  timeText: {
    fontSize: font.xs,
    color: colors.gray666,
  },
  vitalValue: {
    fontSize: font.h5,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: 4,
  },
  vitalDescription: {
    fontSize: font.sm,
    color: colors.gray666,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: font.xl,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: 12,
  },
  trendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  trendsRow: {
    flexDirection: 'row',
    gap: 8,
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
    gap: 12,
  },
  chartCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
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
    marginBottom: 16,
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
    height: 60,
    justifyContent: 'flex-end',
  },
  chartLine: {
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 1.5,
    width: '100%',
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.lightPeach,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: font.md,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: 4,
  },
  warningText: {
    fontSize: font.sm,
    color: colors.darkGray,
    lineHeight: 18,
  },
  noWarningsCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    marginBottom: 4,
  },
  noWarningsText: {
    fontSize: font.sm,
    color: colors.gray666,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginBottom: 24,
  },
  viewAllText: {
    fontSize: font.base,
    color: colors.gray666,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginBottom: 24,
  },
  bottomSection: {
    marginBottom: 20,
  },
  bottomTitle: {
    fontSize: font.xl,
    fontWeight: '700',
    color: colors.darkGray,
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