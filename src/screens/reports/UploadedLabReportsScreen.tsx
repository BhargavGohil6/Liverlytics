// src/screens/UploadedLabReportsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const UploadedLabReportsScreen = ({ navigation }) => {
  const reports = [
    { date: 'May 11, 2025 • 09:15', source: 'PDF', accuracy: '93% accurate' },
    { date: 'Apr 28, 2025 • 14:02', source: 'Image', accuracy: '88% accurate' },
    { date: 'Apr 10, 2025 • 08:41', source: 'CSV', accuracy: '96% accurate' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Icon name="trending-up" size={24} color="#fff" />
            </View>
            <Text style={styles.logoText}>Liverlytics</Text>
          </View>
        </View> */}

        <View style={styles.titleSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Reports</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.pageTitle}>Uploaded Lab Reports</Text>

          {reports.map((report, index) => (
            <TouchableOpacity
              key={index}
              style={styles.reportCard}
              onPress={() => navigation.navigate('LabReportDetails')}
            >
              <View style={styles.reportLeft}>
                <Icon
                  name={
                    report.source === 'PDF'
                      ? 'document-text-outline'
                      : report.source === 'Image'
                      ? 'image-outline'
                      : 'document-outline'
                  }
                  size={24}
                  color="#374151"
                />
                <View style={styles.reportInfo}>
                  <Text style={styles.reportDate}>{report.date}</Text>
                  <Text style={styles.reportSource}>Source: {report.source}</Text>
                </View>
              </View>
              <View style={styles.reportRight}>
                <Text style={styles.reportAccuracy}>{report.accuracy}</Text>
                <Icon name="chatbubble-outline" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          ))}
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
    backgroundColor: '#52a64a',
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
  pageTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  reportCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  reportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  reportSource: {
    fontSize: 13,
    color: '#6b7280',
  },
  reportRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  reportAccuracy: {
    fontSize: 13,
    fontWeight: '500',
    color: '#52a64a',
  },
});

export default UploadedLabReportsScreen;