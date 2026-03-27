// src/screens/ReportsMainScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { 
  Activity, 
  Plus, 
  TestTube, 
  Utensils, 
  FileText, 
  Flag, 
  Heart, 
  Scale, 
  Droplet, 
  TrendingUp,
  Pill,
  Sparkles,
  Home,
  BarChart3,
  Bell,
  User,
  History,
  ChevronRight,
  SpaceIcon
} from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { downloadHealthReport } from './slices/reportSlice';
import Toast from 'react-native-toast-message';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { PermissionsAndroid } from 'react-native';

const ReportsMainScreen = ({ navigation }: any) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30 Days');
  
  // Get user email from auth state
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();

  // Request storage permission for Android
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      // For Android 13 (API 33) and above
      if (Platform.Version >= 33) {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        if (!hasPermission) {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          );
          return result === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
      } else {
        // For Android versions below 13
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (!hasPermission) {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'This app needs access to storage to save downloaded reports.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return result === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
      }
    }
    return true;
  };

  // Handle download health report
  const handleDownloadReport = async () => {
    try {
      // Extract days from selected period (e.g., "30 Days" -> "30")
      const days = selectedPeriod.split(' ')[0];
      
      // Get user email
      const userEmail = user?.email || '';
      
      console.log('Downloading health report...');
      console.log('User:', userEmail);
      console.log('Days:', days);
      
      // Dispatch Redux action
      const result = await dispatch(
        downloadHealthReport({
          user: userEmail,
          days: days
        })
      );
      
      // Check if the request was successful
      if (downloadHealthReport.fulfilled.match(result)) {
        console.log('API Response:', result.payload);
        console.log('Response message:', result.payload?.message);
        
        // Get the download URL from response
        const downloadUrl = result.payload?.downloadUrl;
        
        if (downloadUrl) {
          console.log('Downloading file from:', downloadUrl);
          
          try {
            // Request storage permission for Android
            if (Platform.OS === 'android') {
              const hasPermission = await requestStoragePermission();
              if (!hasPermission) {
                throw new Error('Storage permission denied');
              }
            }
            
            // Configure download options for react-native-blob-util
            const config = Platform.select({
              ios: {
                fileCache: true,
                appendExt: 'pdf',
              },
              android: {
                fileCache: true,
                appendExt: 'pdf',
                addAndroidDownloads: {
                  useDownloadManager: true,
                  title: `Health Report - ${days} Days`,
                  description: 'Downloading health report PDF...',
                  mimeType: 'application/pdf',
                  mediaScannable: true,
                  notification: true,
                  path: `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/Health_Report_${days}_Days.pdf`,
                },
              },
            });

            // Download the file using react-native-blob-util
            const fetchBlobResponse = await ReactNativeBlobUtil.config(config as any).fetch('GET', downloadUrl, {
              'Accept': 'application/pdf',
            });

            console.log('File downloaded successfully:', fetchBlobResponse.path());

            // Show success message
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: `PDF downloaded to Downloads folder!`,
              visibilityTime: 3000,
            });
          } catch (downloadError: any) {
            console.error('Download error:', downloadError);
            throw new Error('Failed to download PDF file');
          }
        } else {
          // Fallback: show success message with response details
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Health report generated successfully!',
            visibilityTime: 3000,
          });
        }
      } else if (downloadHealthReport.rejected.match(result)) {
        console.log('Download Error:', result.payload);
        
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: result.payload || 'Failed to download health report',
          visibilityTime: 3000,
        });
      }
      
    } catch (error: any) {
      console.log('Download Error:', error);
      
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to download health report',
        visibilityTime: 3000,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        {/* <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Icon name="trending-up" size={24} color="#fff" />
            </View>
            <Text style={styles.logoText}>Liverlytics</Text>
          </View>
        </View> */}

        {/* Title */}
        <View style={styles.titleSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Reports</Text>
        </View>

        <View style={styles.content}>
          {/* Generate Health Report */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Generate Health Report</Text>
            <Text style={styles.cardSubtitle}>
              Export last 30-90 days health summary in PDF format.
            </Text>

            <View style={styles.periodSelector}>
              {['30 Days', '60 Days', '90 Days'].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive,
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text
                    style={[
                      styles.periodText,
                      selectedPeriod === period && styles.periodTextActive,
                    ]}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadReport}>
              <Icon name="document-text" size={20} color="#fff" />
              <Text style={styles.downloadButtonText}>Download PDF Report</Text>
            </TouchableOpacity>

            <Text style={styles.includesText}>
              Includes MELD summary, vitals snapshot, diet totals, exercise & sleep.
            </Text>
          </View>

          {/* AI Lab Reports */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>AI Lab Reports (Uploaded Reports)</Text>
            <Text style={styles.cardSubtitle}>
              View parsed lab reports and extracted values.
            </Text>

            <TouchableOpacity style={styles.viewButton} onPress={()=>navigation.navigate('ViewLabReports')}>
              <Icon name="folder-open-outline" size={20} color="#1f2937" />
              <Text style={styles.viewButtonText}>View Lab Reports</Text>
            </TouchableOpacity>
          </View>

          {/* Flags Timeline */}
          {/* <View style={styles.card}>
            <Text style={styles.cardTitle}>Flags Timeline</Text>
            <Text style={styles.cardSubtitle}>
              System-generated warnings from Vitals, Labs, Diet, and Exercise.
            </Text>

            <TouchableOpacity style={styles.viewButton} onPress={()=>navigation.navigate('ViewTimeline')}>
              <Icon name="grid-outline" size={20} color="#1f2937" />
              <Text style={styles.viewButtonText}>View Timeline</Text>
            </TouchableOpacity>
          </View> */}
        </View>
        
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: '#52ab3c',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#52ab3c',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  periodTextActive: {
    color: '#fff',
  },
  downloadButton: {
    flexDirection: 'row',
    backgroundColor: '#52ab3c',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  includesText: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  viewButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  viewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
   bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 8,
    bottom: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  navTextActive: {
    color: '#52ab3c',
    fontWeight: '600',
  },
  
});

export default ReportsMainScreen;