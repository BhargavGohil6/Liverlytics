// / src/screens/ReportsScreen.tsx
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

const ReportsScreen = ({ navigation }) => {
  const reports = [
    {
      title: 'Exercise Report',
      description: 'View detailed exercise analytics',
      icon: 'bar-chart',
      color: '#52a64a',
      route: 'ExerciseHistory',
    },
    {
      title: 'MELD Trends',
      description: 'Track your MELD score history',
      icon: 'trending-up',
      color: '#f59e0b',
      route: 'MELDHistory',
    },
    {
      title: 'Diet Summary',
      description: 'Review sodium & fluid intake',
      icon: 'restaurant',
      color: '#3b82f6',
      route: 'DietFluids',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Reports</Text>
          <Text style={styles.subtitle}>View your health data analytics</Text>
        </View>

        <View style={styles.content}>
          {reports.map((report, index) => (
            <TouchableOpacity
              key={index}
              style={styles.reportCard}
              onPress={() => navigation.navigate(report.route)}
            >
              <View style={[styles.iconContainer, { backgroundColor: report.color }]}>
                <Icon name={report.icon} size={24} color="#fff" />
              </View>
              <View style={styles.reportContent}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportDescription}>{report.description}</Text>
              </View>
              <Icon name="chevron-forward" size={24} color="#9ca3af" />
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
  },
  content: {
    padding: 16,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  reportContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default ReportsScreen;