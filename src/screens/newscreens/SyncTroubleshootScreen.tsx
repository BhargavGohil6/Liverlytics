// src/screens/SyncTroubleshootScreen.tsx
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

const SyncTroubleshootScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>Having Trouble Connecting Your Smartwatch?</Text>
          <Text style={styles.subtitle}>
            Follow these steps to sync your steps, heart rate, and sleep.
          </Text>
        </View>

        <TouchableOpacity style={styles.diagnosticButton}>
          <Icon name="search-outline" size={20} color="#52a64a" />
          <Text style={styles.diagnosticText}>Quick Diagnosis</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="close-circle" size={20} color="#ef4444" />
            <Text style={styles.sectionTitle}>Watch Not Paired</Text>
          </View>
          <Text style={styles.sectionContent}>
            Bluetooth pairing or companion app not set.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.sectionTitle}>Permissi Granted</Text>
          </View>
          <Text style={styles.sectionContent}>Health data set.</Text>
        </View>

        <View style={styles.troubleshootSection}>
          <View style={styles.troubleshootHeader}>
            <Icon name="sync-outline" size={20} color="#333" />
            <Text style={styles.troubleshootTitle}>Check Pairing (All Watches)</Text>
          </View>
          <Text style={styles.troubleshootContent}>
            Ensure your smartwatch is paired with your phone via companion app.
          </Text>
          <Text style={styles.instruction}>
            Open the watch app (Apple Watch app / Galaxy Wearable / Fitbit / Garmin Connect):
          </Text>
          <View style={styles.checkList}>
            <View style={styles.checkItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.checkText}>Verify:</Text>
            </View>
            <View style={styles.subCheck}>
              <Text style={styles.subBullet}>◦</Text>
              <Text style={styles.subText}>Sleep tracking: ON</Text>
            </View>
            <View style={styles.subCheck}>
              <Text style={styles.subBullet}>◦</Text>
              <Text style={styles.subText}>Heart rate: ON</Text>
            </View>
            <View style={styles.subCheck}>
              <Text style={styles.subBullet}>◦</Text>
              <Text style={styles.subText}>Sleep tracking: ON</Text>
            </View>
            <View style={styles.checkItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.checkText}>
                Restart the watch & phone if sync still fails.
              </Text>
            </View>
            <View style={styles.checkItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.checkText}>
                Make sure Battery Saver is OFF inside the watch.
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('SyncComplete')}
        >
          <Icon name="sync-outline" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Check pairing again</Text>
        </TouchableOpacity>

        <View style={styles.moreOptions}>
          <Text style={styles.moreTitle}>More troubleshooting options:</Text>
          <TouchableOpacity style={styles.optionItem}>
            <Icon name="shield-checkmark-outline" size={20} color="#333" />
            <Text style={styles.optionText}>Health Permissions Not Granted</Text>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <Icon name="watch-outline" size={20} color="#333" />
            <Text style={styles.optionText}>Supported Smartwatches</Text>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <Icon name="flask-outline" size={20} color="#333" />
            <Text style={styles.optionText}>Sync Testing Tools</Text>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <Icon name="help-circle-outline" size={20} color="#333" />
            <Text style={styles.optionText}>Still Need Help?</Text>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.manualSection}>
          <Text style={styles.manualTitle}>Use Manual Tracking Instead</Text>
          <TouchableOpacity style={styles.retryButton}>
            <Icon name="refresh-outline" size={20} color="#fff" />
            <Text style={styles.retryButtonText}>Retry Smartwatch Sync</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton}>
            <Text style={styles.skipButtonText}>Skip for Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
  },
  titleSection: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  diagnosticButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
  },
  diagnosticText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#52a64a',
    marginLeft: 12,
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#666',
    marginLeft: 28,
  },
  troubleshootSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  troubleshootHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  troubleshootTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  troubleshootContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  instruction: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    fontWeight: '500',
  },
  checkList: {
    marginLeft: 8,
  },
  checkItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  checkText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  subCheck: {
    flexDirection: 'row',
    marginLeft: 16,
    marginBottom: 4,
  },
  subBullet: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  subText: {
    fontSize: 13,
    color: '#666',
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#52a64a',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  moreOptions: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 16,
  },
  moreTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
  },
  manualSection: {
    padding: 16,
    marginTop: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  manualTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  retryButton: {
    flexDirection: 'row',
    backgroundColor: '#52a64a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  skipButton: {
    padding: 12,
  },
  skipButtonText: {
    fontSize: 15,
    color: '#52a64a',
    fontWeight: '500',
  },
});

export default SyncTroubleshootScreen;