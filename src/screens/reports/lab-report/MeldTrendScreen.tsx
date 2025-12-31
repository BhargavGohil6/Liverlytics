import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import responsive from '../../../theme/responsive'; 
import { useNavigation } from '@react-navigation/native';

const MeldTrendScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
            <Icon name="arrow-back" size={responsive.fontSize(24)} color="#000" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>MELD Trend</Text>
            <Text style={styles.headerSubtitle}>
              Recent MELD-Na values over time
            </Text>
          </View>
        </View>

        {/* Recent Trend */}
        <View style={styles.trendSection}>
          <Text style={styles.trendTitle}>Recent MELD-Na Trend</Text>
          <Text style={styles.trendSubtitle}>MELD-Na 19</Text>
          
          {/* Simple trend line placeholder */}
          <View style={styles.trendChart}>
            <View style={styles.trendLine} />
          </View>

          {/* Trend Table */}
          <View style={styles.trendTable}>
            <View style={styles.trendTableHeader}>
              <Text style={styles.trendTableHeaderText}>Date</Text>
              <Text style={styles.trendTableHeaderText}>MELD-Na</Text>
              <Text style={styles.trendTableHeaderText}>MELD 3.0</Text>
              <Text style={styles.trendTableHeaderText}>Source</Text>
            </View>
            {[
              { date: 'Oct 12', meldNa: '23', meld3: '23', source: 'AI Report' },
              { date: 'Oct 05', meldNa: '18', meld3: '20', source: 'Manual' },
              { date: 'Sep 28', meldNa: '17', meld3: '19', source: 'AI Report' },
              { date: 'Sep 21', meldNa: '16', meld3: '18', source: 'MELD' },
            ].map((row, index) => (
              <View key={index} style={styles.trendTableRow}>
                <Text style={styles.trendTableCell}>{row.date}</Text>
                <Text style={styles.trendTableCell}>{row.meldNa}</Text>
                <Text style={styles.trendTableCell}>{row.meld3}</Text>
                <Text style={styles.trendTableCell}>{row.source}</Text>
              </View>
            ))}
          </View>

          {/* View Full History Button */}
          <TouchableOpacity style={styles.historyButton} onPress={()=>navigation.navigate('MELDHistoryScreen')}>
            <Text style={styles.historyButtonText}>View Full MELD History</Text>
            <Icon name="arrow-forward" size={responsive.fontSize(16)} color="#52ab3c" />
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => navigation.navigate('LabReportResultsScreen')}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Icon name="arrow-forward" size={responsive.fontSize(20)} color="#fff" />
        </TouchableOpacity>

        <View style={{ height: responsive.height(30) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: responsive.padding(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(12),
  },
  backText: {
    fontSize: responsive.fontSize(16),
    marginLeft: responsive.margin(8),
    color: '#000',
  },
  headerContent: {
    marginTop: responsive.margin(8),
  },
  headerTitle: {
    fontSize: responsive.fontSize(20),
    fontWeight: 'bold',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: responsive.fontSize(14),
    color: '#666',
    marginTop: responsive.margin(4),
  },
  trendSection: {
    backgroundColor: '#fff',
    padding: responsive.padding(16),
    marginTop: responsive.margin(8),
  },
  trendTitle: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: '#000',
  },
  trendSubtitle: {
    fontSize: responsive.fontSize(14),
    color: '#666',
    marginTop: responsive.margin(4),
  },
  trendChart: {
    height: responsive.height(80),
    marginVertical: responsive.margin(16),
    backgroundColor: '#F5F5F5',
    borderRadius: responsive.borderRadius(8),
    justifyContent: 'center',
    paddingHorizontal: responsive.padding(16),
  },
  trendLine: {
    height: 2,
    backgroundColor: '#52ab3c',
  },
  trendTable: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: responsive.borderRadius(8),
    overflow: 'hidden',
  },
  trendTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    padding: responsive.padding(12),
  },
  trendTableHeaderText: {
    flex: 1,
    fontSize: responsive.fontSize(12),
    fontWeight: '600',
    color: '#666',
  },
  trendTableRow: {
    flexDirection: 'row',
    padding: responsive.padding(12),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  trendTableCell: {
    flex: 1,
    fontSize: responsive.fontSize(13),
    color: '#000',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsive.margin(16),
    padding: responsive.padding(12),
  },
  historyButtonText: {
    fontSize: responsive.fontSize(14),
    color: '#52ab3c',
    marginRight: responsive.margin(8),
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: '#52ab3c',
    padding: responsive.padding(14),
    margin: responsive.margin(16),
    borderRadius: responsive.borderRadius(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: responsive.fontSize(16),
    color: '#fff',
    fontWeight: '600',
    marginRight: responsive.margin(8),
  },
});

export default MeldTrendScreen;