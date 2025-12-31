// src/screens/MELDHistoryScreen.tsx
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
import responsive from '../../theme/responsive';
import colors from '../../theme/color';
import CommonDropdown from '../../components/CommonDropdown';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

const { width } = Dimensions.get('window');

type MELDHistoryScreenRouteProp = RouteProp<Record<string, object | undefined>, string>;

type MELDHistoryScreenNavigationProp = StackNavigationProp<Record<string, object | undefined>, string>;

const MELDHistoryScreen = ({ navigation }: { navigation: MELDHistoryScreenNavigationProp }) => {
  const [selectedFilter, setSelectedFilter] = useState('All Time');
  const [selectedSourceType, setSelectedSourceType] = useState('All');
  const [selectedMeldType, setSelectedMeldType] = useState('MELD3');

  const entries = [
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
            <CommonDropdown
              label="Time Range"
              placeholder="Select Time Range"
              value={selectedFilter}
              options={[
                { label: "All Time", value: "All Time" },
                { label: "Last 1 Month", value: "Last 1 Month" },
                { label: "Last 3 Months", value: "Last 3 Months" },
                { label: "Last 6 Months", value: "Last 6 Months" },
                { label: "Last 12 Months", value: "Last 12 Months" },
                { label: "Custom Range", value: "Custom Range" },
              ]}
              onValueChange={setSelectedFilter}
            />

            <View style={styles.typeRow}>
              <CommonDropdown
                label="Type"
                placeholder="Select Type"
                value={selectedSourceType}
                options={[
                  { label: 'All', value: 'All' },
                  { label: 'Manual', value: 'Manual' },
                  { label: 'AI Report', value: 'AI Report' },
                ]}
                onValueChange={setSelectedSourceType}
              />
            </View>

            <Text style={styles.sortText}>Sort: Newest → Oldest</Text>
          </View>

          {/* Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>MELD Trend Over Time</Text>
            <Text style={styles.chartSubtitle}>Tap any point to see detailed values</Text>
            
            <LineChart
              data={{
                labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                datasets: [
                  { data: [16, 17, 18, 19, 21], color: () => colors.darkGray },
                  { data: [15, 16, 17, 18, 19], color: () => colors.primary },
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
            />

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
                  <TouchableOpacity style={styles.viewInputsButton}>
                    <Icon name="list-outline" size={responsive.fontSize(16)} color={colors.primary} />
                    <Text style={styles.viewInputsText}>View Inputs</Text>
                  </TouchableOpacity>
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

          {/* Insights */}
          <View style={styles.insightsCard}>
            <Text style={styles.insightsTitle}>Insights from Your History</Text>
            <View style={styles.insightItem}>
              <Text style={styles.insightBullet}>•</Text>
              <Text style={styles.insightText}>
                Your MELD-Na has been rising gradually over the last 6 weeks.
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightBullet}>•</Text>
              <Text style={styles.insightText}>
                Creatinine fluctuations contributed to recent MELD increases.
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightBullet}>•</Text>
              <Text style={styles.insightText}>
                Latest MELD-Na is slightly above your 3-month average.
              </Text>
            </View>
            <Text style={styles.disclaimer}>
              These insights are informational and not a diagnosis.
            </Text>
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
  insightsCard: {
    backgroundColor: colors.emerald,
    padding: responsive.padding(16),
    borderRadius: responsive.borderRadius(12),
    marginBottom: responsive.margin(16),
  },
  insightsTitle: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: colors.white,
    marginBottom: responsive.margin(12),
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: responsive.margin(8),
  },
  insightBullet: {
    fontSize: responsive.fontSize(16),
    color: colors.white,
    marginRight: responsive.margin(8),
  },
  insightText: {
    fontSize: responsive.fontSize(14),
    color: colors.white,
    flex: 1,
    lineHeight: responsive.fontSize(20),
  },
  disclaimer: {
    fontSize: responsive.fontSize(12),
    color: colors.mintMist,
    marginTop: responsive.margin(8),
    fontStyle: 'italic',
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