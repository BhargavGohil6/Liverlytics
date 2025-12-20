import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface FlagItem {
  id: string;
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  source: string;
  sourceIcon: string;
  timestamp: string;
  backgroundColor: string;
}

const flagsData: FlagItem[] = [
  {
    id: '1',
    icon: 'heart-pulse',
    iconColor: '#EF4444',
    title: 'Elevated resting HR',
    description: 'Resting heart rate averaged 82 bpm, above typical baseline (72 bpm) over last 24h.',
    source: 'Vitals',
    sourceIcon: 'watch-variant',
    timestamp: 'Today • 07:40',
    backgroundColor: '#FEF2F2',
  },
  {
    id: '2',
    icon: 'beaker-outline',
    iconColor: '#3B82F6',
    title: 'Low sodium trend',
    description: 'Sodium values trending downward across last two lab reports (135 → 132 mmol/L).',
    source: 'Labs',
    sourceIcon: 'flask-outline',
    timestamp: 'Yesterday • 18:12',
    backgroundColor: '#EFF6FF',
  },
  {
    id: '3',
    icon: 'food-apple-outline',
    iconColor: '#F97316',
    title: 'High sodium intake',
    description: 'Daily sodium average exceeded target by 18% across the last 7 days.',
    source: 'Diet',
    sourceIcon: 'silverware-fork-knife',
    timestamp: 'May 10 • 20:30',
    backgroundColor: '#FFF7ED',
  },
  {
    id: '4',
    icon: 'pill',
    iconColor: '#8B5CF6',
    title: 'Missed evening dose',
    description: 'Medication adherence below 80% this week due to missed 20:00 dose.',
    source: 'Medications',
    sourceIcon: 'pill',
    timestamp: 'May 09 • 21:15',
    backgroundColor: '#F5F3FF',
  },
];

const ViewTimeline = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      {/* <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Icon name="trending-up" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.logoText}>Liverlytics</Text>
        </View>
      </View> */}

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#1F2937" />
          {/* <Text style={styles.backText}>Back</Text> */}
        </TouchableOpacity>
        {/* <Text style={styles.pageTitle}>Reports</Text> */}
      </View>

      {/* Separator Line */}
      <View style={styles.separator} />

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Flags Timeline Title */}
        <Text style={styles.timelineTitle}>Flags Timeline</Text>

        {/* Flag Cards */}
        {flagsData.map((flag) => (
          <View key={flag.id} style={styles.card}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={[styles.iconContainer, {backgroundColor: flag.backgroundColor}]}>
                  <Icon name={flag.icon} size={20} color={flag.iconColor} />
                </View>
                <Text style={styles.cardTitle}>{flag.title}</Text>
              </View>
              <Text style={styles.timestamp}>{flag.timestamp}</Text>
            </View>

            {/* Card Description */}
            <Text style={styles.cardDescription}>{flag.description}</Text>

            {/* Card Source */}
            <View style={styles.sourceContainer}>
              <Icon name={flag.sourceIcon} size={16} color="#6B7280" />
              <Text style={styles.sourceText}>Source: {flag.source}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 6,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginTop: hp('1%'),
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('3%'),
    paddingBottom: hp('4%'),
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: hp('2.5%'),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  timestamp: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
});

export default ViewTimeline;