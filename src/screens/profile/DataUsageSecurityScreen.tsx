import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type DataUsageSecurityScreenProps = {
  navigation: any;
};

const DataUsageSecurityScreen: React.FC<DataUsageSecurityScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Data Usage & Security</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Icon name="lock-closed" size={24} color="#52ab3c" />
            <Text style={styles.cardTitle}>Your Data Protection</Text>
          </View>
          
          <Text style={styles.updateText}>Last updated: February 15, 2026 • Version 1.0.0</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Collection</Text>
            <Text style={styles.paragraph}>
              We collect health data including vital signs, medication information, dietary logs, exercise data, and laboratory results to provide personalized health insights and alerts.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Storage & Encryption</Text>
            <Text style={styles.paragraph}>
              All personal health information is encrypted both in transit and at rest using industry-standard encryption protocols (AES-256). Data is stored securely in compliance with healthcare regulations.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Access Controls</Text>
            <Text style={styles.paragraph}>
              Access to your health data is strictly controlled. Only authorized healthcare providers and app administrators can access data, and only with proper authentication and authorization.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Retention</Text>
            <Text style={styles.paragraph}>
              Health data is retained for as long as your account is active. You may request data deletion at any time through the account management section. Backup data is retained for 30 days after deletion.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Third-Party Sharing</Text>
            <Text style={styles.paragraph}>
              We do not sell or share your personal health information with third parties for marketing purposes. Data may be shared with our trusted third-party AI provider only if you opt in for cloud AI analysis, and with healthcare providers you authorize or for research purposes with your explicit consent.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Rights</Text>
            <Text style={styles.paragraph}>
              You have the right to access, correct, or delete your personal data. You can export your data at any time and request account deletion through the privacy settings.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security Measures</Text>
            <Text style={styles.paragraph}>
              We implement multiple layers of security including secure authentication, regular security audits, intrusion detection systems, and employee training on data protection practices.
            </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginLeft: 12,
  },
  updateText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});

export default DataUsageSecurityScreen;