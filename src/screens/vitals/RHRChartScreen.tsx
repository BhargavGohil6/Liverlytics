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

const { width } = Dimensions.get('window');

interface RHRChartScreenProps {
  navigation: any;
}

export default function RHRChartScreen({ navigation }: RHRChartScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { todayData, loading, error } = useSelector((state: any) => state.vitals);
  
  const [rhrData, setRhrData] = useState<number[]>([]);
  const [rhrLabels, setRhrLabels] = useState<string[]>([]);
  const [last7DaysData, setLast7DaysData] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sevenDayStats, setSevenDayStats] = useState<any>(null);

  // Get user email from auth state
  const userEmail = useSelector((state: any) => state.auth?.user?.email);

  useEffect(() => {
    if (userEmail) {
      dispatch(fetchAllVitalsForUser(userEmail) as any);
    }
  }, [dispatch, userEmail]);

  // Process data to get last 7 days of RHR
  useEffect(() => {
    if (todayData?.data && Array.isArray(todayData.data)) {
      // Store seven day stats from API
      if (todayData.seven_day_stats) {
        setSevenDayStats(todayData.seven_day_stats);
      }
      
      // Sort data by date (newest first)
      const sortedData = [...todayData.data].sort((a, b) => {
        const dateA = new Date(a.date || '');
        const dateB = new Date(b.date || '');
        return dateB.getTime() - dateA.getTime();
      });

      // Get last 7 days of data
      const last7Days = sortedData.slice(0, 7);
      setLast7DaysData(last7Days);

      // Extract RHR values and dates
      const rhrValues: number[] = [];
      const dates: string[] = [];

      last7Days.forEach((record: any) => {
        const rhr = record.resting_heart_rate || 0;
        rhrValues.push(Number(rhr) || 0);
        
        // Format date for display (e.g., "Jan 15")
        const date = new Date(record.date || '');
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        dates.push(`${month} ${day}`);
      });

      // Reverse to show oldest first (left to right)
      setRhrData(rhrValues.reverse());
      setRhrLabels(dates.reverse());
      setSelectedIndex(null);
    }
  }, [todayData]);

  // Calculate statistics
  const avgRHR = rhrData.length > 0 
    ? (rhrData.reduce((sum, value) => sum + value, 0) / rhrData.length).toFixed(1)
    : '0';
  
  const minRHR = rhrData.length > 0 ? Math.min(...rhrData) : 0;
  const maxRHR = rhrData.length > 0 ? Math.max(...rhrData) : 0;

  const chartData = {
    labels: rhrLabels,
    datasets: [
      {
        data: rhrData,
        strokeWidth: 3,
        color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`, // Orange color
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.white,
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
    style: {
      borderRadius: responsive.borderRadius(16),
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <CommonLoader visible={loading} message="Loading RHR data..." />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={responsive.fontSize(24)} color={colors.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resting Heart Rate</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Chart Card */}
        <View style={styles.chartCard}>
          <View style={[styles.chartHeader, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }]}>
            <View>
              <Text style={styles.chartTitle}>7-Day Trend</Text>
              <Text style={styles.chartSubtitle}>Resting Heart Rate (bpm)</Text>
            </View>
            {rhrData.length > 0 && (
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.chartSubtitle}>
                  {selectedIndex !== null ? rhrLabels[selectedIndex] : 'Latest'}
                </Text>
                <Text style={[styles.chartTitle, { color: colors.primary }]}>
                  {selectedIndex !== null 
                    ? rhrData[selectedIndex]
                    : rhrData[rhrData.length - 1]} bpm
                </Text>
              </View>
            )}
          </View>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle" size={40} color={colors.orange} />
              <Text style={styles.errorText}>Unable to load RHR data</Text>
              <Text style={styles.errorSubText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => dispatch(fetchAllVitalsForUser(userEmail) as any)}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : rhrData.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Icon name="activity" size={40} color={colors.gray666} />
              <Text style={styles.noDataText}>No RHR data available</Text>
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
                width={width - responsive.padding(40)}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                yAxisLabel=""
                // yAxisSuffix=" bpm"
                fromZero={false}
                onDataPointClick={(data) => {
                  if (selectedIndex === data.index) {
                    setSelectedIndex(null);
                  } else {
                    setSelectedIndex(data.index);
                  }
                }}
              />
            </View>
          )}
        </View>

        {/* Statistics Card */}
        {rhrData.length > 0 && sevenDayStats && sevenDayStats.resting_heart_rate && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>7-Day Statistics</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{sevenDayStats.resting_heart_rate.avg}</Text>
                <Text style={styles.statLabel}>Average</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{sevenDayStats.resting_heart_rate.min}</Text>
                <Text style={styles.statLabel}>Minimum</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{sevenDayStats.resting_heart_rate.max}</Text>
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
              const rhr = record.resting_heart_rate || 0;
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
                    <Text style={styles.readingValue}>{rhr} bpm</Text>
                    <View style={[
                      styles.statusIndicator,
                      rhr < 60 ? styles.statusLow : 
                      rhr > 100 ? styles.statusHigh : 
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
            <Text style={styles.infoTitle}>About Resting Heart Rate</Text>
          </View>
          <Text style={styles.infoText}>
            Resting heart rate is the number of times your heart beats per minute while you're at rest. 
            A normal resting heart rate for adults ranges from 60 to 100 beats per minute. 
            Well-trained athletes may have a resting heart rate below 60 bpm.
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
    width: 40, // To balance the header layout
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
    borderRadius: responsive.borderRadius(16),
    padding: responsive.padding(15),
    marginBottom: responsive.margin(16),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    //  marginLeft: -responsive.padding(13),
  },
  chartHeader: {
    marginBottom: responsive.margin(16),
  },
  chartTitle: {
    fontSize: font.xl,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: responsive.margin(4),
  },
  chartSubtitle: {
    fontSize: font.sm,
    color: colors.gray666,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: responsive.margin(8),
    marginLeft: -responsive.padding(10),
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
    borderRadius: responsive.borderRadius(16),
    padding: responsive.padding(20),
    marginBottom: responsive.margin(16),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: font.h4,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: responsive.margin(4),
  },
  statLabel: {
    fontSize: font.sm,
    color: colors.gray666,
  },
  readingsCard: {
    backgroundColor: colors.white,
    borderRadius: responsive.borderRadius(16),
    padding: responsive.padding(20),
    marginBottom: responsive.margin(16),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
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
    paddingVertical: responsive.padding(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  readingLeft: {
    flex: 1,
  },
  readingDate: {
    fontSize: font.base,
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: responsive.margin(2),
  },
  readingTime: {
    fontSize: font.sm,
    color: colors.gray666,
  },
  readingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.padding(8),
  },
  readingValue: {
    fontSize: font.base,
    fontWeight: '600',
    color: colors.darkGray,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusLow: {
    backgroundColor: colors.primary,
  },
  statusNormal: {
    backgroundColor: colors.mintMist,
  },
  statusHigh: {
    backgroundColor: colors.orange,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: responsive.borderRadius(16),
    padding: responsive.padding(20),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
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