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

const HomeScreen = ({ navigation }) => {
  const features = [
    {
      title: 'Exercise History',
      subtitle: 'Track steps, sleep & heart rate',
      icon: 'footsteps',
      color: '#52a64a',
      route: 'ExerciseHistory',
    },
    {
      title: 'Diet & Fluids',
      subtitle: 'Monitor sodium & fluid intake',
      icon: 'water',
      color: '#3b82f6',
      route: 'DietFluids',
    },
    {
      title: 'MELD Calculator',
      subtitle: 'Calculate MELD scores',
      icon: 'calculator',
      color: '#f59e0b',
      route: 'MELDHistory',
    },
    {
      title: 'Log Exercise',
      subtitle: 'Add activity data',
      icon: 'add-circle',
      color: '#8b5cf6',
      route: 'ExerciseActivity',
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
          <Text style={styles.subtitle}>
            Track your health metrics and monitor your progress
          </Text>

          <View style={styles.grid}>
            {features.map((feature, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => navigation.navigate(feature.route)}
              >
                <View style={[styles.iconCircle, { backgroundColor: feature.color }]}>
                  <Icon name={feature.icon} size={28} color="#fff" />
                </View>
                <Text style={styles.cardTitle}>{feature.title}</Text>
                <Text style={styles.cardSubtitle}>{feature.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.quickStats}>
            <Text style={styles.statsTitle}>Today's Summary</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Icon name="footsteps-outline" size={24} color="#52a64a" />
                <Text style={styles.statValue}>7,842</Text>
                <Text style={styles.statLabel}>Steps</Text>
              </View>
              <View style={styles.statCard}>
                <Icon name="heart-outline" size={24} color="#ef4444" />
                <Text style={styles.statValue}>68</Text>
                <Text style={styles.statLabel}>Heart Rate</Text>
              </View>
              <View style={styles.statCard}>
                <Icon name="moon-outline" size={24} color="#8b5cf6" />
                <Text style={styles.statValue}>8h 20m</Text>
                <Text style={styles.statLabel}>Sleep</Text>
              </View>
            </View>
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
    marginBottom: 24,
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
  quickStats: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default HomeScreen;