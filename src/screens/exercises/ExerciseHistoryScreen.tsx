// src/screens/ExerciseHistoryScreen.tsx
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

const ExerciseHistoryScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('This Week');

  const logs = [
    { date: '14 Jan 2025', steps: 7842, sleep: '8h 20m', rhr: 68, synced: true },
    { date: '13 Jan 2025', steps: 6420, sleep: '6h 50m', rhr: 66, synced: false },
    { date: '12 Jan 2025', steps: 8120, sleep: '7h 05m', rhr: 65, synced: true },
    { date: '11 Jan 2025', steps: 5940, sleep: '5h 40m', rhr: 69, synced: true },
    { date: '10 Jan 2025', steps: 9010, sleep: '7h 30m', rhr: 64, synced: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
      

        {/* Title */}
        <View style={styles.titleSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.titleContent}>
            <Text style={styles.title}>Exercise History</Text>
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
            <Icon name="trending-up-outline" size={20} color="#333" />
            <Text style={styles.chartTitle}>Trends</Text>
          </View>
          <View style={styles.chartTabs}>
            {['Steps', 'Sleep', 'Resting HR'].map((tab) => (
              <TouchableOpacity key={tab} style={styles.chartTab}>
                <Text style={styles.chartTabText}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#333' }]} />
              <Text style={styles.legendText}>Steps</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#9ca3af' }]} />
              <Text style={styles.legendText}>Sleep</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#d1d5db' }]} />
              <Text style={styles.legendText}>RHR</Text>
            </View>
          </View>
          <LineChart
            data={{
              labels: ['', '', '', '', '', '', ''],
              datasets: [{ data: [5, 7, 6, 8, 7, 9, 8] }],
            }}
            width={width - 64}
            height={180}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 },
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
            <Icon name="sparkles" size={20} color="#fff" />
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

        {/* Logs */}
        <View style={styles.logsSection}>
          <View style={styles.logsHeader}>
            <Icon name="list-outline" size={20} color="#333" />
            <Text style={styles.logsTitle}>Logs</Text>
            <Text style={styles.logsSubtitle}>Chronological • Most recent first</Text>
          </View>

          {logs.map((log, index) => (
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
              <TouchableOpacity style={styles.expandButton}>
                <Text style={styles.expandText}>Tap to expand</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Download Buttons */}
        <View style={styles.downloadSection}>
          <TouchableOpacity style={styles.downloadButton}>
            <Icon name="document-outline" size={20} color="#333" />
            <Text style={styles.downloadText}>Download CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.downloadButtonPrimary}>
            <Icon name="document-text-outline" size={20} color="#fff" />
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
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    color: '#1f2937',
  },
  titleSection: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
  },
  titleContent: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#52a64a',
  },
  tabText: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#52a64a',
    fontWeight: '600',
  },
  periodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  periodActive: {
    backgroundColor: '#e5e7eb',
  },
  periodText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  chartTabs: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  chartTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  chartTabText: {
    fontSize: 13,
    color: '#374151',
  },
  chartLegend: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  trendStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#52a64a',
  },
  insightsCard: {
    backgroundColor: '#0F7A6B',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  insightBullet: {
    fontSize: 16,
    color: '#fff',
    marginRight: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
    lineHeight: 20,
  },
  logsSection: {
    padding: 16,
  },
  logsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  logsSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 8,
  },
  logCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  logDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  logStatus: {
    fontSize: 13,
    color: '#6b7280',
  },
  logStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logStat: {
    fontSize: 14,
    color: '#374151',
  },
  expandButton: {
    alignItems: 'center',
    paddingTop: 8,
  },
  expandText: {
    fontSize: 13,
    color: '#52a64a',
  },
  downloadSection: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  downloadText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  downloadButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#52a64a',
    paddingVertical: 12,
    borderRadius: 8,
  },
  downloadTextPrimary: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
});

export default ExerciseHistoryScreen;