// src/screens/MELDHistoryScreen.tsx
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
import responsive from '../../theme/responsive';
import colors from '../../theme/color';
import CommonDropdown from '../../components/CommonDropdown';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMeldHistory, selectMeldHistory, selectMeldHistoryLoading, selectMeldHistoryError } from './slices/meldSlice';
import type { AppDispatch } from '../../redux/store';

const { width } = Dimensions.get('window');

type MELDHistoryScreenRouteProp = RouteProp<Record<string, object | undefined>, string>;

type MELDHistoryScreenNavigationProp = StackNavigationProp<Record<string, object | undefined>, string>;

const MELDHistoryScreen = ({ navigation }: { navigation: MELDHistoryScreenNavigationProp }) => {
  const dispatch: AppDispatch = useDispatch();
  const meldHistory = useSelector(selectMeldHistory);
  const historyLoading = useSelector(selectMeldHistoryLoading);
  const historyError = useSelector(selectMeldHistoryError);
  
  const [selectedTimeRange, setSelectedTimeRange] = useState('All Time');
  const [selectedSourceType, setSelectedSourceType] = useState('All');
  const [selectedMeldType, setSelectedMeldType] = useState('MELD3');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Helper function to get period value from time range
  const getPeriodValue = (timeRange: string): string | undefined => {
    switch (timeRange) {
      case 'Last 1 Month':
        return '1m';
      case 'Last 3 Months':
        return '3m';
      case 'Last 6 Months':
        return '6m';
      case 'Last 12 Months':
        return '12m';
      case 'All Time':
      default:
        return undefined; // No period parameter for All Time
    }
  };

  useEffect(() => {
    // Fetch MELD history when component mounts or when time range changes
    const period = getPeriodValue(selectedTimeRange);
    dispatch(fetchMeldHistory({ period }));
    setSelectedIndex(null);
  }, [dispatch, selectedTimeRange]);

  // Show error message if there's an error
  useEffect(() => {
    if (historyError) {
      // In a real app, you might want to show this in a toast or alert
      console.error('Error fetching MELD history:', historyError);
    }
  }, [historyError]);

  // Use API data if available, otherwise use mock data
  const entries = meldHistory?.data?.map(entry => ({
    date: entry.date,
    meldNa: parseFloat(entry.meld_scores.meld_na.toString()) || 0,
    meld30: parseFloat(entry.meld_scores.meld_3.toString()) || 0,
    source: entry.notes || 'Manual', // Assuming notes field contains source info
    name: entry.name,
    serum_creatinine: entry.serum_creatinine,
    serum_sodium: entry.serum_sodium,
    total_bilirubin: entry.total_bilirubin,
    inr: entry.inr,
    albumin: entry.albumin,
    sex_at_birth: entry.sex_at_birth,
    creation: entry.creation,
    modified: entry.modified,
  })) || [
    { date: 'Oct 12, 2025', meldNa: 19, meld30: 21, source: 'AI Report' },
    { date: 'Oct 05, 2025', meldNa: 18, meld30: 20, source: 'Manual' },
    { date: 'Sep 28, 2025', meldNa: 17, meld30: 19, source: 'AI Report' },
    { date: 'Sep 21, 2025', meldNa: 16, meld30: 18, source: 'Manual' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={responsive.fontSize(24)} color={colors.darkGray} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>MELD History</Text>
          <Text style={styles.subtitle}>Your past MELD scores and trends</Text>

          {/* Filters */}
          <View style={styles.filterCard}>
            {/* Time Range Selector */}
            <View style={styles.periodSelector}>
              {['All Time', 'Last 1 Month', 'Last 3 Months', 'Last 6 Months', 'Last 12 Months'].map((range) => (
                <TouchableOpacity
                  key={range}
                  style={[styles.periodButton, selectedTimeRange === range && styles.periodButtonActive]}
                  onPress={() => setSelectedTimeRange(range)}
                >
                  <Text style={[styles.periodText, selectedTimeRange === range && styles.periodTextActive]}>
                    {range}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>



            {/* <Text style={styles.sortText}>Sort: Newest → Oldest</Text> */}
          </View>

          {/* Chart */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeaderRow}>
              <View style={styles.chartTitleContainer}>
                <Text style={styles.chartTitle}>MELD Trend Over Time</Text>
                {selectedIndex !== null && entries.length > 0 ? (
                  <Text style={[styles.chartSubtitle, { color: colors.primary, fontWeight: '600' }]}>
                    {entries.slice(0, 5).reverse()[selectedIndex].date?.substring(0, 6)} • MELD-Na: {entries.slice(0, 5).reverse()[selectedIndex].meldNa} • MELD 3.0: {entries.slice(0, 5).reverse()[selectedIndex].meld30}
                  </Text>
                ) : (
                  <Text style={styles.chartSubtitle}>Tap any point to see detailed values</Text>
                )}
              </View>
              {/* <View style={styles.dropdownContainer}>
                <CommonDropdown
                  // label="Type"
                  placeholder="Select Type"
                  value={selectedSourceType}
                  options={[
                    { label: 'All', value: 'All' },
                    { label: 'Manual', value: 'Manual' },
                    { label: 'AI Report', value: 'AI Report' },
                  ]}
                  onValueChange={setSelectedSourceType}
                  style={styles.smallDropdown}
                />
              </View> */}
            </View>
            
            {historyLoading ? (
              <Text style={styles.loadingText}>Loading chart data...</Text>
            ) : meldHistory?.data && meldHistory.data.length > 0 ? (
              <LineChart
                data={{
                  labels: entries.slice(0, 5).map(entry => {
                    // Extract month from date string
                    const date = new Date(entry.date);
                    return date.toLocaleDateString('en-US', { month: 'short' });
                  }).reverse(),
                  datasets: [
                    { 
                      data: entries.slice(0, 5)
                        .map(entry => {
                          // Validate and sanitize the data
                          const value = parseFloat(entry.meldNa.toString());
                          return isNaN(value) || !isFinite(value) ? 0 : value;
                        })
                        .reverse(), 
                      color: () => colors.darkGray 
                    },
                    { 
                      data: entries.slice(0, 5)
                        .map(entry => {
                          // Validate and sanitize the data
                          const value = parseFloat(entry.meld30.toString());
                          return isNaN(value) || !isFinite(value) ? 0 : value;
                        })
                        .reverse(), 
                      color: () => colors.primary 
                    },
                  ],
                  
                }}
                width={width - responsive.width(64)}
                height={responsive.height(200)}
                chartConfig={{
                  backgroundColor: colors.white,
                  backgroundGradientFrom: colors.white,
                  backgroundGradientTo: colors.white,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(16, 24, 40, ${opacity})`,
                  style: { borderRadius: responsive.borderRadius(16) },
                }}
                bezier
                style={styles.chart}
                onDataPointClick={(data) => {
                  if (selectedIndex === data.index) {
                    setSelectedIndex(null);
                  } else {
                    setSelectedIndex(data.index);
                  }
                }}
              />
            ) : (
              <Text style={styles.noDataText}>No chart data available</Text>
            )}

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.darkGray }]} />
                <Text style={styles.legendText}>MELD-Na</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                <Text style={styles.legendText}>MELD 3.0</Text>
              </View>
              <View style={styles.legendItem}>
                <Icon name="eye-outline" size={responsive.fontSize(16)} color={colors.coolGray} />
                <Text style={styles.legendText}>Static preview</Text>
              </View>
            </View>
          </View>

           {/* Insights */}
          {meldHistory && meldHistory.ai_insights && meldHistory.ai_insights.status !== 'no_ai_insights' && (
            <View style={styles.newAiInsightsCard}>
              <View style={styles.insightsHeader}>
                <View style={styles.sectionTitleRow}>
                  <Icon name="sparkles" size={20} color="#1A1A1A" />
                  <Text style={styles.newInsightsTitle}>AI Insights</Text>
                </View>
                {/* <View style={styles.infoBadge}>
                  <Text style={styles.infoBadgeText}>Today</Text>
                </View> */}
              </View>

              <View style={styles.newInsightBox}>
                {meldHistory && meldHistory.ai_insights?.ai_insights && meldHistory.ai_insights.ai_insights.length > 0 && (
                meldHistory.ai_insights.ai_insights.map((insight, index) => {
                  // Determine icon and color based on insight content
                  let iconName = "trending-up";
                  let iconColor = "#FBC02D";
                  let bgColor = "#FFF8E1";
                  
                  if (insight.toLowerCase().includes('rising') || insight.toLowerCase().includes('increase')) {
                    iconName = "trending-up";
                    iconColor = "#FBC02D";
                    bgColor = "#FFF8E1";
                  } else if (insight.toLowerCase().includes('stable') || insight.toLowerCase().includes('normal')) {
                    iconName = "minus";
                    iconColor = "#43A047";
                    bgColor = "#E8F5E9";
                  } else if (insight.toLowerCase().includes('decreasing') || insight.toLowerCase().includes('lower')) {
                    iconName = "trending-down";
                    iconColor = "#43A047";
                    bgColor = "#E8F5E9";
                  } else {
                    iconName = "alert-circle";
                    iconColor = "#757575";
                    bgColor = "#F5F5F5";
                  }
                  
                  return (
                    <View key={index} style={[styles.insightItem, { backgroundColor: bgColor }]}>              
                      <Icon name={iconName} size={22} color={iconColor} style={styles.insightIcon} />
                      <View style={styles.insightContent}>
                        {/* <Text style={[styles.insightItemText, { color: iconColor }]}>
                          Key Finding
                        </Text> */}
                        <Text style={styles.insightItemSubText}>{insight}</Text>
                      </View>
                    </View>
                  );
                })
              ) 
              // : (
              //   <>
              //     {/* Default insights when no AI data */}
              //     <View style={[styles.insightItem, { backgroundColor: '#FFF8E1' }]}>              
              //       <Icon name="trending-up" size={22} color="#FBC02D" style={styles.insightIcon} />
              //       <View style={styles.insightContent}>
              //         <Text style={[styles.insightItemText, { color: '#FBC02D' }]}>Trend Analysis</Text>
              //         <Text style={styles.insightItemSubText}>Your MELD-Na has been rising gradually over the last 6 weeks.</Text>
              //       </View>
              //     </View>
                  
              //     <View style={[styles.insightItem, { backgroundColor: '#F5F5F5' }]}>              
              //       <Icon name="alert-circle" size={22} color="#757575" style={styles.insightIcon} />
              //       <View style={styles.insightContent}>
              //         <Text style={[styles.insightItemText, { color: '#757575' }]}>Risk Factor</Text>
              //         <Text style={styles.insightItemSubText}>Creatinine fluctuations contributed to recent MELD increases.</Text>
              //       </View>
              //     </View>
                  
              //     <View style={[styles.insightItem, { backgroundColor: '#E8F5E9' }]}>              
              //       <Icon name="minus" size={22} color="#43A047" style={styles.insightIcon} />
              //       <View style={styles.insightContent}>
              //         <Text style={[styles.insightItemText, { color: '#43A047' }]}>Current Status</Text>
              //         <Text style={styles.insightItemSubText}>Latest MELD-Na is slightly above your 3-month average.</Text>
              //       </View>
              //     </View>
              //   </>
              // )
              }
              
              <Text style={styles.disclaimerText}>
                These insights are informational only and not a diagnosis.
              </Text>
            </View>
          </View>
          )}

          {/* Entries */}
          <View style={styles.entriesSection}>
            <Text style={styles.entriesTitle}>All Entries</Text>
            
            {/* MELD Type Filter */}
            <View style={styles.meldTypeFilterContainer}>
              <CommonDropdown
                label="MELD Type"
                placeholder="Select MELD Type"
                value={selectedMeldType}
                options={[
                  { label: 'MELD 3.0', value: 'MELD3' },
                  { label: 'MELD-Na', value: 'MELDNa' },
                ]}
                onValueChange={(value) => setSelectedMeldType(value)}
              />
            </View>
            
            {entries.map((entry, index) => (
              <View key={index} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryDate}>{entry.date}</Text>
                  {/* <TouchableOpacity style={styles.viewInputsButton}>
                    <Icon name="list-outline" size={responsive.fontSize(16)} color={colors.primary} />
                    <Text style={styles.viewInputsText}>View Inputs</Text>
                  </TouchableOpacity> */}
                </View>
                <View style={styles.entryScores}>
                  {selectedMeldType === 'MELD3' ? (
                    <View style={styles.scoreItem}>
                      <Text style={styles.scoreLabel}>MELD 3.0</Text>
                      <Text style={styles.scoreValue}>{entry.meld30}</Text>
                    </View>
                  ) : (
                    <View style={styles.scoreItem}>
                      <Text style={styles.scoreLabel}>MELD-Na</Text>
                      <Text style={styles.scoreValue}>{entry.meldNa}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.entrySource}>{entry.source}</Text>
              </View>
            ))}
          </View>

         

          {/* Download Button */}
          {/* <TouchableOpacity style={styles.downloadButton}>
            <Icon name="download-outline" size={responsive.fontSize(20)} color={colors.white} />
            <Text style={styles.downloadText}>Download Full MELD Report</Text>
          </TouchableOpacity> */}
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
    padding: responsive.padding(16),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  content: {
    padding: responsive.padding(16),
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
    marginBottom: responsive.margin(24),
  },
  filterCard: {
    backgroundColor: colors.white,
    padding: responsive.padding(16),
    borderRadius: responsive.borderRadius(12),
    marginBottom: responsive.margin(16),
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  periodSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.white,
    // marginBottom: responsive.margin(1),
  },
  periodButton: {
    paddingVertical: responsive.padding(10),
    paddingHorizontal: responsive.padding(12),
    marginRight: responsive.margin(8),
    marginBottom: responsive.margin(8),
    borderRadius: responsive.borderRadius(8),
    backgroundColor: colors.gray100,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: colors.darkGray,
  },
  periodText: {
    fontSize: responsive.fontSize(12),
    color: colors.gray,
    fontWeight: '500',
  },
  periodTextActive: {
    color: colors.white,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsive.padding(12),
    paddingHorizontal: responsive.padding(16),
    backgroundColor: colors.gray100,
    borderRadius: responsive.borderRadius(8),
    marginBottom: responsive.margin(12),
  },
  dropdownText: {
    fontSize: responsive.fontSize(15),
    color: colors.darkGray,
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: responsive.margin(8),
    marginBottom: responsive.margin(8),
  },
  filterButton: {
    paddingVertical: responsive.padding(8),
    paddingHorizontal: responsive.padding(10),
    backgroundColor: colors.gray100,
    borderRadius: responsive.borderRadius(6),
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  filterText: {
    fontSize: responsive.fontSize(13),
    color: colors.gray,
  },
  typeRow: {
    flexDirection: 'row',
    gap: responsive.margin(8),
    marginTop: responsive.margin(12),
    marginBottom: responsive.margin(12),
  },
  typeButton: {
    flex: 1,
    paddingVertical: responsive.padding(8),
    paddingHorizontal: responsive.padding(12),
    backgroundColor: colors.gray100,
    borderRadius: responsive.borderRadius(6),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  typeButtonActive: {
    backgroundColor: colors.darkGray,
    borderColor: colors.darkGray,
  },
  typeText: {
    fontSize: responsive.fontSize(13),
    color: colors.gray,
    fontWeight: '500',
  },
  typeTextActive: {
    color: colors.white,
  },
  sortText: {
    fontSize: responsive.fontSize(13),
    color: colors.coolGray,
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: colors.white,
    padding: responsive.padding(16),
    borderRadius: responsive.borderRadius(12),
    marginBottom: responsive.margin(16),
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  chartTitle: {
    fontSize: responsive.fontSize(18),
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: responsive.margin(4),
  },
  chartSubtitle: {
    fontSize: responsive.fontSize(13),
    color: colors.coolGray,
    marginBottom: responsive.margin(16),
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: responsive.margin(16),
  },
  chartTitleContainer: {
    flex: 1,
  },
  dropdownContainer: {
    minWidth: responsive.width(100),
    marginLeft: responsive.margin(16),
    
  },
  smallDropdown: {
    paddingVertical: responsive.padding(6),
  },
  chart: {
    marginVertical: responsive.margin(8),
    borderRadius: responsive.borderRadius(8),
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: responsive.margin(12),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: responsive.margin(4),
  },
  entriesSection: {
    marginBottom: responsive.margin(16),
  },
  entriesTitle: {
    fontSize: responsive.fontSize(18),
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: responsive.margin(12),
  },
  entryCard: {
    backgroundColor: colors.white,
    padding: responsive.padding(16),
    borderRadius: responsive.borderRadius(12),
    marginBottom: responsive.margin(12),
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsive.margin(12),
  },
  entryDate: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: colors.darkGray,
  },
  viewInputsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewInputsText: {
    fontSize: responsive.fontSize(13),
    color: colors.primary,
    marginLeft: responsive.margin(4),
  },
  entryScores: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(8),
  },
  scoreItem: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: responsive.fontSize(13),
    color: colors.coolGray,
    marginBottom: responsive.margin(4),
  },
  scoreValue: {
    fontSize: responsive.fontSize(20),
    fontWeight: '700',
    color: colors.darkGray,
  },
  scoreDivider: {
    width: 1,
    height: responsive.height(30),
    backgroundColor: colors.gray200,
    marginHorizontal: responsive.margin(16),
  },
  entrySource: {
    fontSize: responsive.fontSize(13),
    color: colors.coolGray,
  },

  downloadButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: responsive.padding(14),
    borderRadius: responsive.borderRadius(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadText: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: colors.white,
    marginLeft: responsive.margin(8),
  },
  meldTypeFilterContainer: {
    marginBottom: responsive.margin(12),
  },
  loadingText: {
    textAlign: 'center',
    padding: responsive.padding(20),
    fontSize: responsive.fontSize(16),
    color: colors.coolGray,
  },
  noDataText: {
    textAlign: 'center',
    padding: responsive.padding(20),
    fontSize: responsive.fontSize(16),
    color: colors.coolGray,
  },
  // New AI Insights Styles (matching dashboard design)
  newAiInsightsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: responsive.borderRadius(20),
    padding: responsive.padding(18),
    marginBottom: responsive.margin(16),
    borderWidth: 1,
    borderColor: '#E8E8E8',
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
  },
  disclaimerText: {
    fontSize: responsive.fontSize(12),
    color: '#9E9E9E',
    marginTop: responsive.margin(8),
    textAlign: 'left',
    lineHeight: responsive.height(18),
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9fafb',
//   },
//   header: {
//     padding: responsive.padding(16),
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   content: {
//     padding: responsive.padding(16),
//   },
//   title: {
//     fontSize: responsive.fontSize(24),
//     fontWeight: '700',
//     color: '#1f2937',
//     marginBottom: responsive.margin(4),
//   },
//   subtitle: {
//     fontSize: responsive.fontSize(14),
//     color: '#6b7280',
//     marginBottom: responsive.margin(24),
//   },
//   filterCard: {
//     backgroundColor: '#fff',
//     padding: responsive.padding(16),
//     borderRadius: responsive.borderRadius(12),
//     marginBottom: responsive.margin(16),
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   dropdown: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: responsive.padding(12),
//     paddingHorizontal: responsive.padding(16),
//     backgroundColor: '#f9fafb',
//     borderRadius: responsive.borderRadius(8),
//     marginBottom: responsive.margin(12),
//   },
//   dropdownText: {
//     fontSize: responsive.fontSize(15),
//     color: '#1f2937',
//     fontWeight: '500',
//   },
//   filterRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: responsive.margin(8),
//     marginBottom: responsive.margin(8),
    
//   },
//   filterButton: {
//     paddingVertical: responsive.padding(8),
//     paddingHorizontal: responsive.padding(10),
//     backgroundColor: '#f9fafb',
//     borderRadius: responsive.borderRadius(6),
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   filterText: {
//     fontSize: responsive.fontSize(13),
//     color: '#374151',
//   },
//   typeRow: {
//     flexDirection: 'row',
//     gap: responsive.margin(8),
//     marginTop: responsive.margin(12),
//     marginBottom: responsive.margin(12),
//   },
//   typeButton: {
//     flex: 1,
//     paddingVertical: responsive.padding(8),
//     paddingHorizontal: responsive.padding(12),
//     backgroundColor: '#f9fafb',
//     borderRadius: responsive.borderRadius(6),
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   typeButtonActive: {
//     backgroundColor: '#1f2937',
//     borderColor: '#1f2937',
//   },
//   typeText: {
//     fontSize: responsive.fontSize(13),
//     color: '#374151',
//     fontWeight: '500',
//   },
//   typeTextActive: {
//     color: '#fff',
//   },

//   sortText: {
//     fontSize: responsive.fontSize(13),
//     color: '#6b7280',
//     textAlign: 'center',
//   },

//   chartCard: {
//     backgroundColor: '#fff',
//     padding: responsive.padding(16),
//     borderRadius: responsive.borderRadius(12),
//     marginBottom: responsive.margin(16),
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },
//   chartTitle: {
//     fontSize: responsive.fontSize(18),
//     fontWeight: '600',
//     color: '#1f2937',
//     marginBottom: responsive.margin(4),
//   },
//   chartSubtitle: {
//     fontSize: responsive.fontSize(13),
//     color: '#6b7280',
//     marginBottom: responsive.margin(16),
//   },

//   legend: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: responsive.margin(12),
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   legendDot: {
//     width: responsive.width(8),
//     height: responsive.height(8),
//     borderRadius: responsive.borderRadius(4),
//     marginRight: responsive.margin(6),
//   },
//   legendText: {
//     fontSize: responsive.fontSize(12),
//     color: '#6b7280',
//     marginLeft: responsive.margin(4),
//   },

//   entriesSection: {
//     marginBottom: responsive.margin(16),
//   },
//   entriesTitle: {
//     fontSize: responsive.fontSize(18),
//     fontWeight: '600',
//     color: '#1f2937',
//     marginBottom: responsive.margin(12),
//   },
//   entryCard: {
//     backgroundColor: '#fff',
//     padding: responsive.padding(16),
//     borderRadius: responsive.borderRadius(12),
//     marginBottom: responsive.margin(12),
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//   },

//   entryHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: responsive.margin(12),
//   },
//   entryDate: {
//     fontSize: responsive.fontSize(16),
//     fontWeight: '600',
//     color: '#1f2937',
//   },
//   viewInputsButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   viewInputsText: {
//     fontSize: responsive.fontSize(13),
//     color: '#52a64a',
//     marginLeft: responsive.margin(4),
//   },

//   scoreLabel: {
//     fontSize: responsive.fontSize(13),
//     color: '#6b7280',
//     marginBottom: responsive.margin(4),
//   },
//   scoreValue: {
//     fontSize: responsive.fontSize(20),
//     fontWeight: '700',
//     color: '#1f2937',
//   },

//   scoreDivider: {
//     width: 1,
//     height: responsive.height(30),
//     backgroundColor: '#e5e7eb',
//     marginHorizontal: responsive.margin(16),
//   },

//   disclaimer: {
//     fontSize: responsive.fontSize(12),
//     color: '#d1fae5',
//     marginTop: responsive.margin(8),
//     fontStyle: 'italic',
//   },

//   downloadButton: {
//     flexDirection: 'row',
//     backgroundColor: '#52a64a',
//     paddingVertical: responsive.padding(14),
//     borderRadius: responsive.borderRadius(8),
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   downloadText: {
//     fontSize: responsive.fontSize(16),
//     fontWeight: '600',
//     color: '#fff',
//     marginLeft: responsive.margin(8),
//   },
// });


export default MELDHistoryScreen;