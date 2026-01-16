import React, { useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { fetchMeldHistory, selectMeldHistory, selectMeldHistoryLoading, selectMeldHistoryError } from '../../meld-calculator/slices/meldSlice';
import type { AppDispatch } from '../../../redux/store';
import CommonLoader from '../../../components/CommonLoader';

const MeldTrendScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const meldHistory = useSelector(selectMeldHistory);
  const historyLoading = useSelector(selectMeldHistoryLoading);
  const historyError = useSelector(selectMeldHistoryError);

  useEffect(() => {
    dispatch(fetchMeldHistory());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <CommonLoader visible={historyLoading} />
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
          {meldHistory && meldHistory.data && meldHistory.data.length > 0 && (
            <Text style={styles.trendSubtitle}>MELD-Na {meldHistory.data[0].meld_scores?.meld_na || 'N/A'}</Text>
          )}
          
          {/* Simple trend line placeholder */}
          {/* <View style={styles.trendChart}>
            <View style={styles.trendLine} />
          </View> */}

          {/* Trend Table */}
          <View style={styles.trendTable}>
            <View style={styles.trendTableHeader}>
              <Text style={styles.trendTableHeaderText}>Date</Text>
              <Text style={styles.trendTableHeaderText}>MELD-Na</Text>
              <Text style={styles.trendTableHeaderText}>MELD 3.0</Text>
              <Text style={styles.trendTableHeaderText}>Source</Text>
            </View>
            {historyLoading ? (
              <View style={styles.trendTableRow}>
                <Text style={styles.trendTableCell}>Loading...</Text>
                <Text style={styles.trendTableCell}></Text>
                <Text style={styles.trendTableCell}></Text>
                <Text style={styles.trendTableCell}></Text>
              </View>
            ) : historyError ? (
              <View style={styles.trendTableRow}>
                <Text style={styles.trendTableCell}>Error: {historyError}</Text>
                <Text style={styles.trendTableCell}></Text>
                <Text style={styles.trendTableCell}></Text>
                <Text style={styles.trendTableCell}></Text>
              </View>
            ) : meldHistory && meldHistory.data && meldHistory.data.length > 0 ? (
              meldHistory.data.slice(0, 4).map((entry, index) => (
                <View key={entry.name || index} style={styles.trendTableRow}>
                  <Text style={styles.trendTableCell}>{entry.creation ? new Date(entry.creation).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}</Text>
                  <Text style={styles.trendTableCell}>{entry.meld_scores?.meld_na || 'N/A'}</Text>
                  <Text style={styles.trendTableCell}>{entry.meld_scores?.meld_3 || 'N/A'}</Text>
                  <Text style={styles.trendTableCell}>{entry.notes || 'Manual'}</Text>
                </View>
              ))
            ) : (
              <View style={styles.trendTableRow}>
                <Text style={styles.trendTableCell}>No data available</Text>
                <Text style={styles.trendTableCell}></Text>
                <Text style={styles.trendTableCell}></Text>
                <Text style={styles.trendTableCell}></Text>
              </View>
            )}
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
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.continueButtonText}>Go to Dashboard</Text>
          {/* <Icon name="arrow-forward" size={responsive.fontSize(20)} color="#fff" /> */}
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