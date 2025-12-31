// src/screens/ReportsMainScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
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

const ReportsMainScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30 Days');

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

            <TouchableOpacity style={styles.downloadButton}>
              <Icon name="document-text" size={20} color="#fff" />
              <Text style={styles.downloadButtonText}>Download PDF Report</Text>
            </TouchableOpacity>

            <Text style={styles.includesText}>
              Includes MELD summary, vitals snapshot, diet totals, exercise & sleep,
              medication adherence, flags timeline, AI labs summary, and mini-charts.
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
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Flags Timeline</Text>
            <Text style={styles.cardSubtitle}>
              System-generated warnings from Vitals, Labs, Diet, and Exercise.
            </Text>

            <TouchableOpacity style={styles.viewButton} onPress={()=>navigation.navigate('ViewTimeline')}>
              <Icon name="grid-outline" size={20} color="#1f2937" />
              <Text style={styles.viewButtonText}>View Timeline</Text>
            </TouchableOpacity>
          </View>
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