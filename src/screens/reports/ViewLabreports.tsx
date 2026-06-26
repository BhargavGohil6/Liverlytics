// ViewLabReports.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchUserDocuments } from './slices/reportSlice';
// import { Shadow } from 'react-native-shadow-2';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

interface ReportItem {
  id: string;
  name: string; // Document name for API call
  date: string;
  time: string;
  source: string;
  accuracy: number;
  iconName: string;
}

const ViewLabReports: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { userDocuments, loading } = useSelector((state: RootState) => state.reports);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const userEmail = user?.email;
    if (userEmail) {
      dispatch(fetchUserDocuments({ user: userEmail }));
    }
  }, [dispatch, user]);

  const formattedReports: ReportItem[] = userDocuments.map((doc) => {
    const dateObj = new Date(doc.date);
    return {
      id: doc.name,
      name: doc.name,
      date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      source: doc.source,
      accuracy: Math.round(doc.accurate),
      iconName: doc.source.toLowerCase().includes('pdf') ? 'description' : 'image',
    };
  });

  const [activeTab, setActiveTab] = React.useState<string>('Reports');

  const renderReportCard = (report: ReportItem) => {
    return (
    //   <Shadow
    //     key={report.id}
    //     distance={2}
    //     startColor={'#00000008'}
    //     offset={[0, 1]}
    //     style={styles.shadowWrapper}
    //   >
     <TouchableOpacity onPress={()=>navigation.navigate('ReportMetadata', { documentName: report.name })}>
        <View style={styles.reportCard}>
   
          <View style={styles.reportLeft}>
            <View style={styles.iconContainer}>
              <Icon name={report.iconName} size={24} color="#333333" />
            </View>
            <View style={styles.reportInfo}>
              <Text style={styles.reportDate}>
                {report.date} • {report.time}
              </Text>
              <Text style={styles.reportSource}>Source: {report.source}</Text>
            </View>
          </View>
          {/* <View style={styles.reportRight}>
            <Text style={styles.accuracyText}>{report.accuracy}% accurate</Text>
            <TouchableOpacity style={styles.commentButton}>
              <Icon name="chat-bubble-outline" size={20} color="#666666" />
            </TouchableOpacity>
          </View> */}
         
        </View>
         </TouchableOpacity>
    //   {/* </Shadow> */}
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
     

      {/* Divider */}
      <View style={styles.headerDivider} />

      {/* Back Button & Title */}
      <View style={styles.titleSection}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Uploaded Lab Reports</Text>
          {formattedReports.length > 0 && (
            <TouchableOpacity 
              style={styles.compareButton}
              onPress={() => navigation.navigate('CompareReports')}
            >
              <Text style={styles.compareButtonText}>Compare</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#333333" />
            </View>
        ) : formattedReports.length > 0 ? (
            formattedReports.map((report) => renderReportCard(report))
        ) : (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No reports found</Text>
            </View>
        )}
      </ScrollView>

     
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: '5%',
    paddingVertical: '2%',
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
    marginTop: '1%',
  },
  titleSection: {
    paddingHorizontal: '5%',
    paddingVertical: '2.5%',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '1.5%',
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
    paddingHorizontal: '5%',
    paddingTop: '3%',
    paddingBottom: '2%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2%',
  },
  compareButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  compareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  shadowWrapper: {
    width: '100%',
    marginBottom: '1.5%',
  },
  reportCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: '4%',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  reportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F1F1F',
    marginBottom: 4,
  },
  reportSource: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '400',
  },
  reportRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accuracyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F1F1F',
  },
  commentButton: {
    padding: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    paddingVertical: '1%',
    paddingHorizontal: '2%',
    paddingBottom: '1.5%',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '0.5%',
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
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
});

export default ViewLabReports;