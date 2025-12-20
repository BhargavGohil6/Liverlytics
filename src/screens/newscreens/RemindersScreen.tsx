// src/screens/RemindersScreen.tsx
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

const RemindersScreen = () => {
  const reminders = [
    { title: 'Take Morning Medication', time: '8:00 AM', active: true },
    { title: 'Log Exercise Data', time: '6:00 PM', active: true },
    { title: 'Evening Medication', time: '8:00 PM', active: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Reminders</Text>
          <Text style={styles.subtitle}>Manage your health reminders</Text>
        </View>

        <View style={styles.content}>
          {reminders.map((reminder, index) => (
            <View key={index} style={styles.reminderCard}>
              <View style={styles.reminderContent}>
                <Text style={styles.reminderTitle}>{reminder.title}</Text>
                <Text style={styles.reminderTime}>{reminder.time}</Text>
              </View>
              <View
                style={[
                  styles.toggle,
                  { backgroundColor: reminder.active ? '#52a64a' : '#d1d5db' },
                ]}
              >
                <View
                  style={[
                    styles.toggleCircle,
                    { marginLeft: reminder.active ? 20 : 2 },
                  ]}
                />
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addButton}>
            <Icon name="add-circle-outline" size={24} color="#52a64a" />
            <Text style={styles.addText}>Add New Reminder</Text>
          </TouchableOpacity>
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
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  reminderTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    padding: 2,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#52a64a',
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#52a64a',
    marginLeft: 8,
  },
});

export default RemindersScreen;