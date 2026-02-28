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

type AITransparencyScreenProps = {
  navigation: any;
};

const AITransparencyScreen: React.FC<AITransparencyScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Transparency Statement</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Icon name="code" size={24} color="#8b5cf6" />
            <Text style={styles.cardTitle}>Artificial Intelligence Usage</Text>
          </View>
          
          <Text style={styles.updateText}>Last updated: February 15, 2026</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Purpose & Function</Text>
            <Text style={styles.paragraph}>
              Our application uses artificial intelligence to analyze health data patterns, provide personalized insights, and generate predictive alerts for liver health management. The AI systems are designed to assist healthcare decisions, not replace professional medical judgment.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Processing</Text>
            <Text style={styles.paragraph}>
              Health data is processed through machine learning algorithms to identify trends, detect anomalies, and provide recommendations. All AI processing is performed with your explicit consent and can be disabled at any time in your privacy settings.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>On-Device vs Cloud Processing</Text>
            <Text style={styles.paragraph}>
              Basic health trend analysis is performed on your device to protect privacy. More complex predictive modeling may be processed in secure cloud environments with end-to-end encryption. You can choose your preferred processing method in settings.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Algorithm Transparency</Text>
            <Text style={styles.paragraph}>
              Our AI models are trained on anonymized medical data and validated by healthcare professionals. The algorithms consider factors such as lab values, vital signs, medication adherence, and lifestyle factors to provide health insights.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Limitations & Accuracy</Text>
            <Text style={styles.paragraph}>
              AI predictions are based on statistical models and should not be considered definitive medical diagnoses. Accuracy rates vary by function, and all AI-generated insights are reviewed by medical professionals before implementation.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Human Oversight</Text>
            <Text style={styles.paragraph}>
              All AI-generated recommendations undergo human review by qualified healthcare professionals. Critical alerts are verified by medical staff before being delivered to users.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Continuous Improvement</Text>
            <Text style={styles.paragraph}>
              Our AI systems are continuously updated with new medical research and user feedback. Performance is regularly evaluated against clinical outcomes to ensure accuracy and safety.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>User Control</Text>
            <Text style={styles.paragraph}>
              You maintain full control over AI processing of your data. You can opt out of AI features at any time, and your data will not be used for AI training without explicit consent.
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

export default AITransparencyScreen;