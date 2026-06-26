// src/screens/HomeScreen.tsx
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

const HomeScreen1 = ({ navigation }) => {
  const features = [
    {
      title: 'Medications',
      subtitle: 'Manage prescriptions',
      icon: 'medkit',
      color: '#8b5cf6',
      route: 'MedicationsList',
    },
    {
      title: 'Reports',
      subtitle: 'Health summaries',
      icon: 'document-text',
      color: '#3b82f6',
      route: 'Reports',
    },
    {
      title: 'Exercise',
      subtitle: 'Track activity',
      icon: 'footsteps',
      color: '#52a64a',
    },
    {
      title: 'Diet & Fluids',
      subtitle: 'Monitor intake',
      icon: 'water',
      color: '#f59e0b',
    },
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

        <View style={styles.content}>
          <Text style={styles.welcome}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Track your health metrics and stay on top of your medications</Text>

          <View style={styles.grid}>
            {features.map((feature, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => feature.route && navigation.navigate(feature.route)}
              >
                <View style={[styles.iconCircle, { backgroundColor: feature.color }]}>
                  <Icon name={feature.icon} size={28} color="#fff" />
                </View>
                <Text style={styles.cardTitle}>{feature.title}</Text>
                <Text style={styles.cardSubtitle}>{feature.subtitle}</Text>
              </TouchableOpacity>
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
  content: {
    padding: 16,
  },
  welcome: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default HomeScreen1;