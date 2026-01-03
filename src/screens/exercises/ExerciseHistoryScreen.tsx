// src/screens/ExerciseHistoryScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LineChart } from 'react-native-chart-kit';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import responsive from '../../theme/responsive';
import colors from '../../theme/color';
import CommonLoader from '../../components/CommonLoader';
import { getExerciseHistory } from './slices/exerciseSlice';

const { width } = Dimensions.get('window');

type ExerciseHistoryScreenProps = {
  navigation: any; // Using 'any' for navigation as per project patterns
};

const ExerciseHistoryScreen = ({ navigation }: ExerciseHistoryScreenProps) => {
  const dispatch: AppDispatch = useDispatch();
  const { history, historyLoading, historyError } = useSelector((state: any) => state.exercise);
  
  const [selectedTab, setSelectedTab] = useState<string>('All');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('This Week');

  interface LogEntry {
    date: string;
    steps: number;
    sleep: string;
    rhr: number;
    synced: boolean;
  }

  const convertMinutesToHours = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  useEffect(() => {
    // Fetch exercise history from API via Redux
    dispatch(getExerciseHistory());
  }, [dispatch]);

  // Transform API data to match UI format
  const logs: LogEntry[] = history && Array.isArray(history) ? history.map((item: any) => ({
    date: item.creation ? new Date(item.creation).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unknown',
    steps: parseInt(item.steps) || 0,
    sleep: convertMinutesToHours(parseInt(item.sleep_minutes) || 0),
    rhr: parseInt(item.resting_hr) || 0,
    synced: true, // Assuming all API data is synced
  })) : [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
      

        {/* Title */}
        <View style={styles.titleSection}>
          <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Go back" accessibilityRole="button">
            <Icon name="arrow-back" size={24} color={colors.darkGray} />
          </TouchableOpacity>
          <View style={styles.titleContent}>
            <Text style={styles.title} accessibilityRole="header">Exercise History</Text>
            <Text style={styles.subtitle}>
              View your steps, sleep, and resting heart rate trends over time.
            </Text>
          </View>
        </View>

        {/* Tabs */}
        {/* <View style={styles.tabsContainer}>
          {['All', 'Steps', 'Sleep', 'Resting HR'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.tabActive]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View> */}

        {/* Period Selector */}
        <View style={styles.periodContainer}>
          {['This Week', 'Last 30 Days', '3 Months', 'Custom Range'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[styles.periodButton, selectedPeriod === period && styles.periodActive]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={styles.periodText}>{period}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Trends Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Icon name="trending-up-outline" size={20} color={colors.darkGray} />
            <Text style={styles.chartTitle}>Trends</Text>
          </View>
          <View style={styles.chartTabs}>
            {['Steps', 'Sleep', 'Resting HR'].map((tab) => (
              <TouchableOpacity accessibilityRole="button" key={tab} style={styles.chartTab}>
                <Text style={styles.chartTabText}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.darkGray }]} />
              <Text style={styles.legendText}>Steps</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.coolGray }]} />
              <Text style={styles.legendText}>Sleep</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.gray200 }]} />
              <Text style={styles.legendText}>RHR</Text>
            </View>
          </View>
          <LineChart
            data={{
              labels: ['', '', '', '', '', '', ''],
              datasets: [{ data: [5, 7, 6, 8, 7, 9, 8] }],
            }}
            width={width - responsive.width(64)}
            height={responsive.height(180)}
            chartConfig={{
              backgroundColor: colors.white,
              backgroundGradientFrom: colors.white,
              backgroundGradientTo: colors.white,
              decimalPlaces: 0,
              color: (opacity = 1) => `${colors.black}00`.replace('00', Math.round(opacity * 255).toString(16).padStart(2, '0')),
              style: { borderRadius: responsive.borderRadius(16) },
            }}
            bezier
            withDots={true}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLabels={false}
            style={styles.chart}
          />
          <View style={styles.trendStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Steps Trend</Text>
              <Text style={styles.statValue}>+12%</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Average Sleep</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Resting HR Trend</Text>
            </View>
          </View>
        </View>

        {/* AI Insights */}
        <View style={styles.insightsCard}>
          <View style={styles.insightsHeader}>
            <Icon name="sparkles" size={20} color={colors.white} />
            <Text style={styles.insightsTitle}>AI Activity Insights</Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightBullet}>•</Text>
            <Text style={styles.insightText}>
              Your steps this week are lower than last week.
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightBullet}>•</Text>
            <Text style={styles.insightText}>
              Sleep duration shows mild downward trend.
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightBullet}>•</Text>
            <Text style={styles.insightText}>
              Resting HR increased on 3 days compared to your baseline.
            </Text>
          </View>
        </View>

        {/* Error message */}
        {historyError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{historyError}</Text>
          </View>
        )}

        {/* Loading state */}
        {historyLoading && <CommonLoader visible={true} message="Loading exercise history..." />}

        {/* Logs */}
        <View style={styles.logsSection}>
          <View style={styles.logsHeader}>
            <Icon name="list-outline" size={20} color={colors.darkGray} />
            <Text style={styles.logsTitle}>Logs</Text>
            <Text style={styles.logsSubtitle}>Chronological • Most recent first</Text>
          </View>

          {!historyLoading && logs.length > 0 && logs.map((log, index) => (
            <View key={index} style={styles.logCard}>
              <View style={styles.logHeader}>
                <Text style={styles.logDate}>{log.date}</Text>
                <Text style={styles.logStatus}>{log.synced ? 'Synced' : 'Manual'}</Text>
              </View>
              <View style={styles.logStats}>
                <Text style={styles.logStat}>Steps: {log.steps}</Text>
                <Text style={styles.logStat}>Sleep: {log.sleep}</Text>
                <Text style={styles.logStat}>RHR: {log.rhr} bpm</Text>
              </View>
              <TouchableOpacity accessibilityRole="button" style={styles.expandButton}>
                <Text style={styles.expandText}>Tap to expand</Text>
              </TouchableOpacity>
            </View>
          ))}
          {!historyLoading && history && history.length === 0 && (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No exercise history found</Text>
            </View>
          )}
        </View>

        {/* Download Buttons */}
        <View style={styles.downloadSection}>
          <TouchableOpacity style={styles.downloadButton} accessibilityLabel="Download CSV" accessibilityRole="button">
            <Icon name="document-outline" size={20} color={colors.darkGray} />
            <Text style={styles.downloadText}>Download CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.downloadButtonPrimary} accessibilityLabel="Download PDF Report" accessibilityRole="button">
            <Icon name="document-text-outline" size={20} color={colors.white} />
            <Text style={styles.downloadTextPrimary}>Download PDF Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  header: {
    backgroundColor: colors.white,
    padding: responsive.padding(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: responsive.borderRadius(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsive.margin(12),
  },
  logoText: {
    fontSize: responsive.fontSize(20),
    fontWeight: '600',
    color: colors.darkGray,
  },
  titleSection: {
    flexDirection: 'row',
    padding: responsive.padding(16),
    backgroundColor: colors.white,
    alignItems: 'flex-start',
  },
  titleContent: {
    marginLeft: responsive.margin(16),
    flex: 1,
  },
  title: {
    fontSize: responsive.fontSize(24),
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: responsive.margin(4),
  },
  subtitle: {
    fontSize: responsive.fontSize(14),
    color: colors.coolGray,
    lineHeight: responsive.height(20),
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: responsive.padding(16),
    paddingTop: responsive.padding(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  tab: {
    paddingVertical: responsive.padding(12),
    paddingHorizontal: responsive.padding(16),
    marginRight: responsive.margin(8),
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: responsive.fontSize(15),
    color: colors.coolGray,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  periodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: responsive.padding(16),
    backgroundColor: colors.white,
    marginTop: responsive.margin(8),
  },
  periodButton: {
    paddingVertical: responsive.padding(8),
    paddingHorizontal: responsive.padding(16),
    marginRight: responsive.margin(8),
    marginBottom: responsive.margin(8),
    borderRadius: responsive.borderRadius(6),
    backgroundColor: colors.gray100,
  },
  periodActive: {
    backgroundColor: colors.gray200,
  },
  periodText: {
    fontSize: responsive.fontSize(13),
    color: colors.gray,
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: colors.white,
    margin: responsive.margin(16),
    padding: responsive.padding(16),
    borderRadius: responsive.borderRadius(12),
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(12),
  },
  chartTitle: {
    fontSize: responsive.fontSize(18),
    fontWeight: '600',
    color: colors.darkGray,
    marginLeft: responsive.margin(8),
  },
  chartTabs: {
    flexDirection: 'row',
    marginBottom: responsive.margin(12),
  },
  chartTab: {
    paddingVertical: responsive.padding(6),
    paddingHorizontal: responsive.padding(12),
    marginRight: responsive.margin(8),
    borderRadius: responsive.borderRadius(6),
    backgroundColor: colors.gray100,
  },
  chartTabText: {
    fontSize: responsive.fontSize(13),
    color: colors.gray,
  },
  chartLegend: {
    flexDirection: 'row',
    marginBottom: responsive.margin(12),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: responsive.margin(16),
  },
  legendDot: {
    width: responsive.width(8),
    height: responsive.height(8),
    borderRadius: responsive.borderRadius(4),
    marginRight: responsive.margin(6),
  },
  legendText: {
    fontSize: responsive.fontSize(12),
    color: colors.coolGray,
  },
  chart: {
    marginVertical: responsive.margin(8),
    borderRadius: responsive.borderRadius(8),
  },
  trendStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsive.margin(16),
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: responsive.fontSize(12),
    color: colors.coolGray,
    marginBottom: responsive.margin(4),
  },
  statValue: {
    fontSize: responsive.fontSize(18),
    fontWeight: '600',
    color: colors.primary,
  },
  insightsCard: {
    backgroundColor: colors.tealGreen,
    margin: responsive.margin(16),
    marginTop: responsive.margin(0),
    padding: responsive.padding(16),
    borderRadius: responsive.borderRadius(12),
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(12),
  },
  insightsTitle: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: colors.white,
    marginLeft: responsive.margin(8),
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: responsive.margin(8),
  },
  insightBullet: {
    fontSize: responsive.fontSize(16),
    color: colors.white,
    marginRight: responsive.margin(8),
  },
  insightText: {
    fontSize: responsive.fontSize(14),
    color: colors.white,
    flex: 1,
    lineHeight: responsive.height(20),
  },
  logsSection: {
    padding: responsive.padding(16),
  },
  logsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(16),
  },
  logsTitle: {
    fontSize: responsive.fontSize(18),
    fontWeight: '600',
    color: colors.darkGray,
    marginLeft: responsive.margin(8),
  },
  logsSubtitle: {
    fontSize: responsive.fontSize(13),
    color: colors.coolGray,
    marginLeft: responsive.margin(8),
  },
  logCard: {
    backgroundColor: colors.white,
    padding: responsive.padding(16),
    borderRadius: responsive.borderRadius(12),
    marginBottom: responsive.margin(12),
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsive.margin(12),
  },
  logDate: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: colors.darkGray,
  },
  logStatus: {
    fontSize: responsive.fontSize(13),
    color: colors.coolGray,
  },
  logStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsive.margin(8),
  },
  logStat: {
    fontSize: responsive.fontSize(14),
    color: colors.gray,
  },
  expandButton: {
    alignItems: 'center',
    paddingTop: responsive.padding(8),
  },
  expandText: {
    fontSize: responsive.fontSize(13),
    color: colors.primary,
  },
  downloadSection: {
    flexDirection: 'row',
    padding: responsive.padding(16),
    gap: responsive.margin(12),
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: responsive.padding(12),
    borderRadius: responsive.borderRadius(8),
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  downloadText: {
    fontSize: responsive.fontSize(15),
    fontWeight: '600',
    color: colors.gray,
    marginLeft: responsive.margin(8),
  },
  downloadButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: responsive.padding(12),
    borderRadius: responsive.borderRadius(8),
  },
  downloadTextPrimary: {
    fontSize: responsive.fontSize(15),
    fontWeight: '600',
    color: colors.white,
    marginLeft: responsive.margin(8),
  },
  errorContainer: {
    padding: responsive.padding(16),
    backgroundColor: colors.softRed,
    margin: responsive.margin(16),
    borderRadius: responsive.borderRadius(8),
  },
  errorText: {
    fontSize: responsive.fontSize(14),
    color: colors.alertRed,
    textAlign: 'center',
  },
  noDataContainer: {
    padding: responsive.padding(16),
    alignItems: 'center',
  },
  noDataText: {
    fontSize: responsive.fontSize(16),
    color: colors.coolGray,
    textAlign: 'center',
  },
});

export default ExerciseHistoryScreen;