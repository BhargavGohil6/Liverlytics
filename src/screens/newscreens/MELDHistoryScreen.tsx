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

const { width } = Dimensions.get('window');

const MELDHistoryScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('All Time');
  const [selectedType, setSelectedType] = useState('All');

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
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>MELD History</Text>
          <Text style={styles.subtitle}>Your past MELD scores and trends</Text>

          {/* Filters */}
          <View style={styles.filterCard}>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{selectedFilter}</Text>
              <Icon name="chevron-down" size={20} color="#6b7280" />
            </TouchableOpacity>

            <View style={styles.filterRow}>
              {['Last 3 Months', 'Last 6 Months', 'Last 1 Month'].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={styles.filterButton}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text style={styles.filterText}>{filter}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.filterRow}>
              {['Last 12 Months', 'Custom Range'].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={styles.filterButton}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text style={styles.filterText}>{filter}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.typeRow}>
              {['All', 'Manual', 'AI Report'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeButton, selectedType === type && styles.typeButtonActive]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text style={[styles.typeText, selectedType === type && styles.typeTextActive]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
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
                  { data: [16, 17, 18, 19, 21], color: () => '#1f2937' },
                  { data: [15, 16, 17, 18, 19], color: () => '#52a64a' },
                ],
              }}
              width={width - 64}
              height={200}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
                style: { borderRadius: 16 },
              }}
              bezier
              style={styles.chart}
            />

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#1f2937' }]} />
                <Text style={styles.legendText}>MELD-Na</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#52a64a' }]} />
                <Text style={styles.legendText}>MELD 3.0</Text>
              </View>
              <View style={styles.legendItem}>
                <Icon name="eye-outline" size={16} color="#6b7280" />
                <Text style={styles.legendText}>Static preview</Text>
              </View>
            </View>
          </View>

          {/* Entries */}
          <View style={styles.entriesSection}>
            <Text style={styles.entriesTitle}>All Entries</Text>
            {entries.map((entry, index) => (
              <View key={index} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryDate}>{entry.date}</Text>
                  <TouchableOpacity style={styles.viewInputsButton}>
                    <Icon name="list-outline" size={16} color="#52a64a" />
                    <Text style={styles.viewInputsText}>View Inputs</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.entryScores}>
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>MELD-Na</Text>
                    <Text style={styles.scoreValue}>{entry.meldNa}</Text>
                  </View>
                  <View style={styles.scoreDivider} />
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>MELD 3.0</Text>
                    <Text style={styles.scoreValue}>{entry.meld30}</Text>
                  </View>
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
          <TouchableOpacity style={styles.downloadButton}>
            <Icon name="download-outline" size={20} color="#fff" />
            <Text style={styles.downloadText}>Download Full MELD Report</Text>
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  content: {
    padding: 16,
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
    marginBottom: 24,
  },
  filterCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 12,
  },
  dropdownText: {
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  filterButton: {
    // paddingVertical:responsive.padding(8),
    // paddingHorizontal:responsive.padding(14),
    // backgroundColor: '#f9fafb',
    // borderRadius: 6,
    // borderWidth: 1,
    // borderColor: '#e5e7eb',
    paddingVertical: responsive.padding(8),
    paddingHorizontal: responsive.padding(10),
    backgroundColor: '#f9fafb',
    borderRadius: responsive.borderRadius(6),
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterText: {
    fontSize: 13,
    color: '#374151',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginBottom: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  typeButtonActive: {
    backgroundColor: '#1f2937',
    borderColor: '#1f2937',
  },
  typeText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  typeTextActive: {
    color: '#fff',
  },
  sortText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: 4,
  },
  entriesSection: {
    marginBottom: 16,
  },
  entriesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  entryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  viewInputsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewInputsText: {
    fontSize: 13,
    color: '#52a64a',
    marginLeft: 4,
  },
  entryScores: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreItem: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  scoreDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  entrySource: {
    fontSize: 13,
    color: '#6b7280',
  },
  insightsCard: {
    backgroundColor: '#0d9488',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
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
  disclaimer: {
    fontSize: 12,
    color: '#d1fae5',
    marginTop: 8,
    fontStyle: 'italic',
  },
  downloadButton: {
    flexDirection: 'row',
    backgroundColor: '#52a64a',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
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