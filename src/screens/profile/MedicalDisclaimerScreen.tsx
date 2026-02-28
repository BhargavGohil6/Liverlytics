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

type MedicalDisclaimerScreenProps = {
  navigation: any;
};

const MedicalDisclaimerScreen: React.FC<MedicalDisclaimerScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical Disclaimer</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Icon name="warning" size={24} color="#f59e0b" />
            <Text style={styles.cardTitle}>Important Medical Information</Text>
          </View>
          
          <Text style={styles.updateText}>Last updated: February 15, 2026</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medical Disclaimer</Text>
            <Text style={styles.paragraph}>
              This application is designed to provide general health and wellness information for individuals with cirrhosis and related liver conditions. The information provided is for educational and informational purposes only and should not be considered medical advice.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Not a Substitute for Professional Care</Text>
            <Text style={styles.paragraph}>
              This app does not replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read in this application.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Limitations</Text>
            <Text style={styles.paragraph}>
              The information provided in this app is based on general medical knowledge and may not apply to your specific situation. Individual results may vary. The app's recommendations, alerts, and predictions are based on algorithms and should be used as guidance only.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Situations</Text>
            <Text style={styles.paragraph}>
              If you think you may have a medical emergency, call your doctor or 911 immediately. This app is not designed for emergency situations and should not be used as a substitute for emergency medical services.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>User Responsibility</Text>
            <Text style={styles.paragraph}>
              You are responsible for your own health decisions. The developers and contributors of this application are not liable for any health outcomes that may result from your use of this information.
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

export default MedicalDisclaimerScreen;