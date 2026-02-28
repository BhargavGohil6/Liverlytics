// src/screens/ExerciseHistoryScreen.tsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar, DateData } from 'react-native-calendars';
import { format } from 'date-fns';
import { LineChart } from 'react-native-chart-kit';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import responsive from '../../theme/responsive';
import colors from '../../theme/color';
import CommonLoader from '../../components/CommonLoader';
import CommonButton from '../../components/CommonButton';
import { getExerciseHistory } from './slices/exerciseSlice';

const { width } = Dimensions.get('window');

type ExerciseHistoryScreenProps = {
  navigation: any; // Using 'any' for navigation as per project patterns
};

const ExerciseHistoryScreen = ({ navigation }: ExerciseHistoryScreenProps) => {
  const dispatch: AppDispatch = useDispatch();
  const { history, historyLoading, historyError } = useSelector((state: any) => state.exercise);
  const { user } = useSelector((state: any) => state.auth);
  
  const [selectedTab, setSelectedTab] = useState<string>('All');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('7');
  const [selectedChartTab, setSelectedChartTab] = useState<string>('Steps');
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [tempStartDate, setTempStartDate] = useState<string>('');
  const [tempEndDate, setTempEndDate] = useState<string>('');
  
  interface LogEntry {
    date: string;
    timestamp: number;
    steps: number;
    sleep: string;
    rhr: number;
    ahr: number;
    oxygen: number;
    calories: number;
    bp: string;
    synced: boolean;
  }

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(5); // Initial page size is 5 records
  const [paginatedLogs, setPaginatedLogs] = useState<LogEntry[]>([]);
  const [hasMoreLogs, setHasMoreLogs] = useState<boolean>(false);

  // Refs and state for chart tabs scrolling
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollViewOffset, setScrollViewOffset] = useState<number>(0);
  const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<boolean>(true);

  const convertMinutesToHours = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Transform API data to match UI format and sort by date descending (newest first)
  const logs: LogEntry[] = useMemo(() => {
    return history && Array.isArray(history) ? history.map((item: any) => {
      let dateObj = new Date();
      if (item.creation) {
        const dateStr = item.creation.replace(' ', 'T');
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) dateObj = d;
      }
      
      return {
        date: format(dateObj, 'dd MMM yyyy'),
        timestamp: dateObj.getTime(),
        steps: parseInt(item.steps) || 0,
        sleep: convertMinutesToHours(parseInt(item.sleep_minutes) || 0),
        rhr: parseInt(item.resting_hr) || 0,
        ahr: parseInt(item.active_hr) || 0,
        oxygen: parseFloat(item.oxygen_saturation) || 0,
        calories: parseInt(item.calories_burned) || 0,
        bp: item.blood_pressure || 'N/A',
        synced: true,
      };
    }).sort((a, b) => b.timestamp - a.timestamp) : [];
  }, [history]);

  // Calculate chart data based on selected period and history data
  const calculateChartData = () => {
    if (!logs || logs.length === 0) {
      return {
        labels: ['', '', '', '', '', '', ''],
        datasets: [
          { data: [0, 0, 0, 0, 0, 0, 0], strokeWidth: responsive.width(2) },
        ],
      };
    }
    
    // Filter logs based on selected period
    let filteredLogs = [...logs];
    
    if (selectedPeriod === 'Custom' && startDate && endDate) {
      filteredLogs = logs.filter(log => {
        const logDateStr = format(new Date(log.timestamp), 'yyyy-MM-dd');
        return logDateStr >= startDate && logDateStr <= endDate;
      });
    } else {
      switch (selectedPeriod) {
        case '7':
          filteredLogs = logs.slice(0, 7);
          break;
        case '30':
          filteredLogs = logs.slice(0, 30);
          break;
        case '90':
          filteredLogs = logs.slice(0, 90);
          break;
        default:
          break;
      }
    }
    
    // Check if filtered logs are empty after applying date filter
    if (!filteredLogs || filteredLogs.length === 0) {
      return {
        labels: ['', '', '', '', '', '', ''],
        datasets: [
          { data: [0, 0, 0, 0, 0, 0, 0], strokeWidth: responsive.width(2) },
        ],
      };
    }
    
    // Take the newest N items based on the selected period
    const maxItems = selectedPeriod === '7' ? 7 : 
                   selectedPeriod === '30' ? 30 : 
                   selectedPeriod === '90' ? 90 :
                   selectedPeriod === 'Custom' ? filteredLogs.length : 7;
    
    // Since logs are newest first, slice(0, maxItems) gives the most recent ones.
    // Then reverse them to show chronologically on the chart (oldest to newest).
    const recentLogs = [...filteredLogs.slice(0, maxItems)].reverse();
    
    // Create labels based on dates
    const labels = recentLogs.map((log, index) => {
      // Avoid overlapping of labels by showing only a subset based on the period
      let showLabel = false;
      if (recentLogs.length <= 8) {
        showLabel = true; 
      } else if (recentLogs.length <= 31) {
        showLabel = index % 4 === 0 || index === recentLogs.length - 1; 
      } else {
        showLabel = index % 10 === 0 || index === recentLogs.length - 1; 
      }

      if (!showLabel) return '';

      return format(new Date(log.timestamp), 'dd/MM'); // e.g., "07/02"
    });
    
    // Return data for the selected chart tab
    switch (selectedChartTab) {
      case 'Steps':
        const stepsData = recentLogs.map(log => log.steps);
        return {
          labels,
          datasets: [{ data: stepsData, strokeWidth: responsive.width(2) }],
        };
      case 'Sleep':
        const sleepData = recentLogs.map(log => {
          const [hoursStr, minutesStr] = log.sleep.split('h ');
          const hours = parseInt(hoursStr) || 0;
          const minutes = parseInt(minutesStr.replace('m', '')) || 0;
          return hours * 60 + minutes;
        });
        return {
          labels,
          datasets: [{ data: sleepData, strokeWidth: responsive.width(2) }],
        };
      case 'Resting HR':
        const rhrData = recentLogs.map(log => log.rhr);
        return {
          labels,
          datasets: [{ data: rhrData, strokeWidth: responsive.width(2) }],
        };
      case 'Active HR':
        const ahrData = recentLogs.map(log => log.ahr);
        return {
          labels,
          datasets: [{ data: ahrData, strokeWidth: responsive.width(2) }],
        };
      case 'Oxygen':
        const oxygenData = recentLogs.map(log => log.oxygen);
        return {
          labels,
          datasets: [{ data: oxygenData, strokeWidth: responsive.width(2) }],
        };
      case 'Calories':
        const caloriesData = recentLogs.map(log => log.calories);
        return {
          labels,
          datasets: [{ data: caloriesData, strokeWidth: responsive.width(2) }],
        };
      default:
        const defaultData = recentLogs.map(log => log.steps);
        return {
          labels,
          datasets: [{ data: defaultData, strokeWidth: responsive.width(2) }],
        };
    }
  };
  
  const chartData = calculateChartData();

  const getChartColor = (tab: string) => {
    switch(tab) {
      case 'Steps':
        return '#52AB3C';
      case 'Sleep':
        return '#FF6B6B';
      case 'Resting HR':
        return '#4ECDC4';
      case 'Active HR':
        return '#FFD93D';
      case 'Oxygen':
        return '#6BCB77';
      case 'Calories':
        return '#FF6B6B';
      default:
        return '#52AB3C';
    }
  };

  const getDatesInRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates: string[] = [];

    // If start date is after end date, swap them
    const actualStart = start <= end ? start : end;
    const actualEnd = start <= end ? end : start;
    
    const date = new Date(actualStart.getTime());
    
    // Add one day at a time until we reach the end date
    while (date <= actualEnd) {
      dates.push(format(date, 'yyyy-MM-dd'));
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  useFocusEffect(
    React.useCallback(() => {
      // Fetch exercise history from API via Redux
      if (user && user.email) {
        dispatch(getExerciseHistory({ user: user.email }));
      }
    }, [dispatch, user])
  );

  // Reset pagination when logs change
  useEffect(() => {
    if (logs && logs.length > 0) {
      // Show first 5 records initially
      const initialLogs = logs.slice(0, 5);
      setPaginatedLogs(initialLogs);
      // Check if there are more logs available
      setHasMoreLogs(logs.length > 5);
      // Reset to first page
      setCurrentPage(1);
    } else {
      setPaginatedLogs([]);
      setHasMoreLogs(false);
      setCurrentPage(1);
    }
  }, [logs]);
  
  // Load more logs when button is pressed
  const loadMoreLogs = useCallback(() => {
    // For the first load (after initial 5), we load 10 more
    // For subsequent loads, we load 10 more each time
    const currentLength = paginatedLogs.length;
    const nextBatchSize = 10; // Load 10 records at a time after the initial 5
    const nextLogs = logs.slice(currentLength, currentLength + nextBatchSize);
      
    // Update the paginated logs with the new batch
    setPaginatedLogs(prevLogs => [...prevLogs, ...nextLogs]);
      
    // Check if there are more logs available after loading
    const remainingLogs = logs.length - (currentLength + nextBatchSize);
    setHasMoreLogs(remainingLogs > 0);
  }, [logs, paginatedLogs.length]);
  
  // Helper function to calculate trend percentage
  const calculateTrend = (data: LogEntry[], metric: keyof LogEntry) => {
    if (!data || data.length < 2) return '0';
      
    // Convert values to numbers, handling sleep string conversion
    const getNumericValue = (item: LogEntry, m: keyof LogEntry) => {
      if (m === 'sleep') {
        // Convert "7h 30m" to minutes
        const [hoursStr, minutesStr] = item[m].split('h ');
        const hours = parseInt(hoursStr) || 0;
        const minutes = parseInt(minutesStr.replace('m', '')) || 0;
        return hours * 60 + minutes;
      }
      return Number(item[m]);
    };
      
    const recentValues = data.slice(0, 3).map(item => getNumericValue(item, metric)); // Last 3 entries
    const earlierValues = data.slice(3, 6).map(item => getNumericValue(item, metric)); // Previous 3 entries
      
    if (recentValues.length === 0 || earlierValues.length === 0 || recentValues.every(val => isNaN(val)) || earlierValues.every(val => isNaN(val))) return '0';
      
    const recentAvg = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
    const earlierAvg = earlierValues.reduce((sum, val) => sum + val, 0) / earlierValues.length;
      
    if (earlierAvg === 0) return recentAvg > 0 ? '+100' : '0';
      
    const trend = ((recentAvg - earlierAvg) / earlierAvg) * 100;
    return trend >= 0 ? `+${Math.round(trend)}` : `${Math.round(trend)}`;
  };
  
  // Helper function to calculate average sleep
  const calculateAverageSleep = (data: LogEntry[]) => {
    if (!data || data.length === 0) return '0h 0m';
    
    const validData = data.filter(log => log.sleep && log.sleep !== '');
    if (validData.length === 0) return '0h 0m';
    
    const totalSleepInMinutes = validData.reduce((sum, log) => {
      const [hoursStr, minutesStr] = log.sleep.split('h ');
      const hours = parseInt(hoursStr) || 0;
      const minutes = parseInt(minutesStr.replace('m', '')) || 0;
      return sum + (hours * 60 + minutes);
    }, 0);
    
    const avgSleepInMinutes = totalSleepInMinutes / validData.length;
    const avgHours = Math.floor(avgSleepInMinutes / 60);
    const avgMinutes = Math.round(avgSleepInMinutes % 60);
    
    return `${avgHours}h ${avgMinutes}m`;
  };
  
  const getSleepInMinutes = (sleepString: string) => {
    const [hoursStr, minutesStr] = sleepString.split('h ');
    const hours = parseInt(hoursStr) || 0;
    const minutes = parseInt(minutesStr.replace('m', '')) || 0;
    return hours * 60 + minutes;
  };
  
  // Handler for download buttons
  const handleDownloadCSV = () => {
    // Implement CSV download functionality
    console.log('Downloading CSV...');
  };
  
  const handleDownloadPDF = () => {
    // Implement PDF download functionality
    console.log('Downloading PDF Report...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
      

        {/* Title */}
        <View style={styles.titleSection}>
          <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Go back" accessibilityRole="button">
            <Icon name="arrow-back" size={responsive.fontSize(24)} color={colors.darkGray} />
          </TouchableOpacity>
          <View style={styles.titleContent}>
            <Text style={styles.title} accessibilityRole="header">Exercise History</Text>
            <Text style={styles.subtitle}>
              View your exercise metrics including heart rate, oxygen, calories, and blood pressure trends.
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['7', '30', '90', 'Custom'].map((period) => {
              const periodLabel = period === 'Custom' ? 'Custom' : `${period} Days`;
              return (
                <TouchableOpacity
                  key={period}
                  style={[styles.periodButton, selectedPeriod === period && styles.periodActive]}
                  onPress={() => {
                    if (period === 'Custom') {
                      setShowCalendar(true);
                    } else {
                      setSelectedPeriod(period);
                      setStartDate('');
                      setEndDate('');
                    }
                  }}
                >
                  <Text style={styles.periodText}>{periodLabel}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        
        {/* Selected Date Range */}
        {selectedPeriod === 'Custom' && (startDate || endDate) && (
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

        {/* Trends Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Icon name="trending-up-outline" size={responsive.fontSize(20)} color={colors.darkGray} />
            <Text style={styles.chartTitle}>Trends</Text>
            <Text style={styles.chartSubtitle}>
              {selectedPeriod === 'Custom' && startDate && endDate 
                ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()} • ${selectedChartTab}`
                : `Last ${selectedPeriod} days • ${selectedChartTab}`}
            </Text>
          </View>
          <View style={styles.chartTabsContainer}>
            {showLeftArrow && (
              <TouchableOpacity 
                style={styles.arrowButton} 
                onPress={() => {
                  const newOffset = Math.max(0, scrollViewOffset - 100);
                  scrollViewRef.current?.scrollTo({ x: newOffset, y: 0, animated: true });
                }}
                accessibilityLabel="Scroll left"
              >
                <Icon name="chevron-back" size={20} color={colors.darkGray} />
              </TouchableOpacity>
            )}
            <ScrollView 
              ref={scrollViewRef}
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.chartTabs}
              onScroll={(event) => {
                setScrollViewOffset(event.nativeEvent.contentOffset.x);
                // Update arrow visibility based on scroll position
                const offsetX = event.nativeEvent.contentOffset.x;
                setShowLeftArrow(offsetX > 10); // Show left arrow if scrolled more than 10px
                
                // For right arrow visibility, we need to calculate if there's more content
                const { width } = event.nativeEvent.layoutMeasurement;
                const contentWidth = event.nativeEvent.contentSize.width;
                setShowRightArrow(width + offsetX < contentWidth - 10);
              }}
              scrollEventThrottle={16}
            >
              {['Steps', 'Sleep', 'Resting HR', 'Active HR', 'Oxygen', 'Calories'].map((tab) => (
                <TouchableOpacity 
                  accessibilityRole="button" 
                  key={tab} 
                  style={[styles.chartTab, selectedChartTab === tab && styles.chartTabActive]}
                  onPress={() => setSelectedChartTab(tab)}
                >
                  <Text style={[styles.chartTabText, selectedChartTab === tab && styles.chartTabTextActive]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {showRightArrow && (
              <TouchableOpacity 
                style={styles.arrowButton} 
                onPress={() => {
                  const newOffset = scrollViewOffset + 100;
                  scrollViewRef.current?.scrollTo({ x: newOffset, y: 0, animated: true });
                }}
                accessibilityLabel="Scroll right"
              >
                <Icon name="chevron-forward" size={20} color={colors.darkGray} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: getChartColor(selectedChartTab) }]} />
              <Text style={styles.legendText}>{selectedChartTab}</Text>
            </View>
          </View>
          {chartData.datasets && chartData.datasets.length > 0 && chartData.datasets[0].data && chartData.datasets[0].data.some(value => value !== 0) ? (
            <LineChart
              data={chartData}
              width={width - responsive.width(64)} // 32 for margins (16 each side) + 32 for card padding (16 each side)
              height={responsive.height(240)}
              chartConfig={{
                backgroundColor: colors.white,
                backgroundGradientFrom: colors.white,
                backgroundGradientTo: colors.white,
                decimalPlaces: selectedChartTab === 'Oxygen' ? 1 : 0,
                color: (opacity = 1) => {
                  const hexColor = getChartColor(selectedChartTab);
                  const r = parseInt(hexColor.substring(1, 3), 16);
                  const g = parseInt(hexColor.substring(3, 5), 16);
                  const b = parseInt(hexColor.substring(5, 7), 16);
                  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
                },
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`, // colors.coolGray
                style: {
                  borderRadius: responsive.borderRadius(16),
                },
                propsForDots: {
                  r: responsive.width(4),
                  strokeWidth: responsive.width(2),
                  stroke: getChartColor(selectedChartTab)
                }
              }}
              bezier
              withDots={true}
              withInnerLines={true}
              withOuterLines={false}
              withVerticalLabels={true}
              verticalLabelRotation={30}
              style={styles.chart}
            />
          ) : (
            <View style={styles.noDataChartContainer}>
              <Text style={styles.noDataChartText}>No data available for selected period</Text>
            </View>
          )}
          <View style={styles.trendStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>{selectedChartTab} Trend</Text>
              <View style={styles.statValueContainer}>
                <Icon 
                  name={calculateTrend(logs, selectedChartTab.toLowerCase().includes('resting') ? 'rhr' : 
                       selectedChartTab.toLowerCase().includes('active') ? 'ahr' : 
                       selectedChartTab.toLowerCase() === 'oxygen' ? 'oxygen' :
                       selectedChartTab.toLowerCase() === 'calories' ? 'calories' :
                       selectedChartTab.toLowerCase() === 'sleep' ? 'sleep' : 'steps').startsWith('+') ? 'trending-up' : 'trending-down'} 
                  size={responsive.fontSize(14)} 
                  color={getChartColor(selectedChartTab)} 
                />
                <Text style={[styles.statValue, { color: getChartColor(selectedChartTab) }]}>                  
                  {calculateTrend(logs, selectedChartTab.toLowerCase().includes('resting') ? 'rhr' : 
                                              selectedChartTab.toLowerCase().includes('active') ? 'ahr' : 
                                              selectedChartTab.toLowerCase() === 'oxygen' ? 'oxygen' :
                                              selectedChartTab.toLowerCase() === 'calories' ? 'calories' :
                                              selectedChartTab.toLowerCase() === 'sleep' ? 'sleep' : 'steps')}%
                </Text>
              </View>
            </View>
            {selectedChartTab.toLowerCase() === 'sleep' ? (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Avg Sleep</Text>
                <Text style={styles.statValue}>{calculateAverageSleep(logs)}</Text>
              </View>
            ) : selectedChartTab.toLowerCase() === 'oxygen' ? (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Avg Oxygen</Text>
                <Text style={styles.statValue}>
                  {logs.length > 0 ? (logs.reduce((sum, log) => {
                    if (isNaN(log.oxygen)) return sum;
                    return sum + log.oxygen;
                  }, 0) / logs.filter(log => !isNaN(log.oxygen)).length).toFixed(1) : 0}%
                </Text>
              </View>
            ) : (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total</Text>
                <Text style={styles.statValue}>
                  {logs.length > 0 ? logs.reduce((sum, log) => {
                    let value;
                    if (selectedChartTab.toLowerCase().includes('resting')) {
                      value = isNaN(log.rhr) ? 0 : log.rhr;
                    } else if (selectedChartTab.toLowerCase().includes('active')) {
                      value = isNaN(log.ahr) ? 0 : log.ahr;
                    } else if (selectedChartTab.toLowerCase() === 'calories') {
                      value = isNaN(log.calories) ? 0 : log.calories;
                    } else if (selectedChartTab.toLowerCase() === 'sleep') {
                      value = isNaN(getSleepInMinutes(log.sleep)) ? 0 : getSleepInMinutes(log.sleep);
                    } else {
                      value = isNaN(log.steps) ? 0 : log.steps;
                    }
                    return sum + value;
                  }, 0) : 0}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Calendar Modal */}
        <Modal
          visible={showCalendar}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCalendar(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Date Range</Text>
                <TouchableOpacity onPress={() => setShowCalendar(false)}>
                  <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <Calendar
                current={new Date().toISOString().split('T')[0]}
                minDate={'2020-01-01'}
                maxDate={new Date().toISOString().split('T')[0]}
                onDayPress={(day) => {
                  if (!tempStartDate || (tempStartDate && tempEndDate)) {
                    // First selection or resetting after complete selection
                    setTempStartDate(day.dateString);
                    setTempEndDate('');
                  } else {
                    // Second selection - determine which is start and which is end
                    const selectedDate = new Date(day.dateString);
                    const currentStartDate = new Date(tempStartDate);
                    
                    if (selectedDate < currentStartDate) {
                      // Selected date is earlier than current start date
                      setTempStartDate(day.dateString);
                      setTempEndDate(tempStartDate);
                    } else {
                      // Selected date is later than or equal to current start date
                      setTempEndDate(day.dateString);
                    }
                  }
                }}
                markedDates={{
                  [tempStartDate]: {selected: true, startingDay: true, color: colors.primary},
                  ...(tempEndDate && {
                    [tempEndDate]: {selected: true, endingDay: true, color: colors.primary},
                  }),
                  ...(tempStartDate && tempEndDate && {
                    ...getDatesInRange(tempStartDate, tempEndDate).reduce((acc, date) => ({
                      ...acc,
                      [date]: {selected: true, color: colors.primary + '80'},
                    }), {}),
                  }),
                }}
                markingType="period"
                theme={{
                  todayTextColor: colors.primary,
                  selectedDayBackgroundColor: colors.primary,
                  arrowColor: colors.primary,
                  monthTextColor: colors.darkGray,
                  textMonthFontWeight: '600',
                  textDayFontSize: 16,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 14,
                }}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setTempStartDate('');
                    setTempEndDate('');
                    setShowCalendar(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.resetButton]}
                  onPress={() => {
                    setTempStartDate('');
                    setTempEndDate('');
                  }}
                >
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.applyButton, (!tempStartDate || !tempEndDate) && styles.disabledButton]}
                  onPress={() => {
                    if (tempStartDate && tempEndDate) {
                      setStartDate(tempStartDate);
                      setEndDate(tempEndDate);
                      setSelectedPeriod('Custom');
                      setShowCalendar(false);
                    }
                  }}
                  disabled={!tempStartDate || !tempEndDate}
                >
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* AI Insights */}
        <View style={styles.newAiInsightsCard}>
          <View style={styles.insightsHeader}>
            <View style={styles.sectionTitleRow}>
              <Icon name="sparkles" size={20} color="#1A1A1A" />
              <Text style={styles.newInsightsTitle}>AI Insights</Text>
            </View>
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>Today</Text>
            </View>
          </View>

          <View style={styles.newInsightBox}>
            {/* Steps Insight */}
            <View style={[styles.insightItem, { backgroundColor: '#FFF8E1' }]}>              
              <Icon name="trending-down" size={22} color="#FBC02D" style={styles.insightIcon} />
              <View style={styles.insightContent}>
                <Text style={[styles.insightItemText, { color: '#FBC02D' }]}>Activity Level</Text>
                <Text style={styles.insightItemSubText}>Your steps this week are lower than last week.</Text>
              </View>
            </View>
            
            {/* Sleep Insight */}
            <View style={[styles.insightItem, { backgroundColor: '#FEECEE' }]}>              
              <Icon name="moon" size={22} color="#D32F2F" style={styles.insightIcon} />
              <View style={styles.insightContent}>
                <Text style={[styles.insightItemText, { color: '#D32F2F' }]}>Sleep Pattern</Text>
                <Text style={styles.insightItemSubText}>Sleep duration shows mild downward trend.</Text>
              </View>
            </View>
            
            {/* Heart Rate Insight */}
            <View style={[styles.insightItem, { backgroundColor: '#E8F5E9' }]}>              
              <Icon name="heart" size={22} color="#43A047" style={styles.insightIcon} />
              <View style={styles.insightContent}>
                <Text style={[styles.insightItemText, { color: '#43A047' }]}>Heart Rate</Text>
                <Text style={styles.insightItemSubText}>Resting HR increased on 3 days compared to your baseline.</Text>
              </View>
            </View>
            
            <Text style={styles.disclaimerText}>
              These insights are informational only and not a diagnosis.
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
            <Icon name="list-outline" size={responsive.fontSize(20)} color={colors.darkGray} />
            <Text style={styles.logsTitle}>Logs</Text>
            <Text style={styles.logsSubtitle}>Chronological • Most recent first</Text>
          </View>

          {!historyLoading && paginatedLogs && paginatedLogs.length > 0 && paginatedLogs.map((log, index) => (
            <View key={index} style={styles.logCard}>
              <View style={styles.logHeader}>
                <Text style={styles.logDate}>{log.date}</Text>
                <Text style={styles.logStatus}>{log.synced ? 'Synced' : 'Manual'}</Text>
              </View>
              <View style={styles.logStats}>
                <View style={styles.logStatsRow}>
                  <Text style={styles.logStat}>Steps: {log.steps}</Text>
                  <Text style={styles.logStat}>Sleep: {log.sleep}</Text>
                  <Text style={styles.logStat}>RHR: {log.rhr} bpm</Text>
                </View>
                <View style={styles.logStatsRow}>
                  <Text style={styles.logStat}>AHR: {log.ahr} bpm</Text>
                  <Text style={styles.logStat}>Oxygen: {log.oxygen}%</Text>
                  <Text style={styles.logStat}>Cal: {log.calories}</Text>
                  <Text style={styles.logStat}>BP: {log.bp}</Text>
                </View>
              </View>
              {/* <TouchableOpacity accessibilityRole="button" style={styles.expandButton}>
                <Text style={styles.expandText}>Tap to expand</Text>
              </TouchableOpacity> */}
            </View>
          ))}
          {!historyLoading && paginatedLogs && paginatedLogs.length === 0 && (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No exercise history found for selected period</Text>
            </View>
          )}
          {historyLoading && (
            <CommonLoader visible={true} message="Loading exercise history..." />
          )}
          
          {/* Load More Button */}
          {!historyLoading && hasMoreLogs && (
            <View style={styles.loadMoreContainer}>
              <CommonButton
                title="Load More"
                onPress={loadMoreLogs}
                bgColor={colors.primary}
                textColor={colors.white}
                style={styles.loadMoreButton}
              />
            </View>
          )}
        </View>

        {/* Download Buttons */}
        {/* <View style={styles.downloadSection}>
          <CommonButton 
            title="Download CSV" 
            onPress={handleDownloadCSV}
            bgColor={colors.white}
            textColor={colors.darkGray}
            style={styles.downloadButton}
          />
          <CommonButton 
            title="Download PDF Report" 
            onPress={handleDownloadPDF}
            bgColor={colors.primary}
            textColor={colors.white}
            style={styles.downloadButtonPrimary}
          />
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Calendar Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  applyButton: {
    backgroundColor: colors.primary,
  },
  resetButton: {
    backgroundColor: '#f0f0f0',
  },
  disabledButton: {
    opacity: 0.5,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  resetButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  scrollContent: {
    paddingBottom: responsive.height(32),
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
    backgroundColor: colors.white,
    marginTop: responsive.margin(8),
    paddingVertical: responsive.padding(8),
  },
  periodButton: {
    paddingVertical: responsive.padding(8),
    paddingHorizontal: responsive.padding(16),
    marginHorizontal: responsive.margin(8),
    borderRadius: responsive.borderRadius(20),
    backgroundColor: colors.gray100,
  },
  periodActive: {
    backgroundColor: colors.primary,
  },
  periodText: {
    fontSize: responsive.fontSize(13),
    color: colors.darkGray,
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
  chartSubtitle: {
    fontSize: responsive.fontSize(13),
    color: colors.coolGray,
    marginTop: responsive.margin(4),
  },
  chartTabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(12),
    paddingRight: responsive.padding(8),
    justifyContent: 'flex-start',
  },
  chartTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: responsive.padding(30),
  },
  chartTab: {
    paddingVertical: responsive.padding(6),
    paddingHorizontal: responsive.padding(12),
    marginRight: responsive.margin(8),
    borderRadius: responsive.borderRadius(6),
    backgroundColor: colors.gray100,
  },
  chartTabActive: {
    backgroundColor: colors.primary,
  },
  chartTabText: {
    fontSize: responsive.fontSize(13),
    color: colors.gray,
  },
  chartTabTextActive: {
    color: colors.white,
  },
  arrowButton: {
    paddingHorizontal: responsive.padding(4),
    paddingVertical: responsive.padding(8),
    justifyContent: 'center',
  },
  chartLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: responsive.margin(12),
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
    marginRight: responsive.margin(6),
  },
  legendText: {
    fontSize: responsive.fontSize(12),
    color: colors.coolGray,
  },
  chart: {
    marginVertical: responsive.margin(8),
    borderRadius: responsive.borderRadius(16),
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
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.width(4),
  },
  statValue: {
    fontSize: responsive.fontSize(18),
    fontWeight: '700',
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
    marginVertical: responsive.margin(8),
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
    marginBottom: responsive.margin(8),
  },
  logStatsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: responsive.margin(4),
  },
  logStat: {
    fontSize: responsive.fontSize(14),
    color: colors.gray,
    marginRight: responsive.margin(12),
    marginBottom: responsive.margin(4),
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
    paddingHorizontal: responsive.padding(16),
    paddingVertical: responsive.padding(12),
    gap: responsive.margin(12),
  },
  downloadButton: {
    flex: 1,
    backgroundColor: colors.white,
    paddingVertical: responsive.padding(12),
    borderRadius: responsive.borderRadius(8),
    borderWidth: 1,
    borderColor: colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButtonPrimary: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: responsive.padding(12),
    borderRadius: responsive.borderRadius(8),
    alignItems: 'center',
    justifyContent: 'center',
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
  noDataChartContainer: {
    height: responsive.height(240),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: responsive.borderRadius(16),
    marginVertical: responsive.margin(8),
  },
  noDataChartText: {
    fontSize: responsive.fontSize(14),
    color: colors.coolGray,
    textAlign: 'center',
  },
  // New AI Insights Styles (matching dashboard design)
  newAiInsightsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: responsive.margin(16),
    marginVertical: responsive.margin(8),
    padding: responsive.padding(18),
    borderRadius: responsive.borderRadius(20),
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
  },
  insightsHeader: {
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
    width: '100%',
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
    flexWrap: 'wrap',
  },
  disclaimerText: {
    fontSize: responsive.fontSize(12),
    color: '#9E9E9E',
    marginTop: responsive.margin(8),
    textAlign: 'left',
    lineHeight: responsive.height(18),
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
  loadMoreContainer: {
    marginTop: responsive.margin(16),
    paddingHorizontal: responsive.padding(16),
    alignItems: 'center',
  },
  loadMoreButton: {
    width: '100%',
  },
});

export default ExerciseHistoryScreen;