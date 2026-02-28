import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LineChart } from 'react-native-chart-kit';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllVitalsForUser } from './slices/vitalsSlice';
import { AppDispatch } from '../../redux/store';
import colors from '../../theme/color';
import responsive from '../../theme/responsive';
import font from '../../theme/fonts';
import CommonLoader from '../../components/CommonLoader';
import { getDailyHealthTargets } from '../../screens/profile/slices/profileSlice';

const { width } = Dimensions.get('window');

interface SleepChartScreenProps {
  navigation: any;
}

export default function SleepChartScreen({ navigation }: SleepChartScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { todayData, loading, error } = useSelector((state: any) => state.vitals);
  const { dailyHealthTargets } = useSelector((state: any) => state.profile);
  
  const [sleepData, setSleepData] = useState<number[]>([]);
  const [sleepLabels, setSleepLabels] = useState<string[]>([]);
  const [last7DaysData, setLast7DaysData] = useState<any[]>([]);
  const [sleepGoal, setSleepGoal] = useState<number>(0);

  // Get user email from auth state
  const userEmail = useSelector((state: any) => state.auth?.user?.email);

  useEffect(() => {
    if (userEmail) {
      dispatch(fetchAllVitalsForUser(userEmail) as any);
      dispatch(getDailyHealthTargets(userEmail) as any);
    }
  }, [dispatch, userEmail]);

  // Process data to get last 7 days of Sleep
  useEffect(() => {
    if (todayData?.data && Array.isArray(todayData.data)) {
      // Sort data by date (newest first)
      const sortedData = [...todayData.data].sort((a, b) => {
        const dateA = new Date(a.date || '');
        const dateB = new Date(b.date || '');
        return dateB.getTime() - dateA.getTime();
      });

      // Get last 7 days of data
      const last7Days = sortedData.slice(0, 7);
      setLast7DaysData(last7Days);

      // Extract Sleep values and dates
      const sleepValues: number[] = [];
      const dates: string[] = [];

      last7Days.forEach((record: any) => {
        // Handle sleep in minutes
        const sleepMinutes = record.sleep || record.sleep_minutes || 0;
        // Store minutes for display conversion
        sleepValues.push(Number(sleepMinutes) || 0);
        
        // Format date for display
        const date = new Date(record.date || '');
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        dates.push(`${month} ${day}`);
      });

      // Reverse to show oldest first (left to right)
      setSleepData(sleepValues.reverse());
      setSleepLabels(dates.reverse());
    }
  }, [todayData]);

  // Calculate statistics
  const avgSleepHours = sleepData.length > 0 
    ? (sleepData.reduce((sum, value) => sum + value, 0) / sleepData.length).toFixed(1)
    : '0';
  
  const minSleep = sleepData.length > 0 ? Math.min(...sleepData) : 0;
  const maxSleep = sleepData.length > 0 ? Math.max(...sleepData) : 0;

  // Get sleep goal from profile
  useEffect(() => {
    if (dailyHealthTargets && dailyHealthTargets.length > 0) {
      const goal = parseFloat(dailyHealthTargets[0].sleep_goal) || 0;
      setSleepGoal(goal);
    }
  }, [dailyHealthTargets]);

  // Convert minutes to hours and minutes for display
  const sleepDataHoursMinutes = sleepData.map(minutes => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return { hours, minutes: mins };
  });

  const chartData = {
    labels: sleepLabels,
    datasets: [
      {
        data: sleepData.map(minutes => minutes / 60), // Convert to hours for chart
        strokeWidth: 3,
        color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`, // Purple color
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.white,
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    decimalPlaces: 1, // Show 1 decimal place for hours
    color: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
    style: {
      borderRadius: responsive.borderRadius(16),
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#9C27B0',
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <CommonLoader visible={loading} message="Loading sleep data..." />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={responsive.fontSize(24)} color={colors.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sleep Duration</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Chart Card */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>7-Day Trend</Text>
            <Text style={styles.chartSubtitle}>Sleep Duration (hr & min)</Text>
          </View>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle" size={40} color={colors.orange} />
              <Text style={styles.errorText}>Unable to load sleep data</Text>
              <Text style={styles.errorSubText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => dispatch(fetchAllVitalsForUser(userEmail) as any)}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : sleepData.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Icon name="moon" size={40} color={colors.gray666} />
              <Text style={styles.noDataText}>No sleep data available</Text>
              <Text style={styles.noDataSubText}>Add your vitals to see trends</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('AddVitalsScreen')}
              >
                <Text style={styles.addButtonText}>Add Vitals</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.chartContainer}>
              <LineChart
                data={chartData}
                width={width - responsive.padding(32) * 2}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                yAxisLabel=""
                yAxisSuffix="h"
                fromZero={false}
              />
            </View>
          )}
        </View>

        {/* Statistics Card */}
        {sleepData.length > 0 && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>7-Day Statistics</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {Math.floor(parseFloat(avgSleepHours))}h {Math.round((parseFloat(avgSleepHours) % 1) * 60)}m
                </Text>
                <Text style={styles.statLabel}>Average</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {Math.floor(minSleep)}h {Math.round((minSleep % 1) * 60)}m
                </Text>
                <Text style={styles.statLabel}>Minimum</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {Math.floor(maxSleep)}h {Math.round((maxSleep % 1) * 60)}m
                </Text>
                <Text style={styles.statLabel}>Maximum</Text>
              </View>
            </View>
          </View>
        )}

        {/* Recent Readings */}
        {last7DaysData.length > 0 && (
          <View style={styles.readingsCard}>
            <Text style={styles.readingsTitle}>Recent Readings</Text>
            
            {last7DaysData.map((record: any, index: number) => {
              const sleepMinutes = record.sleep || record.sleep_minutes || 0;
              const hours = Math.floor(sleepMinutes / 60);
              const minutes = sleepMinutes % 60;
              const sleepDisplay = `${hours} hr and ${minutes} min`;
              
              const date = new Date(record.date || '');
              const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              });
              
              return (
                <View key={index} style={styles.readingItem}>
                  <View style={styles.readingLeft}>
                    <Text style={styles.readingDate}>{formattedDate}</Text>
                    <Text style={styles.readingTime}>
                      {record.creation 
                        ? new Date(record.creation).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.readingRight}>
                    <Text style={styles.readingValue}>{sleepDisplay}</Text>
                    <Text style={styles.readingStatus}>
                      {sleepMinutes / 60 < sleepGoal ? 'Less' : ''}
                    </Text>
                    <View style={[
                      styles.statusIndicator,
                      sleepMinutes / 60 < sleepGoal ? styles.statusLow : // Less than goal
                      sleepMinutes / 60 > (sleepGoal + 3) ? styles.statusHigh : // Significantly more than goal
                      styles.statusNormal
                    ]} />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Icon name="info" size={16} color={colors.primary} />
            <Text style={styles.infoTitle}>About Sleep</Text>
          </View>
          <Text style={styles.infoText}>
            Most adults need 7-9 hours of sleep per night for optimal health. 
            Consistently getting less than 6 hours or more than 10 hours 
            may indicate sleep issues that should be discussed with a healthcare provider.
          </Text>
        </View>
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
    paddingHorizontal: responsive.padding(16),
    paddingVertical: responsive.padding(12),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    padding: responsive.padding(8),
  },
  headerTitle: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.darkGray,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: responsive.padding(16),
    paddingBottom: responsive.padding(32),
  },
  chartCard: {
    backgroundColor: colors.white,
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
    marginBottom: responsive.margin(12),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  chartHeader: {
    marginBottom: responsive.margin(16),
  },
  chartTitle: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: responsive.margin(2),
  },
  chartSubtitle: {
    fontSize: font.xs,
    color: colors.gray666,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: responsive.margin(8),
  },
  chart: {
    marginVertical: responsive.margin(8),
    borderRadius: responsive.borderRadius(16),
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: responsive.padding(40),
  },
  errorText: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.darkGray,
    marginTop: responsive.margin(12),
    marginBottom: responsive.margin(4),
  },
  errorSubText: {
    fontSize: font.sm,
    color: colors.gray666,
    textAlign: 'center',
    marginBottom: responsive.margin(16),
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: responsive.padding(20),
    paddingVertical: responsive.padding(10),
    borderRadius: responsive.borderRadius(8),
  },
  retryText: {
    color: colors.white,
    fontSize: font.sm,
    fontWeight: '600',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: responsive.padding(40),
  },
  noDataText: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.darkGray,
    marginTop: responsive.margin(12),
    marginBottom: responsive.margin(4),
  },
  noDataSubText: {
    fontSize: font.sm,
    color: colors.gray666,
    marginBottom: responsive.margin(16),
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: responsive.padding(20),
    paddingVertical: responsive.padding(10),
    borderRadius: responsive.borderRadius(8),
  },
  addButtonText: {
    color: colors.white,
    fontSize: font.sm,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: colors.white,
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
    marginBottom: responsive.margin(12),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  statsTitle: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: responsive.margin(16),
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: font.xl,
    fontWeight: '700',
    color: '#9C27B0',
    marginBottom: responsive.margin(2),
  },
  statLabel: {
    fontSize: font.xs,
    color: colors.gray666,
  },
  readingsCard: {
    backgroundColor: colors.white,
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
    marginBottom: responsive.margin(12),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  readingsTitle: {
    fontSize: font.lg,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: responsive.margin(16),
  },
  readingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsive.padding(8),
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray200,
  },
  readingLeft: {
    flex: 1,
  },
  readingDate: {
    fontSize: font.sm,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: responsive.margin(1),
  },
  readingTime: {
    fontSize: font.xs,
    color: colors.gray666,
  },
  readingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.padding(6),
  },
  readingValue: {
    fontSize: font.sm,
    fontWeight: '600',
    color: colors.darkGray,
  },
  readingStatus: {
    fontSize: font.xs,
    color: colors.orange,
    fontWeight: '600',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusLow: {
    backgroundColor: colors.orange,
  },
  statusNormal: {
    backgroundColor: colors.mintMist,
  },
  statusHigh: {
    backgroundColor: '#2196F3',
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.padding(8),
    marginBottom: responsive.margin(12),
  },
  infoTitle: {
    fontSize: font.base,
    fontWeight: '700',
    color: colors.darkGray,
  },
  infoText: {
    fontSize: font.sm,
    color: colors.gray666,
    lineHeight: responsive.fontSize(20),
  },
});