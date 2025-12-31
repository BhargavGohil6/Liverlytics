import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;
const scaleSize = size => (width / BASE_WIDTH) * size;
const verticalScaleSize = size => (height / BASE_HEIGHT) * size;
const responsiveFontSize = size => {
  const scaleFactor = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);
  return Math.round(size * scaleFactor);
};

const responsive = {
  width: size => scaleSize(size),
  height: size => verticalScaleSize(size),
  fontSize: size => responsiveFontSize(size),
  margin: size => scaleSize(size),
  padding: size => scaleSize(size),
  borderRadius: size => scaleSize(size),
};

const FeatureCard = ({ icon, title, description, status }) => (
  <View style={styles.featureCard}>
    <View style={styles.featureLeft}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
    <View style={styles.statusBadge}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  </View>
);

const ConnectionItem = ({ icon, label, value, badge }) => (
  <View style={styles.connectionItem}>
    <View style={styles.connectionLeft}>
      {icon}
      <Text style={styles.connectionLabel}>{label}</Text>
    </View>
    <View style={[styles.connectionBadge, badge === 'Healthy' && styles.healthyBadge]}>
      <Text style={[styles.connectionBadgeText, badge === 'Healthy' && styles.healthyBadgeText]}>
        {value}
      </Text>
    </View>
  </View>
);

const TipItem = ({ text }) => (
  <View style={styles.tipItem}>
    <View style={styles.tipBullet} />
    <Text style={styles.tipText}>{text}</Text>
  </View>
);

const SyncCompleteScreen = () => {
    const navigation = useNavigation();
    
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
          <Icon name="arrow-back" size={responsive.fontSize(24)} color="#333" />
          {/* <Text style={styles.backText}>Back</Text> */}
        </TouchableOpacity>

        {/* Success Icon */}
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Icon name="checkmark" size={responsive.fontSize(48)} color="#FFF" />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Sync Complete <Icon name="checkmark" size={responsive.fontSize(28)} color="#333" />
        </Text>
        <Text style={styles.subtitle}>
          Your smartwatch is connected. Step count, heart rate, and alerts will now update automatically.
        </Text>

        {/* What's now enabled Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcon name="star-four-points" size={responsive.fontSize(20)} color="#333" />
            <Text style={styles.sectionTitle}>What's now enabled</Text>
          </View>

          <View style={styles.featuresList}>
            <FeatureCard
              icon={<MaterialCommunityIcon name="walk" size={responsive.fontSize(24)} color="#666" />}
              title="Live Step Count"
              description="Daily steps sync throughout the day for activity trends."
              status="On"
            />
            <FeatureCard
              icon={<Icon name="heart-outline" size={responsive.fontSize(24)} color="#666" />}
              title="Heart Rate Tracking"
              description="Resting and active heart rate captured for insights."
              status="On"
            />
            <FeatureCard
              icon={<Icon name="moon-outline" size={responsive.fontSize(24)} color="#666" />}
              title="Sleep Sync"
              description="Nightly sleep sessions update after you wake up."
              status="On"
            />
          </View>
        </View>

        {/* Connection Status Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcon name="signal-variant" size={responsive.fontSize(20)} color="#333" />
            <Text style={styles.sectionTitle}>Connection Status</Text>
          </View>

          <View style={styles.connectionList}>
            <ConnectionItem
              icon={<Icon name="bluetooth" size={responsive.fontSize(20)} color="#333" />}
              label="Connected"
              value="Healthy"
              badge="Healthy"
            />
            <ConnectionItem
              icon={<Icon name="time-outline" size={responsive.fontSize(20)} color="#333" />}
              label="Last sync"
              value="Just now"
              badge="Just now"
            />
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="bulb-outline" size={responsive.fontSize(20)} color="#333" />
            <Text style={styles.sectionTitle}>Tips</Text>
          </View>

          <View style={styles.tipsList}>
            <TipItem text="Keep Bluetooth on and your watch nearby for continuous updates." />
            <TipItem text="Open your watch's companion app once a day to ensure background sync." />
            <TipItem text="Health alerts appear on your dashboard if readings need attention." />
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.nextButton}  onPress={() => navigation.navigate('OnboardingSteps', { startIndex: 2 })}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.stayButton}>
          <Text style={styles.stayButtonText}>Stay on this page</Text>
        </TouchableOpacity>

       
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsive.padding(16),
    paddingVertical: responsive.padding(16),
  },
  backText: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: '#333',
    marginLeft: responsive.margin(8),
  },
  successContainer: {
    alignItems: 'center',
    marginVertical: responsive.margin(24),
  },
  successIcon: {
    width: responsive.width(100),
    height: responsive.height(100),
    borderRadius: responsive.borderRadius(20),
    backgroundColor: '#52ab3c',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#52ab3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: responsive.fontSize(28),
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: responsive.padding(16),
    marginBottom: responsive.margin(12),
  },
  subtitle: {
    fontSize: responsive.fontSize(14),
    color: '#666',
    textAlign: 'center',
    lineHeight: responsive.height(20),
    paddingHorizontal: responsive.padding(32),
    marginBottom: responsive.margin(32),
  },
  section: {
    backgroundColor: '#FFF',
    marginHorizontal: responsive.margin(16),
    marginBottom: responsive.margin(16),
    borderRadius: responsive.borderRadius(12),
    padding: responsive.padding(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.margin(16),
  },
  sectionTitle: {
    fontSize: responsive.fontSize(16),
    fontWeight: '700',
    color: '#333',
    marginLeft: responsive.margin(8),
  },
  featuresList: {
    gap: responsive.height(12),
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    padding: responsive.padding(14),
    borderRadius: responsive.borderRadius(10),
  },
  featureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: responsive.margin(12),
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: responsive.fontSize(15),
    fontWeight: '700',
    color: '#333',
    marginBottom: responsive.margin(4),
  },
  featureDescription: {
    fontSize: responsive.fontSize(12),
    color: '#666',
    lineHeight: responsive.height(16),
  },
  statusBadge: {
    backgroundColor: '#52ab3c',
    paddingHorizontal: responsive.padding(12),
    paddingVertical: responsive.padding(6),
    borderRadius: responsive.borderRadius(12),
  },
  statusText: {
    fontSize: responsive.fontSize(12),
    fontWeight: '700',
    color: '#FFF',
  },
  connectionList: {
    gap: responsive.height(12),
  },
  connectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    padding: responsive.padding(14),
    borderRadius: responsive.borderRadius(10),
  },
  connectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionLabel: {
    fontSize: responsive.fontSize(15),
    fontWeight: '600',
    color: '#333',
    marginLeft: responsive.margin(10),
  },
  connectionBadge: {
    backgroundColor: '#333',
    paddingHorizontal: responsive.padding(12),
    paddingVertical: responsive.padding(6),
    borderRadius: responsive.borderRadius(12),
  },
  healthyBadge: {
    backgroundColor: '#52ab3c',
  },
  connectionBadgeText: {
    fontSize: responsive.fontSize(12),
    fontWeight: '700',
    color: '#FFF',
  },
  healthyBadgeText: {
    color: '#FFF',
  },
  tipsList: {
    gap: responsive.height(12),
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    width: responsive.width(6),
    height: responsive.height(6),
    borderRadius: responsive.borderRadius(3),
    backgroundColor: '#666',
    marginTop: responsive.margin(6),
    marginRight: responsive.margin(10),
  },
  tipText: {
    flex: 1,
    fontSize: responsive.fontSize(14),
    color: '#333',
    lineHeight: responsive.height(20),
  },
  nextButton: {
    backgroundColor: '#52ab3c',
    marginHorizontal: responsive.margin(16),
    marginTop: responsive.margin(24),
    paddingVertical: responsive.padding(16),
    borderRadius: responsive.borderRadius(10),
    alignItems: 'center',
    shadowColor: '#52ab3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  nextButtonText: {
    fontSize: responsive.fontSize(16),
    fontWeight: '700',
    color: '#FFF',
  },
  stayButton: {
    backgroundColor: '#FFF',
    marginHorizontal: responsive.margin(16),
    marginTop: responsive.margin(12),
    marginBottom: responsive.margin(32),
    paddingVertical: responsive.padding(16),
    borderRadius: responsive.borderRadius(10),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  stayButtonText: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: '#333',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: responsive.padding(12),
    paddingBottom: responsive.padding(24),
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    fontSize: responsive.fontSize(11),
    color: '#999',
    marginTop: responsive.margin(4),
  },
});

export default SyncCompleteScreen;