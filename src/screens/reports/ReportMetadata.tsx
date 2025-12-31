// App.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import { Shadow } from 'react-native-shadow-2';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

interface LabResult {
  parameter: string;
  extractedValue: string;
  normalRange: string;
  flag: 'High' | 'Low' | 'Normal' | 'Mild';
}

const ReportMetadata: React.FC = () => {
    const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<string>('Reports');

  const labResults: LabResult[] = [
    { parameter: 'Bilirubin', extractedValue: '1.8 mg/dL', normalRange: '0.1–1.2', flag: 'High' },
    { parameter: 'INR', extractedValue: '1.5', normalRange: '0.9–1.2', flag: 'Mild' },
    { parameter: 'Creatinine', extractedValue: '0.9 mg/dL', normalRange: '0.7–1.3', flag: 'Normal' },
    { parameter: 'Sodium', extractedValue: '132 mmol/L', normalRange: '135–145', flag: 'Low' },
    { parameter: 'Albumin', extractedValue: '3.1 g/dL', normalRange: '3.5–5.0', flag: 'Low' },
    { parameter: 'AST', extractedValue: '58 U/L', normalRange: '10–40', flag: 'High' },
    { parameter: 'ALT', extractedValue: '72 U/L', normalRange: '7–56', flag: 'High' },
    { parameter: 'Platelet Count', extractedValue: '130 ×10⁹/L', normalRange: '150–400', flag: 'Low' },
    { parameter: 'Hemoglobin', extractedValue: '12.9 g/dL', normalRange: '13.5–17.5', flag: 'Low' },
    { parameter: 'WBC', extractedValue: '5.6 ×10⁹/L', normalRange: '4.0–11.0', flag: 'Normal' },
    { parameter: 'Potassium', extractedValue: '4.2 mmol/L', normalRange: '3.5–5.1', flag: 'Normal' },
    { parameter: 'Ammonia', extractedValue: '42 µmol/L', normalRange: '15–45', flag: 'Normal' },
  ];

  const getFlagColor = (flag: string) => {
    switch (flag) {
      case 'High':
        return '#EF5350';
      case 'Low':
        return '#FFC107';
      case 'Mild':
        return '#FFC107';
      case 'Normal':
        return '#52ab3c';
      default:
        return '#999999';
    }
  };

  const renderLabRow = (result: LabResult, index: number) => {
    return (
      <View
        key={index}
        style={[
          styles.labRow,
          index === labResults.length - 1 && styles.labRowLast,
        ]}
      >
        <Text style={styles.parameterText}>{result.parameter}</Text>
        <Text style={styles.extractedValue}>{result.extractedValue}</Text>
        <Text style={styles.normalRange}>{result.normalRange}</Text>
        <View
          style={[
            styles.flagBadge,
            { backgroundColor: getFlagColor(result.flag) },
          ]}
        >
          <Text style={styles.flagText}>{result.flag}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

     

      {/* Divider */}
      <View style={styles.headerDivider} />

      {/* Back Button & Title */}
      <View style={styles.titleSection}>
        <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333333" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Reports</Text>
      </View>

      {/* Content Divider */}
      <View style={styles.contentDivider} />

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Report Metadata Card */}
        {/* <Shadow
          distance={3}
          startColor={'#00000010'}
          offset={[0, 2]}
          style={styles.shadowWrapper}
        > */}
          <View style={styles.metadataCard}>
            <Text style={styles.cardTitle}>Report Metadata</Text>

            <View style={styles.metadataRow}>
              <Icon name="calendar-today" size={20} color="#333333" />
              <Text style={styles.metadataText}>
                Uploaded: May 11, 2025 • 09:15
              </Text>
              <View style={styles.pdfBadge}>
                <Text style={styles.pdfText}>PDF</Text>
              </View>
            </View>

            <View style={styles.metadataRow}>
              <Icon name="autorenew" size={20} color="#333333" />
              <Text style={styles.metadataText}>Parsing confidence</Text>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>93%</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.downloadButton}>
              <Icon name="file-download" size={20} color="#333333" />
              <Text style={styles.downloadText}>Download Parsed PDF</Text>
            </TouchableOpacity>
          </View>
        {/* </Shadow> */}

        {/* Extracted Labs Card */}
        {/* <Shadow
          distance={3}
          startColor={'#00000010'}
          offset={[0, 2]}
          style={styles.shadowWrapper}
        > */}
          <View style={styles.labsCard}>
            <Text style={styles.cardTitle}>Extracted Labs</Text>

            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Parameter</Text>
              <Text style={styles.tableHeaderText}>Extracted Value</Text>
              <Text style={styles.tableHeaderText}>Normal Range</Text>
              <Text style={styles.tableHeaderText}>Flag</Text>
            </View>

            {labResults.map((result, index) => renderLabRow(result, index))}
          </View>
        {/* </Shadow> */}

        {/* Insights Card */}
        <LinearGradient
          colors={['#0D8282', '#0FA3A3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.insightsCard}
        >
          <Text style={styles.insightsTitle}>Insights</Text>

          <View style={styles.insightRow}>
            <Icon name="lightbulb-outline" size={20} color="#FFFFFF" />
            <Text style={styles.insightText}>
              Sodium slightly lower than previous reading.
            </Text>
          </View>

          <View style={styles.insightRow}>
            <Icon name="trending-up" size={20} color="#FFFFFF" />
            <Text style={styles.insightText}>
              ALT increased compared to last report.
            </Text>
          </View>
        </LinearGradient>

        {/* Related MELD Values Card */}
        {/* <Shadow
          distance={3}
          startColor={'#00000010'}
          offset={[0, 2]}
          style={styles.shadowWrapper}
        > */}
          <View style={styles.meldCard}>
            <Text style={styles.cardTitle}>Related MELD Values</Text>

            <View style={styles.meldContent}>
              <View style={styles.meldLeft}>
                <Icon name="show-chart" size={24} color="#333333" />
                <View style={styles.meldInfo}>
                  <Text style={styles.meldTitle}>MELD-Na: 18</Text>
                  <Text style={styles.meldSubtitle}>MELD 3.0: 20</Text>
                  <Text style={styles.meldTimestamp}>
                    Timestamp: May 11, 2025 • 09:16
                  </Text>
                </View>
              </View>
              {/* <TouchableOpacity style={styles.viewFullButton}>
                <Text style={styles.viewFullText}>View Full MELD History</Text>
                <Icon name="chevron-right" size={20} color="#0D8282" />
              </TouchableOpacity> */}
            </View>
          </View>
        {/* </Shadow> */}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Navigation */}
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('Home')}
        >
          <Icon
            name="home"
            size={26}
            color={activeTab === 'Home' ? '#333333' : '#999999'}
          />
          <Text
            style={[
              styles.navText,
              activeTab === 'Home' && styles.navTextActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('Reports')}
        >
          <Icon
            name="bar-chart"
            size={26}
            color={activeTab === 'Reports' ? '#333333' : '#999999'}
          />
          <Text
            style={[
              styles.navText,
              activeTab === 'Reports' && styles.navTextActive,
            ]}
          >
            Reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('Reminders')}
        >
          <Icon
            name="access-alarm"
            size={26}
            color={activeTab === 'Reminders' ? '#333333' : '#999999'}
          />
          <Text
            style={[
              styles.navText,
              activeTab === 'Reminders' && styles.navTextActive,
            ]}
          >
            Reminders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('Profile')}
        >
          <Icon
            name="person"
            size={26}
            color={activeTab === 'Profile' ? '#333333' : '#999999'}
          />
          <Text
            style={[
              styles.navText,
              activeTab === 'Profile' && styles.navTextActive,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoGradient: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F1F1F',
    marginLeft: 12,
    letterSpacing: -0.5,
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  titleSection: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2.5%'),
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  backText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 8,
    fontWeight: '500',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F1F1F',
    letterSpacing: -0.5,
  },
  contentDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('2%'),
  },
  shadowWrapper: {
    width: '100%',
    marginBottom: hp('2%'),
  },
  metadataCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: wp('4%'),
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: hp('2%'),
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  metadataText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    marginLeft: 10,
    fontWeight: '500',
  },
  pdfBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pdfText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666666',
  },
  confidenceBadge: {
    backgroundColor: '#52ab3c',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('1%'),
    paddingVertical: hp('1.2%'),
  },
  downloadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
  },
  labsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: wp('4%'),
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    marginBottom: hp('1%'),
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#666666',
    textAlign: 'left',
  },
  labRow: {
    flexDirection: 'row',
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    alignItems: 'center',
  },
  labRowLast: {
    borderBottomWidth: 0,
  },
  parameterText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1F1F1F',
  },
  extractedValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#333333',
  },
  normalRange: {
    flex: 1,
    fontSize: 13,
    fontWeight: '400',
    color: '#666666',
  },
  flagBadge: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  flagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  insightsCard: {
    borderRadius: 12,
    padding: wp('4%'),
    marginBottom: hp('2%'),
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: hp('1.5%'),
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp('1%'),
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 10,
    lineHeight: 20,
  },
  meldCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: wp('4%'),
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  meldContent: {
    flexDirection: 'column',
  },
  meldLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp('1.5%'),
  },
  meldInfo: {
    marginLeft: 12,
    flex: 1,
  },
  meldTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 4,
  },
  meldSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  meldTimestamp: {
    fontSize: 12,
    color: '#666666',
  },
  viewFullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1%'),
  },
  viewFullText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D8282',
  },
  bottomSpacer: {
    height: hp('2%'),
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('2%'),
    paddingBottom: hp('1.5%'),
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('0.5%'),
  },
  navText: {
    fontSize: 11,
    color: '#999999',
    marginTop: 4,
    fontWeight: '500',
  },
  navTextActive: {
    color: '#333333',
    fontWeight: '600',
  },
});

export default ReportMetadata;