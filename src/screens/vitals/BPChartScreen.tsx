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

interface BPChartScreenProps {
  navigation: any;
}

export default function BPChartScreen({ navigation }: BPChartScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { todayData, loading, error } = useSelector((state: any) => state.vitals);
  
  const [systolicData, setSystolicData] = useState<number[]>([]);
  const [diastolicData, setDiastolicData] = useState<number[]>([]);
  const [bpLabels, setBpLabels] = useState<string[]>([]);
  const [last7DaysData, setLast7DaysData] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Get user email from auth state
  const userEmail = useSelector((state: any) => state.auth?.user?.email);

  useEffect(() => {
    if (userEmail) {
      dispatch(fetchAllVitalsForUser(userEmail) as any);
    }
  }, [dispatch, userEmail]);

  // Process data to get last 7 days of BP
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

      // Extract BP values and dates
      const systolicValues: number[] = [];
      const diastolicValues: number[] = [];
      const dates: string[] = [];

      last7Days.forEach((record: any) => {
        // Handle blood pressure data in different formats
        let systolic = 0;
        let diastolic = 0;
        
        // Check for blood_pressure as string (e.g., "120/80")
        if (record.blood_pressure && typeof record.blood_pressure === 'string') {
          const bpParts = record.blood_pressure.split('/');
          if (bpParts.length === 2) {
            systolic = parseInt(bpParts[0], 10) || 0;
            diastolic = parseInt(bpParts[1], 10) || 0;
          }
        } 
        // Check for separate systolic and diastolic values
        else if (record.blood_pressure_systolic !== undefined && record.blood_pressure_diastolic !== undefined) {
          systolic = Number(record.blood_pressure_systolic) || 0;
          diastolic = Number(record.blood_pressure_diastolic) || 0;
        }

        systolicValues.push(systolic);
        diastolicValues.push(diastolic);
        
        // Format date for display
        const date = new Date(record.date || '');
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        dates.push(`${month} ${day}`);
      });

      // Reverse to show oldest first (left to right)
      setSystolicData(systolicValues.reverse());
      setDiastolicData(diastolicValues.reverse());
      setBpLabels(dates.reverse());
      setSelectedIndex(null);
    }
  }, [todayData]);

  // Calculate statistics
  const avgSystolic = systolicData.length > 0 
    ? (systolicData.reduce((sum, value) => sum + value, 0) / systolicData.length).toFixed(0)
    : '0';
  
  const avgDiastolic = diastolicData.length > 0 
    ? (diastolicData.reduce((sum, value) => sum + value, 0) / diastolicData.length).toFixed(0)
    : '0';

  // Calculate Min/Max for proper padding boundary
  let chartMin = 0;
  let chartMax = 200;
  
  if (systolicData.length > 0 || diastolicData.length > 0) {
    let minVal = 9999;
    let maxVal = -9999;
    
    systolicData.forEach(s => { if (s > 0) { minVal = Math.min(minVal, s); maxVal = Math.max(maxVal, s); } });
    diastolicData.forEach(d => { if (d > 0) { minVal = Math.min(minVal, d); maxVal = Math.max(maxVal, d); } });
    
    if (minVal === 9999) minVal = 0;
    if (maxVal === -9999) maxVal = 100;
    
    const range = maxVal - minVal;
    let padding = range * 0.2;
    if (padding < 10) padding = 10;
    
    chartMin = Math.max(0, minVal - padding);
    chartMax = maxVal + padding + (range === 0 ? 10 : 0);
  }

  const dummyData = systolicData.map((_, i) => i === 0 ? chartMax : chartMin);

  const chartData = {
    labels: bpLabels,
    datasets: [
      {
        data: systolicData,
        color: (opacity = 1) => `rgba(255, 217, 61, ${opacity})`, // Yellow for systolic
      },
      {
        data: diastolicData,
        color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`, // Red for diastolic
      },
      {
        data: dummyData.length > 0 ? dummyData : [chartMax, chartMin],
        color: () => 'rgba(0,0,0,0)', // Invisible bounds
        withDots: false,
      }
    ],
    legend: ['Systolic', 'Diastolic', ''],
  };

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 217, 61, ${opacity})`, // Match VitalsHistoryScreen BP color
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    strokeWidth: responsive.width(2),
    style: { borderRadius: responsive.borderRadius(16) },
    propsForDots: {
      r: responsive.width(4),
      strokeWidth: responsive.width(2),
      stroke: '#FFD93D',
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: '500',
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CommonLoader visible={loading} message="Loading BP data..." />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={responsive.fontSize(24)} color={colors.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blood Pressure</Text>
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
              <Text style={styles.chartSubtitle}>Blood Pressure (mmHg)</Text>
            </View>
            {systolicData.length > 0 && diastolicData.length > 0 && (
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.chartSubtitle}>
                  {selectedIndex !== null ? bpLabels[selectedIndex] : 'Latest'}
                </Text>
                <Text style={[styles.chartTitle, { color: '#FF5252' }]}>
                  {selectedIndex !== null 
                    ? `${systolicData[selectedIndex]}/${diastolicData[selectedIndex]}`
                    : `${systolicData[systolicData.length - 1]}/${diastolicData[diastolicData.length - 1]}`}
                </Text>
              </View>
            )}
          </View>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle" size={40} color={colors.orange} />
              <Text style={styles.errorText}>Unable to load BP data</Text>
              <Text style={styles.errorSubText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => dispatch(fetchAllVitalsForUser(userEmail) as any)}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (systolicData.length === 0 || diastolicData.length === 0) ? (
            <View style={styles.noDataContainer}>
              <Icon name="activity" size={40} color={colors.gray666} />
              <Text style={styles.noDataText}>No BP data available</Text>
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
              <View style={{ position: 'relative' }}>
              <LineChart
                data={chartData}
                width={width - responsive.padding(40)}
                height={responsive.height(200)}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                fromZero={false}
                withShadow={false}
                onDataPointClick={(data) => {
                  if (data.value === chartMax || data.value === chartMin) return;
                  if (selectedIndex === data.index) {
                    setSelectedIndex(null);
                  } else {
                    setSelectedIndex(data.index);
                  }
                }}
              />
              </View>
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#FFD93D' }]} />
                  <Text style={styles.legendText}>Systolic</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
                  <Text style={styles.legendText}>Diastolic</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Statistics Card */}
        {(systolicData.length > 0 || diastolicData.length > 0) && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>7-Day Statistics</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{avgSystolic}/{avgDiastolic}</Text>
                <Text style={styles.statLabel}>Average</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {Math.max(...systolicData)}/{Math.max(...diastolicData)}
                </Text>
                <Text style={styles.statLabel}>Maximum</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {Math.min(...systolicData.filter(x => x > 0))}/{Math.min(...diastolicData.filter(x => x > 0))}
                </Text>
                <Text style={styles.statLabel}>Minimum</Text>
              </View>
            </View>
          </View>
        )}

        {/* Recent Readings */}
        {last7DaysData.length > 0 && (
          <View style={styles.readingsCard}>
            <Text style={styles.readingsTitle}>Recent Readings</Text>
            
            {last7DaysData.map((record: any, index: number) => {
              const bp = record.blood_pressure || '0/0';
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
                    <Text style={styles.readingValue}>{bp} mmHg</Text>
                    <View style={[
                      styles.statusIndicator,
                      bp.split('/')[0] > 130 || bp.split('/')[1] > 80 ? styles.statusHigh : 
                      bp.split('/')[0] < 90 || bp.split('/')[1] < 60 ? styles.statusLow : 
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
            <Text style={styles.infoTitle}>About Blood Pressure</Text>
          </View>
          <Text style={styles.infoText}>
            Blood pressure is the force of your blood against your artery walls as your heart pumps. 
            Normal BP is less than 120/80 mmHg. 
            High blood pressure (hypertension) is 130/80 mmHg or higher.
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
    borderRadius: responsive.borderRadius(16),
    padding: responsive.padding(20),
    marginBottom: responsive.margin(16),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
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
  },
  chart: {
    marginVertical: responsive.margin(8),
    borderRadius: responsive.borderRadius(16),
  },
  chartLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: responsive.margin(12),
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: responsive.margin(8),
    marginBottom: responsive.margin(8),
  },
  legendDot: {
    width: responsive.width(8),
    height: responsive.height(8),
    borderRadius: responsive.borderRadius(4),
    marginRight: responsive.margin(6),
  },
  legendText: {
    fontSize: responsive.fontSize(12),
    color: '#666',
    marginLeft: responsive.margin(4),
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