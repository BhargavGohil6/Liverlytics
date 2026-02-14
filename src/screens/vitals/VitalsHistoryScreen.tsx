// src/screens/VitalsHistoryScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Modal,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LineChart } from 'react-native-chart-kit';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, DateData } from 'react-native-calendars';
import { fetchAllVitalsForUser } from './slices/vitalsSlice';
import { AppDispatch, RootState } from '../../redux/store';
import responsive from '../../theme/responsive'; // Import responsive scaling functions
import colors from '../../theme/color';

const { width } = Dimensions.get('window');

interface VitalsHistoryScreenProps {
  navigation: any; // Replace with proper navigation type
}

const VitalsHistoryScreen: React.FC<VitalsHistoryScreenProps> = ({ navigation }) => {
  const [selectedDays, setSelectedDays] = useState('7');
  const [selectedMetric, setSelectedMetric] = useState('Heart Rate');
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [tempStartDate, setTempStartDate] = useState<string>('');
  const [tempEndDate, setTempEndDate] = useState<string>('');
  
  const dispatch: AppDispatch = useDispatch();
  const { todayData, loading, error } = useSelector((state: RootState) => state.vitals);
  const [vitalsData, setVitalsData] = useState<any[]>([]);
  
  const today = new Date().toISOString().split('T')[0];
  
  // Get user data from auth state to fetch their vitals
  const { user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    // Fetch all vitals for the current user when the component mounts
    if (user?.email) {
      dispatch(fetchAllVitalsForUser(user.email));
    }
  }, [dispatch, user?.email]);
  
  // Process the fetched data when it's available
  useEffect(() => {
    if (todayData && todayData.data) {
      // Convert the API response to the format expected by the UI
      let processedData = Array.isArray(todayData.data) ? todayData.data : [todayData.data];
      
      // Filter data based on selected date range if custom dates are selected
      if (selectedDays === 'Custom' && startDate && endDate) {
        processedData = processedData.filter((vital: any) => {
          const vitalDate = vital.date ? new Date(vital.date).toISOString().split('T')[0] : '';
          return vitalDate >= startDate && vitalDate <= endDate;
        });
      }
      
      // Sort data by date (newest first)
      processedData = [...processedData].sort((a: any, b: any) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
      
      // Transform the data to match the expected format for display
      const transformedData = processedData.map((vital: any) => {
        // For demonstration, using heart_rate as the main metric
        // In a real implementation, you'd want to map based on the selected metric
        let value, unit = 'bpm';
        
        switch(selectedMetric) {
          case 'Heart Rate':
            value = vital.heart_rate;
            unit = 'bpm';
            break;
          case 'Glucose':
            value = vital.glucose;
            unit = 'mg/dL';
            break;
          case 'Sleep':
            value = vital.sleep;
            unit = 'm';
            break;
          case 'SpO₂':
            value = vital.spo2;
            unit = '%';
            break;
          case 'Weight':
            value = vital.weight;
            unit = 'kg';
            break;
          case 'Blood Pressure':
            value = vital.blood_pressure;
            unit = 'mmHg';
            break;
          default:
            value = vital.heart_rate;
            unit = 'bpm';
        }
        
        return {
          date: vital.date ? new Date(vital.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Unknown',
          value: value || 0,
          flag: '', // You can implement logic to determine flags based on the data
          source: vital.creation ? 'Manual' : 'Wearable', // Assuming creation means manually entered
          unit: unit,
          rawVital: vital
        };
      });
      
      setVitalsData(transformedData);
    }
  }, [todayData, selectedMetric]);

  const handleDayPress = (day: DateData) => {
    const dateString = day.dateString;
    
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      // If no start date is selected or both dates are already selected, set new start date
      setTempStartDate(dateString);
      setTempEndDate('');
    } else if (dateString < tempStartDate) {
      // If selected date is before start date, set it as new start date
      setTempStartDate(dateString);
    } else {
      // Set end date
      setTempEndDate(dateString);
    }
  };

  const applyDateRange = () => {
    if (tempStartDate && tempEndDate) {
      setStartDate(tempStartDate);
      setEndDate(tempEndDate);
      setShowCalendar(false);
      
      // Update the selected days to show the custom range
      const start = new Date(tempStartDate);
      const end = new Date(tempEndDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Set a custom label for the selected range
      setSelectedDays('Custom');
    }
  };

  const resetDateRange = () => {
    setTempStartDate('');
    setTempEndDate('');
    setStartDate('');
    setEndDate('');
    setSelectedDays('7');
    setShowCalendar(false);
  };

  const getDateRangeLabel = () => {
    if (selectedDays === 'Custom' && startDate && endDate) {
      return `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
    }
    return `Last ${selectedDays} days`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
            <Icon name="arrow-back" size={responsive.fontSize(24)} color="#333" />
          </TouchableOpacity>
          <View style={styles.titleTextContainer}>
            <Text style={styles.title}>Vitals History</Text>
            <Text style={styles.subtitle}>Track changes in your health over time</Text>
          </View>
        </View>

        {/* Time Period Selector */}
        <View style={styles.periodSelector}>
          {['7', '30', '90', 'Custom'].map((period, index) => {
            const periodLabel = period === 'Custom' ? 'Custom' : `${period} Days`;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.periodButton,
                  selectedDays === period && styles.periodButtonActive,
                ]}
                onPress={() => {
                  if (period === 'Custom') {
                    setShowCalendar(true);
                  } else {
                    setSelectedDays(period);
                    setStartDate('');
                    setEndDate('');
                  }
                }}
              >
                <Text
                  style={[
                    styles.periodText,
                    selectedDays === period && styles.periodTextActive,
                  ]}
                >
                  {periodLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
        {/* Selected Date Range */}
        {selectedDays === 'Custom' && (startDate || endDate) && (
          <View style={styles.dateRangeContainer}>
            <Text style={styles.dateRangeText}>
              {startDate && endDate 
                ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                : startDate 
                  ? `From: ${new Date(startDate).toLocaleDateString()}`
                  : 'Select date range'}
            </Text>
            <TouchableOpacity 
              onPress={() => setShowCalendar(true)}
              style={styles.editDateButton}
            >
              <Icon name="pencil" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Metrics Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.metricsScroll}>
          {['Heart Rate', 'Resting HR', 'Glucose', 'Sleep', 'SpO₂', 'Weight', 'Blood Pressure'].map(
            (metric) => (
              <TouchableOpacity
                key={metric}
                style={[
                  styles.metricButton,
                  selectedMetric === metric && styles.metricButtonActive,
                ]}
                onPress={() => setSelectedMetric(metric)}
              >
                <Text
                  style={[
                    styles.metricText,
                    selectedMetric === metric && styles.metricTextActive,
                  ]}
                >
                  {metric}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Trend</Text>
            <Text style={styles.chartSubtitle}>
              {selectedDays === 'Custom' && startDate && endDate 
                ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()} • ${selectedMetric}`
                : `Last ${selectedDays} days • ${selectedMetric}`}
            </Text>
          </View>
          {loading ? (
            <Text style={{ textAlign: 'center', padding: responsive.padding(20) }}>Loading vitals data...</Text>
          ) : error ? (
            <Text style={{ textAlign: 'center', padding: responsive.padding(20), color: 'red' }}>Error: {error}</Text>
          ) : vitalsData.length > 0 ? (
            <LineChart
              data={{
                labels: vitalsData.slice(0, 7).map(item => item.date.substring(0, 3)), // Use first 3 letters of the date
                datasets: [{
                  data: vitalsData.slice(0, 7).map(item => {
                    // Handle blood pressure format (e.g., "120/80")
                    if (selectedMetric === 'Blood Pressure' && item.value && typeof item.value === 'string' && item.value.includes('/')) {
                      // Use the systolic value (first number) for the chart
                      return Number(item.value.split('/')[0]);
                    }
                    return Number(item.value) || 0;
                  })
                }],
                legend: [selectedMetric], // Use the selected metric as the legend
              }}
              width={width - responsive.width(48)}
              height={responsive.height(200)}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(82, 166, 74, ${opacity})`,
                strokeWidth: responsive.width(2),
                style: { borderRadius: responsive.borderRadius(16) },
                propsForDots: {
                  r: responsive.width(4),
                  strokeWidth: responsive.width(2),
                  stroke: '#52a64a'
                },
              }}
              bezier
              style={styles.chart}
            />
          ) : (
            <Text style={{ textAlign: 'center', padding: responsive.padding(20) }}>No data available</Text>
          )}
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={styles.legendDot} />
              <Text style={styles.legendText}>Measured</Text>
            </View>
            <View style={styles.legendItem}>
              <Icon name="warning-outline" size={responsive.fontSize(16)} color="#666" />
              <Text style={styles.legendText}>AI anomaly</Text>
            </View>
            <View style={styles.legendItem}>
              <Icon name="pulse-outline" size={responsive.fontSize(16)} color="#666" />
              <Text style={styles.legendText}>Variable with spikes</Text>
            </View>
          </View>
        </View>

        {/* Data Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Date</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Value</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>AI Flag</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Source</Text>
          </View>
          {vitalsData.length > 0 ? (
            vitalsData.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{item.date}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.value} {item.unit}</Text>
                <View style={[styles.tableCellIcon, { flex: 1 }]}> 
                  {item.flag ? (
                    <>
                      <Icon name="warning-outline" size={responsive.fontSize(16)} color="#f59e0b" />
                      <Text style={styles.flagText}>{item.flag}</Text>
                    </>
                  ) : (
                    <Text style={styles.tableCell}>—</Text>
                  )}
                </View>
                <View style={[styles.tableCellIcon, { flex: 1 }]}> 
                  <Icon
                    name={item.source === 'Wearable' ? 'watch-outline' : 'create-outline'}
                    size={responsive.fontSize(16)}
                    color="#666"
                  />
                  <Text style={styles.sourceText}>{item.source}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>No data available</Text>
            </View>
          )}
        </View>

        {/* Add Entry Button */}
        {/* <View style={styles.addButtonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={()=>navigation.navigate('AddVitalsScreen')}>
            <Icon name="add" size={responsive.fontSize(20)} color="#fff" />
            <Text style={styles.addButtonText}>Add Entry</Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
      
      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Select Date Range</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <Calendar
              current={today}
              minDate={'2020-01-01'}
              maxDate={today}
              onDayPress={handleDayPress}
              markingType={'period'}
              markedDates={{
                ...(tempStartDate && {
                  [tempStartDate]: {
                    startingDay: true,
                    color: colors.primary,
                    textColor: 'white',
                  },
                }),
                ...(tempEndDate && {
                  [tempEndDate]: {
                    endingDay: true,
                    color: colors.primary,
                    textColor: 'white',
                  },
                }),
                ...(tempStartDate &&
                  tempEndDate && {
                    ...getDatesInRange(tempStartDate, tempEndDate).reduce(
                      (acc, date) => ({
                        ...acc,
                        [date]: {
                          color: `${colors.primary}40`,
                          textColor: colors.darkGray,
                        },
                      }),
                      {}
                    ),
                  }),
              }}
              theme={{
                todayTextColor: colors.primary,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: 'white',
                arrowColor: colors.primary,
                monthTextColor: colors.darkGray,
                textMonthFontWeight: '600',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 14,
              }}
            />
            
            <View style={styles.calendarFooter}>
              <TouchableOpacity 
                style={[styles.calendarButton, styles.cancelButton]}
                onPress={resetDateRange}
              >
                <Text style={[styles.buttonText, { color: colors.darkGray }]}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.calendarButton, styles.applyButton, (!tempStartDate || !tempEndDate) && styles.disabledButton]}
                onPress={applyDateRange}
                disabled={!tempStartDate || !tempEndDate}
              >
                <Text style={[styles.buttonText, { color: 'white' }]}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Helper function to get all dates in a range 
const getDatesInRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // If start date is after end date, return empty array
  if (start > end) return [];
  
  const currentDate = new Date(start);
  
  while (currentDate <= end) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: responsive.padding(16),
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: responsive.width(40),
    height: responsive.height(40),
    backgroundColor: '#52a64a',
    borderRadius: responsive.borderRadius(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsive.margin(12),
  },
  logoText: {
    fontSize: responsive.fontSize(20),
    fontWeight: '600',
    color: '#333',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: responsive.padding(16),
    backgroundColor: '#fff',
  },
  titleTextContainer: {
    marginLeft: responsive.margin(16),
    flex: 1,
  },
  title: {
    fontSize: responsive.fontSize(24),
    fontWeight: '700',
    color: '#333',
    marginBottom: responsive.margin(4),
  },
  subtitle: {
    fontSize: responsive.fontSize(14),
    color: '#666',
  },
  periodSelector: {
    flexDirection: 'row',
    padding: responsive.padding(16),
    backgroundColor: '#fff',
    marginTop: responsive.margin(1),
  },
  periodButton: {
    flex: 1,
    paddingVertical: responsive.padding(10),
    paddingHorizontal: responsive.padding(8),
    marginRight: responsive.margin(6),
    borderRadius: responsive.borderRadius(8),
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    minWidth: 70,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  dateRangeText: {
    fontSize: responsive.fontSize(13),
    color: colors.darkGray,
    marginRight: 8,
  },
  editDateButton: {
    padding: 4,
  },
  // Calendar Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: responsive.fontSize(18),
    fontWeight: '600',
    color: colors.darkGray,
  },
  calendarFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  calendarButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  applyButton: {
    backgroundColor: colors.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: responsive.fontSize(14),
    fontWeight: '600',
  },
  periodButtonActive: {
    backgroundColor: '#1a1d29',
  },
  periodText: {
    fontSize: responsive.fontSize(12),
    color: '#666',
    fontWeight: '500',
  },
  periodTextActive: {
    color: '#fff',
  },
  metricsScroll: {
    backgroundColor: '#fff',
    marginTop: responsive.margin(1),
    paddingVertical: responsive.padding(12),
  },
  metricButton: {
    paddingVertical: responsive.padding(8),
    paddingHorizontal: responsive.padding(16),
    marginLeft: responsive.margin(16),
    borderRadius: responsive.borderRadius(20),
    backgroundColor: '#f5f5f5',
  },
  metricButtonActive: {
    backgroundColor: '#1a1d29',
  },
  metricText: {
    fontSize: responsive.fontSize(13),
    color: '#666',
    fontWeight: '500',
  },
  metricTextActive: {
    color: '#fff',
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: responsive.margin(16),
    padding: responsive.padding(16),
    borderRadius: responsive.borderRadius(12),
  },
  chartHeader: {
    marginBottom: responsive.margin(16),
  },
  chartTitle: {
    fontSize: responsive.fontSize(18),
    fontWeight: '600',
    color: '#333',
  },
  chartSubtitle: {
    fontSize: responsive.fontSize(13),
    color: '#666',
    marginTop: responsive.margin(4),
  },
  chart: {
    marginVertical: responsive.margin(8),
    borderRadius: responsive.borderRadius(16),
  },
  chartLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: responsive.margin(12),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: responsive.margin(16),
    marginBottom: responsive.margin(8),
  },
  legendDot: {
    width: responsive.width(8),
    height: responsive.height(8),
    borderRadius: responsive.borderRadius(4),
    backgroundColor: '#52a64a',
    marginRight: responsive.margin(6),
  },
  legendText: {
    fontSize: responsive.fontSize(12),
    color: '#666',
    marginLeft: responsive.margin(4),
  },
  tableContainer: {
    backgroundColor: '#fff',
    margin: responsive.margin(16),
    marginTop: 0,
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: responsive.padding(12),
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tableHeaderText: {
    fontSize: responsive.fontSize(13),
    fontWeight: '600',
    color: '#666',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: responsive.padding(12),
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  tableCell: {
    fontSize: responsive.fontSize(13),
    color: '#333',
  },
  tableCellIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagText: {
    fontSize: responsive.fontSize(12),
    color: '#f59e0b',
    marginLeft: responsive.margin(4),
  },
  sourceText: {
    fontSize: responsive.fontSize(12),
    color: '#666',
    marginLeft: responsive.margin(4),
  },
  addButtonContainer: {
    padding: responsive.padding(16),
    alignItems: 'center',
  },
  noDataText: {
    fontSize: responsive.fontSize(14),
    color: '#666',
    textAlign: 'center',
    marginBottom: responsive.margin(16),
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#52a64a',
    paddingVertical: responsive.padding(12),
    paddingHorizontal: responsive.padding(24),
    borderRadius: responsive.borderRadius(8),
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    marginLeft: responsive.margin(8),
  },
});

export default VitalsHistoryScreen;

