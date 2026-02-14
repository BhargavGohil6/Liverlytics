// CompareReports.tsx
import React, { useState, useEffect } from 'react';
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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLatestTwoAILabReports } from './slices/reportSlice';
import { RootState, AppDispatch } from '../../redux/store';
import responsive from '../../theme/responsive';

interface LabResult {
  parameter: string;
  currentValue: string;
  lastValue: string;
  normalRange: string;
}

const CompareReports: React.FC = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { latestTwoAILabReports, latestTwoAILabReportsLoading } = useSelector((state: RootState) => state.reports);
    const { user } = useSelector((state: RootState) => state.auth);
    const [activeTab, setActiveTab] = useState<string>('Reports');
    const userEmail = user?.email || '';

    useEffect(() => {
      // Fetch latest two AI lab reports when component mounts
      if (userEmail) {
        dispatch(fetchLatestTwoAILabReports({ user: userEmail }));
      }
    }, [dispatch, userEmail]);

    // Helper function to extract unit from normal range string
    const extractUnitFromRange = (range: string): string => {
      const unitMatch = range.match(/(mg\/dL|mmol\/L|g\/dL|U\/L|×10⁹\/L|mEq\/L|μmol\/L|per μL|Ratio)/);
      return unitMatch ? unitMatch[0] : '';
    };

    // Helper function to extract only numeric value from string
    const extractNumericValue = (value: string): string => {
      // First, try to extract the pure numeric value
      const numericMatch = value.match(/([0-9]+\.?[0-9]*)/);
      return numericMatch ? numericMatch[0] : value;
    };

    // Helper function to format date from API
    const formatDate = (dateString: string): string => {
      // Handle the case where dateString is already in the desired format
      if (dateString.includes('•')) {
        // If it contains '•', it might have time, so extract only date part
        const datePart = dateString.split(' • ')[0];
        return datePart;
      }
      
      // Try to parse the date string from API (handle various formats)
      let date: Date;
      
      // If dateString is in 'YYYY-MM-DD' format, append time to make it valid
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        date = new Date(`${dateString}T00:00:00`);
      } else {
        date = new Date(dateString);
      }
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        // If invalid, return as is
        return dateString;
      }
      
      // Format the date as "Month DD, YYYY" (without time)
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      const formattedDate = date.toLocaleDateString(undefined, options);
      
      return formattedDate;
    };

    // Convert API response to LabResult format for comparison
    const labResults: LabResult[] = [];
    
    if (latestTwoAILabReports.length >= 2) {
      const latestReport = latestTwoAILabReports[0];
      const previousReport = latestTwoAILabReports[1];
      
      // Get all unique parameters from both reports
      const allParameters = new Set([
        ...Object.keys(latestReport.parameters),
        ...Object.keys(previousReport.parameters)
      ]);
      
      allParameters.forEach(paramKey => {
        // Convert parameter key to proper display name
        const displayName = paramKey.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        const latestParam = latestReport.parameters[paramKey];
        const previousParam = previousReport.parameters[paramKey];
        
        // Extract unit from normal range
        const unit = latestParam ? extractUnitFromRange(latestParam.normal_range) : 
                    previousParam ? extractUnitFromRange(previousParam.normal_range) : '';
        
        labResults.push({
          parameter: displayName,
          currentValue: latestParam ? extractNumericValue(latestParam.value) : 'N/A',
          lastValue: previousParam ? extractNumericValue(previousParam.value) : 'N/A',
          normalRange: latestParam ? `${latestParam.normal_range.replace(/ mg\/dL| mmol\/L| g\/dL| U\/L| ×10⁹\/L|mEq\/L|μmol\/L|per μL|Ratio/g, '')} ${unit}`.trim() : 
                       previousParam ? `${previousParam.normal_range.replace(/ mg\/dL| mmol\/L| g\/dL| U\/L| ×10⁹\/L|mEq\/L|μmol\/L|per μL|Ratio/g, '')} ${unit}`.trim() : 'N/A',
        });
      });
    }

  const renderLabRow = (result: LabResult, index: number) => {
    // Extract unit from normal range for display
    const unit = extractUnitFromRange(result.normalRange);
    const normalRangeWithoutUnit = result.normalRange.replace(/ mg\/dL| mmol\/L| g\/dL| U\/L| ×10⁹\/L|mEq\/L|μmol\/L|per μL|Ratio/g, '').trim();
    
    return (
      <View
        key={index}
        style={[
          styles.labRow,
          index === labResults.length - 1 && styles.labRowLast,
        ]}
      >
        <Text style={styles.parameterText}>{result.parameter}</Text>
        <Text style={styles.currentValue}>{result.currentValue}</Text>
        <Text style={styles.lastValue}>{result.lastValue}</Text>
        <View style={styles.normalRangeContainer}>
          <Text style={styles.normalRange}>{normalRangeWithoutUnit}</Text>
          {unit ? <Text style={styles.unitText}>{unit}</Text> : null}
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
          <Icon name="arrow-back" size={responsive.fontSize(24)} color="#333333" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Compare Reports</Text>
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
        <View style={styles.metadataCard}>
          <Text style={styles.cardTitle}>Report Comparison</Text>

          {latestTwoAILabReports.length >= 2 && (
            <View>
              <View style={styles.metadataRow}>
                <Icon name="calendar-today" size={responsive.fontSize(20)} color="#333333" />
                <Text style={styles.metadataText}>
                  Current Report: {formatDate(latestTwoAILabReports[0].date)}
                </Text>
                <View style={styles.pdfBadge}>
                  <Text style={styles.pdfText}>PDF</Text>
                </View>
              </View>

              <View style={styles.metadataRow}>
                <Icon name="calendar-today" size={responsive.fontSize(20)} color="#333333" />
                <Text style={styles.metadataText}>
                  Previous Report: {formatDate(latestTwoAILabReports[1].date)}
                </Text>
                <View style={styles.pdfBadge}>
                  <Text style={styles.pdfText}>PDF</Text>
                </View>
              </View>
            </View>
          )}

          {/* <TouchableOpacity style={styles.downloadButton}>
            <Icon name="file-download" size={responsive.fontSize(20)} color="#333333" />
            <Text style={styles.downloadText}>Download Comparison Report</Text>
          </TouchableOpacity> */}
        </View>

        {/* Comparison Table Card */}
        <View style={styles.labsCard}>
          <Text style={styles.cardTitle}>Lab Values Comparison</Text>

          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Parameter</Text>
            <Text style={styles.tableHeaderTextValues}>Current</Text>
            <Text style={styles.tableHeaderTextValues}>Previous</Text>
            <Text style={styles.tableHeaderText}>Range & Unit</Text>
          </View>

          {latestTwoAILabReportsLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading comparison data...</Text>
            </View>
          ) : labResults.length > 0 ? (
            labResults.map((result, index) => renderLabRow(result, index))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No comparison data available</Text>
            </View>
          )}
        </View>

        {/* Insights Card */}
        {/* <LinearGradient
          colors={['#0D8282', '#0FA3A3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.insightsCard}
        >
          <Text style={styles.insightsTitle}>Comparison Insights</Text>

          <View style={styles.insightRow}>
            <Icon name="trending-up" size={responsive.fontSize(20)} color="#FFFFFF" />
            <Text style={styles.insightText}>
              Sodium decreased from previous reading.
            </Text>
          </View>

          <View style={styles.insightRow}>
            <Icon name="trending-down" size={responsive.fontSize(20)} color="#FFFFFF" />
            <Text style={styles.insightText}>
              Potassium increased compared to last report.
            </Text>
          </View>
        </LinearGradient> */}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerDivider: {
    height: responsive.height(1),
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
    fontSize: responsive.fontSize(16),
    color: '#333333',
    marginLeft: responsive.margin(8),
    fontWeight: '500',
  },
  pageTitle: {
    fontSize: responsive.fontSize(28),
    fontWeight: '700',
    color: '#1F1F1F',
    letterSpacing: -0.5,
  },
  contentDivider: {
    height: responsive.height(1),
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
  metadataCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: responsive.borderRadius(12),
    padding: wp('4%'),
    borderWidth: responsive.width(1),
    borderColor: '#E8E8E8',
    marginBottom: hp('2%'),
  },
  cardTitle: {
    fontSize: responsive.fontSize(16),
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
    fontSize: responsive.fontSize(14),
    color: '#333333',
    marginLeft: responsive.margin(10),
    fontWeight: '500',
  },
  pdfBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: responsive.padding(10),
    paddingVertical: responsive.padding(4),
    borderRadius: responsive.borderRadius(6),
  },
  pdfText: {
    fontSize: responsive.fontSize(11),
    fontWeight: '600',
    color: '#666666',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('1%'),
    paddingVertical: hp('1.2%'),
  },
  downloadText: {
    fontSize: responsive.fontSize(14),
    fontWeight: '600',
    color: '#333333',
    marginLeft: responsive.margin(8),
  },
  labsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: responsive.borderRadius(12),
    padding: wp('4%'),
    borderWidth: responsive.width(1),
    borderColor: '#E8E8E8',
    marginBottom: hp('2%'),
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: hp('1%'),
    borderBottomWidth: responsive.width(0.5),
    borderBottomColor: '#E8E8E8',
    marginBottom: hp('0.5%'),
  },
  tableHeaderText: {
    flex: 1.2,
    fontSize: responsive.fontSize(10),
    fontWeight: '700',
    color: '#666666',
    textAlign: 'left',
  },
  tableHeaderTextValues: {
    flex: 0.8,
    fontSize: responsive.fontSize(10),
    fontWeight: '700',
    color: '#666666',
    textAlign: 'left',
  },
  labRow: {
    flexDirection: 'row',
    paddingVertical: hp('1%'),
    borderBottomWidth: responsive.width(0.5),
    borderBottomColor: '#F5F5F5',
    alignItems: 'center',
  },
  labRowLast: {
    borderBottomWidth: 0,
  },
  parameterText: {
    flex: 1.2,
    fontSize: responsive.fontSize(10),
    fontWeight: '600',
    color: '#1F1F1F',
  },
  currentValue: {
    flex: 0.8,
    fontSize: responsive.fontSize(10),
    fontWeight: '500',
    color: '#333333',
  },
  lastValue: {
    flex: 0.8,
    fontSize: responsive.fontSize(10),
    fontWeight: '500',
    color: '#666666',
  },
  normalRange: {
    flex: 1,
    fontSize: responsive.fontSize(10),
    fontWeight: '400',
    color: '#666666',
    textAlign: 'left',
  },
  normalRangeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  unitText: {
    fontSize: responsive.fontSize(9),
    fontWeight: '400',
    color: '#666666',
    marginLeft: responsive.margin(2),
    alignSelf: 'center',
  },
  insightsCard: {
    borderRadius: responsive.borderRadius(12),
    padding: wp('4%'),
    marginBottom: hp('2%'),
  },
  insightsTitle: {
    fontSize: responsive.fontSize(16),
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
    fontSize: responsive.fontSize(14),
    color: '#FFFFFF',
    marginLeft: responsive.margin(10),
    lineHeight: responsive.fontSize(20),
  },
  bottomSpacer: {
    height: hp('2%'),
  },
  loadingContainer: {
    paddingVertical: hp('2%'),
    alignItems: 'center',
  },
  loadingText: {
    fontSize: responsive.fontSize(16),
    color: '#666666',
    textAlign: 'center',
  },
  noDataContainer: {
    paddingVertical: hp('2%'),
    alignItems: 'center',
  },
  noDataText: {
    fontSize: responsive.fontSize(16),
    color: '#999999',
    textAlign: 'center',
  },
});

export default CompareReports;