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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LineChart } from 'react-native-chart-kit';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllVitalsForUser } from './slices/vitalsSlice';
import { AppDispatch, RootState } from '../../redux/store';
import responsive from '../../theme/responsive'; // Import responsive scaling functions

const { width } = Dimensions.get('window');

interface VitalsHistoryScreenProps {
  navigation: any; // Replace with proper navigation type
}

const VitalsHistoryScreen: React.FC<VitalsHistoryScreenProps> = ({ navigation }) => {
  const [selectedDays, setSelectedDays] = useState('7');
  const [selectedMetric, setSelectedMetric] = useState('Heart Rate');
  
  const dispatch: AppDispatch = useDispatch();
  const { todayData, loading, error } = useSelector((state: RootState) => state.vitals);
  const [vitalsData, setVitalsData] = useState<any[]>([]);
  
  // Get user data from auth state to fetch their vitals
  const { user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    // Fetch all vitals for the current user when the component mounts
    if (user?.email) {
      dispatch(fetchAllVitalsForUser(user.email));
    } else {
      // For testing purposes, use a default email
      dispatch(fetchAllVitalsForUser('pareshwaghela18mukesoft@gmail.com'));
    }
  }, [dispatch, user?.email]);
  
  // Process the fetched data when it's available
  useEffect(() => {
    if (todayData && todayData.data) {
      // Convert the API response to the format expected by the UI
      const processedData = Array.isArray(todayData.data) ? todayData.data : [todayData.data];
      
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
          case 'Steps':
            value = vital.steps;
            unit = '';
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        {/* <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Icon name="trending-up" size={responsive.fontSize(24)} color="#fff" />
            </View>
            <Text style={styles.logoText}>Liverlytics</Text>
          </View>
        </View> */}

        {/* Title Section */}
        <View style={styles.titleSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={responsive.fontSize(24)} color="#333" />
          </TouchableOpacity>
          <View style={styles.titleTextContainer}>
            <Text style={styles.title}>Vitals History</Text>
            <Text style={styles.subtitle}>Track changes in your health over time</Text>
          </View>
        </View>

        {/* Time Period Selector */}
        <View style={styles.periodSelector}>
          {['7 Days', '30 Days', '90 Days', 'Custom'].map((period, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.periodButton,
                selectedDays === period.split(' ')[0] && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedDays(period.split(' ')[0])}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedDays === period.split(' ')[0] && styles.periodTextActive,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Metrics Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.metricsScroll}>
          {['Heart Rate', 'Resting HR', 'Steps', 'Sleep', 'SpO₂', 'Weight', 'Blood Pressure'].map(
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
            <Text style={styles.chartSubtitle}>Last {selectedDays} days • {selectedMetric}</Text>
          </View>
          {loading ? (
            <Text style={{ textAlign: 'center', padding: responsive.padding(20) }}>Loading vitals data...</Text>
          ) : error ? (
            <Text style={{ textAlign: 'center', padding: responsive.padding(20), color: 'red' }}>Error: {error}</Text>
          ) : vitalsData.length > 0 ? (
            <LineChart
              data={{
                labels: vitalsData.slice(0, 7).map(item => item.date.substring(0, 3)), // Use first 3 letters of the date
                datasets: [{ data: vitalsData.slice(0, 7).map(item => Number(item.value)) }],
                legend: ["Vital Value"], // Adding a legend for the chart
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
        <View style={styles.addButtonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={()=>navigation.navigate('AddVitalsScreen')}>
            <Icon name="add" size={responsive.fontSize(20)} color="#fff" />
            <Text style={styles.addButtonText}>Add Entry</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
    paddingHorizontal: responsive.padding(12),
    marginRight: responsive.margin(8),
    borderRadius: responsive.borderRadius(8),
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
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

