// App.tsx
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { Shadow } from 'react-native-shadow-2';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAILabReports } from './slices/reportSlice';
import { RootState, AppDispatch } from '../../redux/store';
import responsive from '../../theme/responsive'; // Import responsive utility functions
import { formatRelativeTime } from '../../utils/timeUtils';

interface LabResult {
  parameter: string;
  extractedValue: string;
  normalRange: string;
  flag: 'High' | 'Low' | 'Normal' | 'Mild';
}

// Define the type for route params
type RootStackParamList = {
  ReportMetadata: {
    documentName: string;
  };
};

const ReportMetadata: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RootStackParamList, 'ReportMetadata'>>();
    const dispatch = useDispatch<AppDispatch>();
    const { aiLabReports, loading, meldNaCount, meld3Count, meldTimestamp } = useSelector((state: RootState) => state.reports);
    const { user } = useSelector((state: RootState) => state.auth);
    const [activeTab, setActiveTab] = useState<string>('Reports');
    const userEmail = user?.email || '';
    
    // Get document name from route params
    const documentName = route.params?.documentName || '';

    useEffect(() => {
      // Fetch AI lab reports when component mounts with user email and document name
      if (userEmail && documentName) {
        dispatch(fetchAILabReports({ user: userEmail, ai_lab_report_document: documentName }));
      }
    }, [dispatch, userEmail, documentName]);

    // Extract MELD values from the second object in the data array
    const meldDataFromApi = aiLabReports.length > 1 && typeof aiLabReports[1] === 'object' && !('name' in aiLabReports[1]) 
      ? aiLabReports[1] as any 
      : null;
    
    const displayMeldNaCount = meldDataFromApi?.MELD_NA_count ?? meldNaCount;
    const displayMeld3Count = meldDataFromApi?.MELD_3_count ?? meld3Count;
    const displayMeldTimestamp = meldDataFromApi?.MELD_TIMESTAMP ?? meldTimestamp;
    
    // Filter out the MELD metadata object and get only the actual lab report
    const actualLabReports = aiLabReports.filter(report => report && 'name' in report && 'parameters' in report);

    // Extract AI insights from the third object in the data array (index 2)
    const aiInsightsData = aiLabReports.length > 2 && typeof aiLabReports[2] === 'object' && 'ai_insights' in aiLabReports[2]
      ? (aiLabReports[2] as any).ai_insights
      : null;
    
    const aiInsightsText = aiInsightsData?.ai_insights || '';
    const aiInsightsTimestamp = aiInsightsData?.timestamp || '';

    // Helper function to extract unit from normal range string
    const extractUnitFromRange = (range: string): string => {
      const unitMatch = range.match(/(mg\/dL|mmol\/L|g\/dL|U\/L|×10⁹\/L|mEq\/L|μmol\/L|per μL)/);
      return unitMatch ? unitMatch[0] : '';
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

    // Map API flag values to UI flag values
    const mapApiFlagToDisplayFlag = (apiFlag: string): 'High' | 'Low' | 'Normal' | 'Mild' => {
      switch(apiFlag.toLowerCase()) {
        case 'high':
          return 'High';
        case 'low':
          return 'Low';
        case 'normal':
          return 'Normal';
        case 'mild':
          return 'Mild';
        default:
          return 'Normal';
      }
    };

    // Convert API response to LabResult format
    const labResults: LabResult[] = actualLabReports.length > 0 ? actualLabReports[0].parameters ? Object.entries(actualLabReports[0].parameters).map(([paramKey, paramData]) => {
      // Convert parameter key to proper display name
      const displayName = paramKey.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      return {
        parameter: displayName,
        extractedValue: `${paramData.value} ${extractUnitFromRange(paramData.normal_range)}`,
        normalRange: paramData.normal_range.replace(/ mg\/dL| mmol\/L| g\/dL| U\/L| ×10⁹\/L/g, ''), // Clean range without units
        flag: mapApiFlagToDisplayFlag(paramData.flag),
      };
    }) : [] : [];

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
          <Icon name="arrow-back" size={responsive.fontSize(24)} color="#333333" />
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
          {/* <View style={styles.metadataCard}>
            <Text style={styles.cardTitle}>Report Metadata</Text>

            <View style={styles.metadataRow}>
              <Icon name="calendar-today" size={responsive.fontSize(20)} color="#333333" />
              <Text style={styles.metadataText}>
                Uploaded: {actualLabReports.length > 0 && actualLabReports[0].date ? formatDate(actualLabReports[0].date) : 'May 11, 2025'}
              </Text>
              <View style={styles.pdfBadge}>
                <Text style={styles.pdfText}>PDF</Text>
              </View>
            </View> */}

            {/* <View style={styles.metadataRow}>
              <Icon name="autorenew" size={responsive.fontSize(20)} color="#333333" />
              <Text style={styles.metadataText}>Parsing confidence</Text>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>93%</Text>
              </View>
            </View> */}

            {/* <TouchableOpacity style={styles.downloadButton}>
              <Icon name="file-download" size={responsive.fontSize(20)} color="#333333" />
              <Text style={styles.downloadText}>Download Parsed PDF</Text>
            </TouchableOpacity>
          </View> */}
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

            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading lab results...</Text>
              </View>
            ) : labResults.length > 0 ? (
              labResults.map((result, index) => renderLabRow(result, index))
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No lab results available</Text>
              </View>
            )}
          </View>
        {/* </Shadow> */}

        {/* Insights Card */}
         <View style={styles.newAiInsightsCard}> 
          <View style={styles.insightsHeader}>
            <View style={styles.sectionTitleRow}>
              <MaterialCommunityIcons name="lightbulb" size={20} color="#1A1A1A" />
              <Text style={styles.newInsightsTitle}>AI Insights</Text>
            </View>
            {/* <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>
                {aiInsightsTimestamp ? formatRelativeTime(aiInsightsTimestamp) : (actualLabReports.length > 0 && actualLabReports[0].date ? formatRelativeTime(actualLabReports[0].date) : 'Today')}
              </Text>
            </View> */}
          </View>

          <View style={styles.newInsightBox}>
            {/* Display AI Insights from API */}
            {aiInsightsText ? (
              <View style={[styles.insightItem, { backgroundColor: '#E3F2FD' }]}>
                <Icon name="info" size={22} color="#1976D2" style={styles.insightIcon} />
                <View style={styles.insightContent}>
                  <Text style={[styles.insightItemText, { color: '#1976D2' }]}>AI Analysis</Text>
                  <Text style={styles.insightItemSubText}>{aiInsightsText}</Text>
                </View>
              </View>
            ) : (
              <>
                {/* Sodium Insight */}
                <View style={[styles.insightItem, { backgroundColor: '#FFF8E1' }]}>              
                  <Icon name="trending-up" size={22} color="#FBC02D" style={styles.insightIcon} />
                  <View style={styles.insightContent}>
                    <Text style={[styles.insightItemText, { color: '#FBC02D' }]}>Sodium</Text>
                    <Text style={styles.insightItemSubText}>Slightly high compared to your daily limit.</Text>
                  </View>
                </View>

                {/* ALT Insight */}
                <View style={[styles.insightItem, { backgroundColor: '#FEECEE' }]}>              
                  <Icon name="trending-up" size={22} color="#D32F2F" style={styles.insightIcon} />
                  <View style={styles.insightContent}>
                    <Text style={[styles.insightItemText, { color: '#D32F2F' }]}>ALT</Text>
                    <Text style={styles.insightItemSubText}>Increased compared to last report.</Text>
                  </View>
                </View>
              </>
            )}

            <Text style={styles.disclaimerText}>These insights are informational only and not a diagnosis.</Text>
          </View>
        </View> 

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
                <Icon name="show-chart" size={responsive.fontSize(24)} color="#333333" />
                <View style={styles.meldInfo}>
                  <Text style={styles.meldTitle}>MELD-Na: {displayMeldNaCount ?? 'N/A'}</Text>
                  <Text style={styles.meldSubtitle}>MELD 3.0: {displayMeld3Count ?? 'N/A'}</Text>
                  <Text style={styles.meldTimestamp}>
                    Timestamp: {displayMeldTimestamp || (actualLabReports.length > 0 && actualLabReports[0].date ? formatDate(actualLabReports[0].date) : 'May 11, 2025')}
                  </Text>
                </View>
              </View>
              {/* <TouchableOpacity style={styles.viewFullButton}>
                <Text style={styles.viewFullText}>View Full MELD History</Text>
                <Icon name="chevron-right" size={responsive.fontSize(20)} color="#0D8282" />
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
            size={responsive.fontSize(26)}
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
            size={responsive.fontSize(26)}
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
            size={responsive.fontSize(26)}
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
            size={responsive.fontSize(26)}
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
    width: responsive.width(48),
    height: responsive.height(48),
    borderRadius: responsive.borderRadius(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: responsive.fontSize(22),
    fontWeight: '700',
    color: '#1F1F1F',
    marginLeft: responsive.margin(12),
    letterSpacing: -0.5,
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
  shadowWrapper: {
    width: '100%',
    marginBottom: hp('2%'),
  },
  metadataCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: responsive.borderRadius(12),
    padding: wp('4%'),
    borderWidth: responsive.width(1),
    borderColor: '#E8E8E8',
  },
  cardTitle: {
    fontSize: responsive.fontSize(16),
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: hp('2%'),
  },
  newAiInsightsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: responsive.borderRadius(12),
    padding: wp('4%'),
    borderWidth: responsive.width(1),
    borderColor: '#E8E8E8',
    marginBottom: hp('2%'),
  },
  insightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newInsightsTitle: {
    fontSize: responsive.fontSize(16),
    fontWeight: '700',
    color: '#1F1A1A',
    marginLeft: responsive.margin(8),
  },
  infoBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: responsive.padding(8),
    paddingVertical: responsive.padding(4),
    borderRadius: responsive.borderRadius(12),
  },
  infoBadgeText: {
    fontSize: responsive.fontSize(12),
    fontWeight: '500',
    color: '#666666',
  },
  newInsightBox: {
    gap: hp('1.5%'),
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('3%'),
    borderRadius: responsive.borderRadius(12),
  },
  insightIcon: {
    marginRight: responsive.margin(10),
  },
  insightContent: {
    flex: 1,
  },
  insightItemText: {
    fontSize: responsive.fontSize(14),
    fontWeight: '600',
  },
  insightItemSubText: {
    fontSize: responsive.fontSize(12),
    color: '#666666',
    marginTop: hp('0.3%'),
  },
  disclaimerText: {
    fontSize: responsive.fontSize(11),
    color: '#999999',
    fontStyle: 'italic',
    marginTop: hp('2%'),
    textAlign: 'center',
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
  confidenceBadge: {
    backgroundColor: '#52ab3c',
    paddingHorizontal: responsive.padding(10),
    paddingVertical: responsive.padding(4),
    borderRadius: responsive.borderRadius(12),
  },
  confidenceText: {
    fontSize: responsive.fontSize(12),
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
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: hp('1.5%'),
    borderBottomWidth: responsive.width(1),
    borderBottomColor: '#E8E8E8',
    marginBottom: hp('1%'),
  },
  tableHeaderText: {
    flex: 1,
    fontSize: responsive.fontSize(12),
    fontWeight: '700',
    color: '#666666',
    textAlign: 'left',
  },
  labRow: {
    flexDirection: 'row',
    paddingVertical: hp('1.5%'),
    borderBottomWidth: responsive.width(1),
    borderBottomColor: '#F5F5F5',
    alignItems: 'center',
  },
  labRowLast: {
    borderBottomWidth: 0,
  },
  parameterText: {
    flex: 1,
    fontSize: responsive.fontSize(13),
    fontWeight: '600',
    color: '#1F1F1F',
  },
  extractedValue: {
    flex: 1,
    fontSize: responsive.fontSize(13),
    fontWeight: '500',
    color: '#333333',
  },
  normalRange: {
    flex: 1,
    fontSize: responsive.fontSize(13),
    fontWeight: '400',
    color: '#666666',
  },
  flagBadge: {
    width: responsive.width(60),
    paddingHorizontal: responsive.padding(8),
    paddingVertical: responsive.padding(4),
    borderRadius: responsive.borderRadius(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagText: {
    fontSize: responsive.fontSize(10),
    fontWeight: '700',
    color: '#FFFFFF',
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
  meldCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: responsive.borderRadius(12),
    padding: wp('4%'),
    borderWidth: responsive.width(1),
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
    marginLeft: responsive.margin(12),
    flex: 1,
  },
  meldTitle: {
    fontSize: responsive.fontSize(15),
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: responsive.margin(4),
  },
  meldSubtitle: {
    fontSize: responsive.fontSize(13),
    fontWeight: '500',
    color: '#333333',
    marginBottom: responsive.margin(4),
  },
  meldTimestamp: {
    fontSize: responsive.fontSize(12),
    color: '#666666',
  },
  viewFullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1%'),
  },
  viewFullText: {
    fontSize: responsive.fontSize(14),
    fontWeight: '600',
    color: '#0D8282',
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
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: responsive.width(1),
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
    fontSize: responsive.fontSize(11),
    color: '#999999',
    marginTop: responsive.margin(4),
    fontWeight: '500',
  },
  navTextActive: {
    color: '#333333',
    fontWeight: '600',
  },
});

export default ReportMetadata;