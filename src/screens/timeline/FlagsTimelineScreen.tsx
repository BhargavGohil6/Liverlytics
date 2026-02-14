
// src/screens/FlagsTimelineScreen.tsx
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

const FlagsTimelineScreen = ({ navigation }) => {
  const flags = [
    {
      icon: 'heart-outline',
      title: 'Elevated resting HR',
      time: 'Today • 07:40',
      description: 'Resting heart rate averaged 82 bpm, above typical baseline (72 bpm) over last 24h.',
      source: 'Vitals',
    },
    {
      icon: 'analytics-outline',
      title: 'Low sodium trend',
      time: 'Yesterday • 18:12',
      description: 'Sodium values trending downward across last two lab reports (135 → 132 mmol/L).',
      source: 'Labs',
    },
    {
      icon: 'restaurant-outline',
      title: 'High sodium intake',
      time: 'May 10 • 20:30',
      description: 'Daily sodium average exceeded target by 18% across the last 7 days.',
      source: 'Diet',
    },
    // {
    //   icon: 'medkit-outline',
    //   title: 'Missed evening dose',
    //   time: 'May 09 • 21:15',
    //   description: 'Medication adherence below 80% this week due to missed 20:00 dose.',
    //   source: 'Medications',
    // },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Icon name="trending-up" size={24} color="#fff" />
            </View>
            <Text style={styles.logoText}>Liverlytics</Text>
          </View>
        </View>

        <View style={styles.titleSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Reports</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Flags Timeline</Text>

            {flags.map((flag, index) => (
              <View key={index} style={styles.flagCard}>
                <View style={styles.flagHeader}>
                  <Icon name={flag.icon} size={20} color="#374151" />
                  <View style={styles.flagInfo}>
                    <Text style={styles.flagTitle}>{flag.title}</Text>
                    <Text style={styles.flagTime}>{flag.time}</Text>
                  </View>
                </View>
                <Text style={styles.flagDescription}>{flag.description}</Text>
                <View style={styles.flagFooter}>
                  <Icon name="pulse-outline" size={14} color="#6b7280" />
                  <Text style={styles.flagSource}>Source: {flag.source}</Text>
                </View>
              </View>
            ))}
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
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  flagCard: {
    backgroundColor: '#f9fafb',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  flagHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  flagInfo: {
    flex: 1,
  },
  flagTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  flagTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  flagDescription: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 10,
  },
  flagFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flagSource: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default FlagsTimelineScreen;