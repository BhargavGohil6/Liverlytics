// src/screens/VitalsHistoryScreen.tsx
import React, { useState } from 'react';
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

const { width } = Dimensions.get('window');

const VitalsHistoryScreen = ({ navigation }) => {
  const [selectedDays, setSelectedDays] = useState('7');
  const [selectedMetric, setSelectedMetric] = useState('Heart Rate');

  const vitalsData = [
    { date: 'Sun, 08:10', value: 86, flag: '', source: 'Wearable' },
    { date: 'Sat, 19:45', value: 102, flag: 'Elevated', source: 'Wearable' },
    { date: 'Fri, 07:55', value: 98, flag: 'Elevated', source: 'Manual' },
    { date: 'Thu, 20:20', value: 84, flag: '', source: 'Wearable' },
    { date: 'Wed, 08:05', value: 104, flag: 'Spike detected', source: 'Manual' },
    { date: 'Tue, 21:10', value: 82, flag: '', source: 'Wearable' },
    { date: 'Mon, 08:20', value: 78, flag: '', source: 'Wearable' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        {/* <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Icon name="trending-up" size={24} color="#fff" />
            </View>
            <Text style={styles.logoText}>Liverlytics</Text>
          </View>
        </View> */}

        {/* Title Section */}
        <View style={styles.titleSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#333" />
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
            <Text style={styles.chartSubtitle}>Last 7 days • Heart Rate</Text>
          </View>
          <LineChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [{ data: [78, 82, 104, 84, 98, 102, 86] }],
            }}
            width={width - 48}
            height={200}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(82, 166, 74, ${opacity})`,
              style: { borderRadius: 16 },
            }}
            bezier
            style={styles.chart}
          />
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={styles.legendDot} />
              <Text style={styles.legendText}>Measured</Text>
            </View>
            <View style={styles.legendItem}>
              <Icon name="warning-outline" size={16} color="#666" />
              <Text style={styles.legendText}>AI anomaly</Text>
            </View>
            <View style={styles.legendItem}>
              <Icon name="pulse-outline" size={16} color="#666" />
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
          {vitalsData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{item.date}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{item.value} bpm</Text>
              <View style={[styles.tableCellIcon, { flex: 1 }]}>
                {item.flag ? (
                  <>
                    <Icon name="warning-outline" size={16} color="#f59e0b" />
                    <Text style={styles.flagText}>{item.flag}</Text>
                  </>
                ) : (
                  <Text style={styles.tableCell}>—</Text>
                )}
              </View>
              <View style={[styles.tableCellIcon, { flex: 1 }]}>
                <Icon
                  name={item.source === 'Wearable' ? 'watch-outline' : 'create-outline'}
                  size={16}
                  color="#666"
                />
                <Text style={styles.sourceText}>{item.source}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Add Entry Button */}
        <View style={styles.addButtonContainer}>
          <Text style={styles.noDataText}>No vitals recorded yet. Add your first measurement.</Text>
          <TouchableOpacity style={styles.addButton} onPress={()=>navigation.navigate('AddVitalsScreen')}>
            <Icon name="add" size={20} color="#fff" />
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: '#52a64a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#fff',
  },
  titleTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  periodSelector: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 1,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#1a1d29',
  },
  periodText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  periodTextActive: {
    color: '#fff',
  },
  metricsScroll: {
    backgroundColor: '#fff',
    marginTop: 1,
    paddingVertical: 12,
  },
  metricButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 16,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  metricButtonActive: {
    backgroundColor: '#1a1d29',
  },
  metricText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  metricTextActive: {
    color: '#fff',
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  chartSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#52a64a',
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  tableContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tableHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  tableCell: {
    fontSize: 13,
    color: '#333',
  },
  tableCellIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagText: {
    fontSize: 12,
    color: '#f59e0b',
    marginLeft: 4,
  },
  sourceText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  addButtonContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#52a64a',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default VitalsHistoryScreen;

