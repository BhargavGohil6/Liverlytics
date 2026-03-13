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
import { fetchAllVitalsForUser, fetchVitalsWithDateFilter } from './slices/vitalsSlice';
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
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [displayCount, setDisplayCount] = useState(10);
  
  const dispatch: AppDispatch = useDispatch();
  const { todayData, loading, error } = useSelector((state: RootState) => state.vitals);
  const [vitalsData, setVitalsData] = useState<any[]>([]);
  
  const today = new Date().toISOString().split('T')[0];
  
  // Get user data from auth state to fetch their vitals
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Fetch initial data when component mounts
  useEffect(() => {
    if (user?.email) {
      // Fetch data for last 7 days by default
      const endDate = new Date();
      const startDateObj = new Date();
      startDateObj.setDate(startDateObj.getDate() - 7);
      
      const startDateStr = startDateObj.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      dispatch(fetchVitalsWithDateFilter({
        user: user.email,
        date_from: startDateStr,
        date_to: endDateStr
      }));
    }
  }, [dispatch, user?.email]);
  
  useEffect(() => {
    // Fetch vitals based on selected date range
    if (user?.email) {
      if (selectedDays === 'Custom' && startDate && endDate) {
        // Custom date range selected
        dispatch(fetchVitalsWithDateFilter({
          user: user.email,
          date_from: startDate,
          date_to: endDate
        }));
      } else if (selectedDays !== 'Custom') {
        // Predefined periods (7, 30, 90 days)
        const endDate = new Date();
        const startDateObj = new Date();
        startDateObj.setDate(startDateObj.getDate() - parseInt(selectedDays));
        
        const startDateStr = startDateObj.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        
        dispatch(fetchVitalsWithDateFilter({
          user: user.email,
          date_from: startDateStr,
          date_to: endDateStr
        }));
      } else {
        // No date range selected - fetch all vitals
        dispatch(fetchAllVitalsForUser(user.email));
      }
    }
  }, [dispatch, user?.email, selectedDays, startDate, endDate]);
  
  const getChartColor = (metric: string, lineIndex: number = 0) => {
    switch(metric) {
      case 'Heart Rate':
      case 'Resting HR':
        return '#4ECDC4'; // Teal
      case 'Glucose':
        return '#FF6B6B'; // Red
      case 'Sleep':
        return '#FF6B6B'; // Red
      case 'SpO₂':
        return '#6BCB77'; // Light Green
      case 'Weight':
        return '#52AB3C'; // Green
      case 'Blood Pressure':
        // Return array of colors for systolic and diastolic
        return lineIndex === 0 ? '#FFD93D' : '#FF6B6B'; // Yellow for systolic, Red for diastolic
      default:
        return '#52a64a'; // Default Green
    }
  };

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
        let value, unit = 'bpm';
        let numericValue = 0; // For chart display
        let systolicValue = 0; // For blood pressure systolic
        let diastolicValue = 0; // For blood pressure diastolic
        
        switch(selectedMetric) {
          case 'Heart Rate':
            value = vital.heart_rate;
            unit = 'bpm';
            numericValue = Number(vital.heart_rate) || 0;
            break;
          case 'Resting HR':
            value = vital.resting_heart_rate;
            unit = 'bpm';
            numericValue = Number(vital.resting_heart_rate) || 0;
            break;
          case 'Glucose':
            value = vital.glucose;
            unit = 'mg/dL';
            numericValue = Number(vital.glucose) || 0;
            break;
          case 'Sleep':
            // Combine sleep_hours and sleep_minutes into total minutes or hours
            const hours = vital.sleep_hours || 0;
            const minutes = vital.sleep_minutes || 0;
            // Display in hours (e.g., "7h 10m" or "7.17h")
            if (hours > 0 && minutes > 0) {
              value = `${hours}h ${minutes}m`;
            } else if (hours > 0) {
              value = `${hours}h`;
            } else if (minutes > 0) {
              value = `${minutes}m`;
            } else {
              value = 0;
            }
            // For chart: convert to decimal hours (e.g., 6h 30m = 6.5 hours)
            numericValue = hours + (minutes / 60); // Decimal hours for chart
            unit = '';
            break;
          case 'SpO₂':
            value = vital.spo2;
            unit = '%';
            numericValue = Number(vital.spo2) || 0;
            break;
          case 'Weight':
            value = vital.weight;
            unit = 'kg';
            numericValue = Number(vital.weight) || 0;
            break;
          case 'Blood Pressure':
            value = vital.blood_pressure;
            unit = 'mmHg';
            // Handle blood pressure format (e.g., "120/80")
            if (value && typeof value === 'string' && value.includes('/')) {
              systolicValue = Number(value.split('/')[0]) || 0;
              diastolicValue = Number(value.split('/')[1]) || 0;
              numericValue = systolicValue; // Use systolic for single value display
            } else {
              // Use separate systolic/diastolic fields if available
              systolicValue = Number(vital.blood_pressure_systolic) || 0;
              diastolicValue = Number(vital.blood_pressure_diastolic) || 0;
              numericValue = systolicValue;
            }
            break;
          default:
            value = vital.heart_rate;
            unit = 'bpm';
            numericValue = Number(vital.heart_rate) || 0;
        }
        
        return {
          date: vital.date ? new Date(vital.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Unknown',
          dateRaw: vital.date ? new Date(vital.date).toISOString().split('T')[0] : '',
          value: value || 0,
          numericValue: numericValue, // Add numeric value for chart
          systolicValue: systolicValue, // Add systolic for BP chart
          diastolicValue: diastolicValue, // Add diastolic for BP chart
          flag: '', // You can implement logic to determine flags based on the data
          source: vital.creation ? 'Manual' : 'Wearable', // Assuming creation means manually entered
          unit: unit,
          rawVital: vital
        };
      });
      
      setVitalsData(transformedData);
    }
  }, [todayData, selectedMetric]);
  
  // Reset display count when data changes
  useEffect(() => {
    setDisplayCount(10);
  }, [vitalsData]);

  const metricsList = ['Heart Rate', 'Resting HR', 'Glucose', 'Sleep', 'SpO₂', 'Weight', 'Blood Pressure'];
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [currentScrollX, setCurrentScrollX] = useState(0);
  
  const scrollLeft = () => {
    const newX = Math.max(0, currentScrollX - 200);
    scrollViewRef.current?.scrollTo({ x: newX, animated: true });
    setCurrentScrollX(newX);
  };
  
  const scrollRight = () => {
    const newX = currentScrollX + 200;
    scrollViewRef.current?.scrollTo({ x: newX, animated: true });
    setCurrentScrollX(newX);
  };

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
      
      // Fetch data for the selected date range
      if (user?.email) {
        dispatch(fetchVitalsWithDateFilter({
          user: user.email,
          date_from: tempStartDate,
          date_to: tempEndDate
        }));
      }
    }
  };

  const resetDateRange = () => {
    setTempStartDate('');
    setTempEndDate('');
    setStartDate('');
    setEndDate('');
    setSelectedDays('7');
    setShowCalendar(false);
    // Refetch data for 7 days
    if (user?.email) {
      const endDate = new Date();
      const startDateObj = new Date();
      startDateObj.setDate(startDateObj.getDate() - 7);
      
      const startDateStr = startDateObj.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      dispatch(fetchVitalsWithDateFilter({
        user: user.email,
        date_from: startDateStr,
        date_to: endDateStr
      }));
    }
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
          {/* Add Entry Button */}
          <View style={styles.topRightButtonContainer}>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddVitalsScreen' as never)}>
              <Icon name="add" size={responsive.fontSize(16)} color="#fff" />
              <Text style={styles.addButtonTextSmall}>Add</Text>
            </TouchableOpacity>
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
        <View style={styles.metricsContainer}>
          <TouchableOpacity
            style={[styles.arrowButton, showLeftArrow ? styles.arrowVisible : styles.arrowHidden]}
            onPress={scrollLeft}
            disabled={!showLeftArrow}
          >
            <Icon name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          
          <ScrollView 
            ref={scrollViewRef}
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.metricsScroll}
            onScroll={(event) => {
              const scrollPosition = event.nativeEvent.contentOffset.x;
              const containerWidth = event.nativeEvent.layoutMeasurement.width;
              const contentWidth = event.nativeEvent.contentSize.width;
              const maxScroll = contentWidth - containerWidth;
              
              setCurrentScrollX(scrollPosition);
              setShowLeftArrow(scrollPosition > 10);
              setShowRightArrow(scrollPosition < maxScroll - 10);
            }}
            scrollEventThrottle={16}
            contentContainerStyle={styles.metricsContent}
          >
            {metricsList.map(
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
          
          <TouchableOpacity
            style={[styles.arrowButton, showRightArrow ? styles.arrowVisible : styles.arrowHidden]}
            onPress={scrollRight}
            disabled={!showRightArrow}
          >
            <Icon name="chevron-forward" size={24} color="#333" />
          </TouchableOpacity>
        </View>

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
                labels: vitalsData.slice(0, 7).map(item => {
                  // For 7 days filter, show day names (Mon, Tue, etc.)
                  // For other filters, show dates (MMM DD)
                  if (selectedDays === '7') {
                    return item.date.substring(0, 3); // First 3 letters (e.g., "Mon")
                  } else {
                    // Format as "MMM DD" (e.g., "Jan 15")
                    // Date format is like "Mon, Jan 15" - extract "Jan 15"
                    const parts = item.date.split(', ');
                    if (parts.length >= 2) {
                      return parts[1]; // Returns "Jan 15"
                    }
                    return item.date;
                  }
                }),
                datasets: selectedMetric === 'Blood Pressure' 
                  ? [
                      {
                        data: vitalsData.slice(0, 7).map(item => item.systolicValue || 0),
                        color: (opacity = 1) => `rgba(255, 217, 61, ${opacity})`, // Yellow for systolic
                      },
                      {
                        data: vitalsData.slice(0, 7).map(item => item.diastolicValue || 0),
                        color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`, // Red for diastolic
                      }
                    ]
                  : [{
                      data: vitalsData.slice(0, 7).map(item => item.numericValue || 0)
                    }],
                legend: selectedMetric === 'Blood Pressure' ? ['Systolic', 'Diastolic'] : [selectedMetric],
              }}
              width={width - responsive.width(48)}
              height={responsive.height(200)}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: selectedMetric === 'SpO₂' ? 1 : 0,
                color: (opacity = 1) => {
                  if (selectedMetric === 'Blood Pressure') {
                    // This will be overridden by dataset-specific colors
                    return `rgba(255, 217, 61, ${opacity})`;
                  }
                  const hexColor = getChartColor(selectedMetric);
                  const r = parseInt(hexColor.substring(1, 3), 16);
                  const g = parseInt(hexColor.substring(3, 5), 16);
                  const b = parseInt(hexColor.substring(5, 7), 16);
                  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
                },
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                strokeWidth: responsive.width(2),
                style: { borderRadius: responsive.borderRadius(16) },
                propsForDots: {
                  r: responsive.width(4),
                  strokeWidth: responsive.width(2),
                  stroke: selectedMetric === 'Blood Pressure' ? '#FFD93D' : getChartColor(selectedMetric)
                },
                formatYLabel: (ylabel) => {
                  // Special formatting for sleep chart (show as decimal hours)
                  if (selectedMetric === 'Sleep') {
                    const numValue = Number(ylabel);
                    // Round to 1 decimal place
                    return numValue.toFixed(1) + 'h';
                  }
                  return ylabel;
                },
                propsForLabels: {
                  fontSize: selectedDays === '7' ? 12 : 10,
                  fontWeight: selectedDays === '7' ? '500' : '400',
                }
              }}
              bezier
              style={styles.chart}
            />
          ) : (
            <Text style={{ textAlign: 'center', padding: responsive.padding(20) }}>No data available</Text>
          )}
          <View style={styles.chartLegend}>
            {selectedMetric === 'Blood Pressure' ? (
              <>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#FFD93D' }]} />
                  <Text style={styles.legendText}>Systolic</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
                  <Text style={styles.legendText}>Diastolic</Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: getChartColor(selectedMetric) }]} />
                  <Text style={styles.legendText}>Measured</Text>
                </View>
                {/* <View style={styles.legendItem}>
                  <Icon name="warning-outline" size={responsive.fontSize(16)} color="#666" />
                  <Text style={styles.legendText}>AI anomaly</Text>
                </View> */}
                <View style={styles.legendItem}>
                  <Icon name="pulse-outline" size={responsive.fontSize(16)} color="#666" />
                  <Text style={styles.legendText}>Variable with spikes</Text>
                </View>
              </>
            )}
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
          {vitalsData.slice(0, displayCount).map((item, index) => (
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
          ))}
          
          {/* Load More Button */}
          {vitalsData.length > displayCount && (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={() => setDisplayCount(prev => prev + 10)}
            >
              <Text style={styles.loadMoreButtonText}>Load More</Text>
              <Icon name="chevron-down" size={20} color="#fff" />
            </TouchableOpacity>
          )}
          
          {vitalsData.length === 0 && (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>No data available</Text>
            </View>
          )}
        </View>


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
  topRightButtonContainer: {
    position: 'absolute',
    right: responsive.margin(16),
    top: responsive.margin(20),
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
  metricsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: responsive.margin(1),
    paddingVertical: responsive.padding(12),
  },
  arrowButton: {
    padding: responsive.padding(8),
    zIndex: 10,
  },
  arrowVisible: {
    opacity: 1,
  },
  arrowHidden: {
    opacity: 0,
  },
  metricsScroll: {
    flex: 1,
  },
  metricsContent: {
    paddingHorizontal: responsive.padding(8),
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
  loadMoreButton: {
    backgroundColor: '#52a64a',
    paddingVertical: responsive.padding(12),
    paddingHorizontal: responsive.padding(24),
    borderRadius: responsive.borderRadius(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsive.margin(16),
    alignSelf: 'center',
  },
  loadMoreButtonText: {
    color: '#fff',
    fontSize: responsive.fontSize(14),
    fontWeight: '600',
    marginRight: responsive.margin(8),
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
    paddingVertical: responsive.padding(8),
    paddingHorizontal: responsive.padding(12),
    borderRadius: responsive.borderRadius(20),
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    marginLeft: responsive.margin(8),
  },
  addButtonTextSmall: {
    color: '#fff',
    fontSize: responsive.fontSize(12),
    fontWeight: '600',
    marginLeft: responsive.margin(4),
  },
});

export default VitalsHistoryScreen;

