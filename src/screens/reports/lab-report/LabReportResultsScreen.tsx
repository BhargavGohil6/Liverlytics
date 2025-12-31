import React, { useState } from 'react';
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

const LabReportResultsScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedTab, setSelectedTab] = useState('MELD-Na 19');

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
            <Text style={styles.headerTitle}>MELD Results</Text>
            <Text style={styles.headerSubtitle}>
              Final MELD calculation and insights
            </Text>
          </View>
        </View>
        {/* MELD Results Tabs */}
        <View style={styles.meldTabs}>
          {['MELD-Na 19', 'MELD 3.0-21'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.meldTab, selectedTab === tab && styles.meldTabActive]}
              onPress={() => setSelectedTab(tab)}>
              <Text style={[styles.meldTabText, selectedTab === tab && styles.meldTabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* MELD Info Cards */}
        <View style={styles.meldCards}>
          <View style={styles.meldCard}>
            <Text style={styles.meldCardTitle}>MELD-Na</Text>
            <Text style={styles.meldCardSubtitle}>Updated when all fields valid</Text>
          </View>
          <View style={styles.meldCard}>
            <Text style={styles.meldCardTitle}>MELD 3.0</Text>
            <Text style={styles.meldCardSubtitle}>Uses bilirubin, INR, creatinine, sodium, albumin, sex</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save & Recalculate</Text>
          </TouchableOpacity>
        </View>

        {/* AI Insights */}
        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>AI Insights (Informational Only)</Text>
          <Text style={styles.insightsText}>
            Sodium slightly lower than last reading. AST/ALT ratio elevated compared to prior report.
          </Text>
          <Text style={styles.insightsText}>
            Mild rise in creatinine compared to last 3 labs.
          </Text>
          <Text style={styles.insightsDisclaimer}>
            These statements are informational and not a diagnosis.
          </Text>
        </View>

        {/* Save Extracted Values Button */}
        <TouchableOpacity style={styles.saveExtractedButton}>
          <Text style={styles.saveExtractedButtonText}>Save Extracted Values</Text>
        </TouchableOpacity>

        {/* Download Report Button */}
        <TouchableOpacity style={styles.downloadButton}>
          <Icon name="file-download" size={responsive.fontSize(20)} color="#fff" />
          <Text style={styles.downloadButtonText}>Download PDF Report</Text>
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
  uploadSection: {
    backgroundColor: '#fff',
    padding: responsive.padding(16),
    marginTop: responsive.margin(8),
  },
  uploadTitle: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: '#000',
  },
  uploadSubtitle: {
    fontSize: responsive.fontSize(12),
    color: '#999',
    marginTop: responsive.margin(4),
  },
  uploadButtons: {
    flexDirection: 'row',
    marginTop: responsive.margin(16),
    gap: responsive.margin(12),
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: responsive.padding(12),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: responsive.borderRadius(8),
    backgroundColor: '#FAFAFA',
  },
  uploadButtonText: {
    fontSize: responsive.fontSize(14),
    marginLeft: responsive.margin(8),
    color: '#333',
  },
  extractingText: {
    fontSize: responsive.fontSize(14),
    color: '#666',
    marginTop: responsive.margin(16),
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: responsive.padding(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginTop: responsive.margin(8),
  },
  tableHeaderText: {
    flex: 1,
    fontSize: responsive.fontSize(12),
    fontWeight: '600',
    color: '#666',
  },
  parameterRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: responsive.padding(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  parameterLabel: {
    flex: 1,
    fontSize: responsive.fontSize(14),
    color: '#000',
  },
  extractedContainer: {
    flex: 1,
  },
  extractedValue: {
    fontSize: responsive.fontSize(14),
    fontWeight: '600',
    color: '#000',
  },
  testInfo: {
    fontSize: responsive.fontSize(10),
    color: '#999',
    marginTop: responsive.margin(2),
  },
  unitValue: {
    flex: 1,
    fontSize: responsive.fontSize(14),
    color: '#000',
    textAlign: 'right',
  },
  flagBadge: {
    paddingHorizontal: responsive.padding(6),
    paddingVertical: responsive.padding(2),
    borderRadius: responsive.borderRadius(4),
    marginLeft: responsive.margin(4),
  },
  highBadge: {
    backgroundColor: '#FFF3CD',
  },
  lowBadge: {
    backgroundColor: '#D1ECF1',
  },
  flagText: {
    fontSize: responsive.fontSize(10),
    fontWeight: '600',
  },
  sexButtons: {
    flex: 2,
    flexDirection: 'row',
    gap: responsive.margin(8),
  },
  sexButton: {
    flex: 1,
    padding: responsive.padding(8),
    borderRadius: responsive.borderRadius(20),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  sexButtonActive: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  sexButtonText: {
    fontSize: responsive.fontSize(14),
    color: '#666',
  },
  sexButtonTextActive: {
    color: '#fff',
  },
  dialysisSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: responsive.padding(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dialysisTitle: {
    fontSize: responsive.fontSize(14),
    fontWeight: '600',
    color: '#000',
  },
  dialysisSubtitle: {
    fontSize: responsive.fontSize(12),
    color: '#666',
    marginTop: responsive.margin(2),
  },
  dialysisButtons: {
    flexDirection: 'row',
    gap: responsive.margin(8),
  },
  dialysisButton: {
    paddingHorizontal: responsive.padding(20),
    paddingVertical: responsive.padding(8),
    borderRadius: responsive.borderRadius(20),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  dialysisButtonActive: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  dialysisButtonInactive: {
    backgroundColor: '#F5F5F5',
  },
  dialysisButtonText: {
    fontSize: responsive.fontSize(14),
    color: '#666',
  },
  dialysisButtonTextActive: {
    color: '#fff',
  },
  notesSection: {
    backgroundColor: '#fff',
    padding: responsive.padding(16),
    marginTop: responsive.margin(8),
  },
  notesLabel: {
    fontSize: responsive.fontSize(14),
    fontWeight: '600',
    color: '#000',
    marginBottom: responsive.margin(8),
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: responsive.borderRadius(8),
    padding: responsive.padding(12),
    minHeight: responsive.height(60),
    fontSize: responsive.fontSize(14),
    textAlignVertical: 'top',
  },
  meldTabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: responsive.padding(16),
    marginTop: responsive.margin(8),
    gap: responsive.margin(8),
  },
  meldTab: {
    flex: 1,
    padding: responsive.padding(12),
    borderRadius: responsive.borderRadius(8),
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  meldTabActive: {
    backgroundColor: '#E8F5E9',
  },
  meldTabText: {
    fontSize: responsive.fontSize(14),
    color: '#666',
  },
  meldTabTextActive: {
    color: '#52ab3c',
    fontWeight: '600',
  },
  meldCards: {
    flexDirection: 'row',
    padding: responsive.padding(16),
    gap: responsive.margin(12),
  },
  meldCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: responsive.padding(16),
    borderRadius: responsive.borderRadius(8),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  meldCardTitle: {
    fontSize: responsive.fontSize(14),
    fontWeight: '600',
    color: '#000',
  },
  meldCardSubtitle: {
    fontSize: responsive.fontSize(12),
    color: '#666',
    marginTop: responsive.margin(4),
  },
  actionButtons: {
    flexDirection: 'row',
    padding: responsive.padding(16),
    gap: responsive.margin(12),
  },
  clearButton: {
    flex: 1,
    padding: responsive.padding(14),
    borderRadius: responsive.borderRadius(8),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  clearButtonText: {
    fontSize: responsive.fontSize(16),
    color: '#333',
  },
  saveButton: {
    flex: 1,
    padding: responsive.padding(14),
    borderRadius: responsive.borderRadius(8),
    alignItems: 'center',
    backgroundColor: '#52ab3c',
  },
  saveButtonText: {
    fontSize: responsive.fontSize(16),
    color: '#fff',
    fontWeight: '600',
  },
  insightsCard: {
    backgroundColor: '#0F7A6B',
    padding: responsive.padding(16),
    margin: responsive.margin(16),
    borderRadius: responsive.borderRadius(8),
  },
  insightsTitle: {
    fontSize: responsive.fontSize(14),
    fontWeight: '600',
    color: '#fff',
    marginBottom: responsive.margin(8),
  },
  insightsText: {
    fontSize: responsive.fontSize(13),
    color: '#B2DFDB',
    marginBottom: responsive.margin(6),
  },
  insightsDisclaimer: {
    fontSize: responsive.fontSize(11),
    color: '#80CBC4',
    marginTop: responsive.margin(8),
    fontStyle: 'italic',
  },
  saveExtractedButton: {
    backgroundColor: '#52ab3c',
    padding: responsive.padding(14),
    margin: responsive.margin(16),
    borderRadius: responsive.borderRadius(8),
    alignItems: 'center',
  },
  saveExtractedButtonText: {
    fontSize: responsive.fontSize(16),
    color: '#fff',
    fontWeight: '600',
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
  downloadButton: {
    flexDirection: 'row',
    backgroundColor: '#52ab3c',
    padding: responsive.padding(14),
    margin: responsive.margin(16),
    borderRadius: responsive.borderRadius(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButtonText: {
    fontSize: responsive.fontSize(16),
    color: '#fff',
    fontWeight: '600',
    marginLeft: responsive.margin(8),
  },
});

export default LabReportResultsScreen;