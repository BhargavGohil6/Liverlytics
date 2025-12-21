import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';

// Note: Install react-native-vector-icons or use expo icons
// npm install react-native-vector-icons
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { clearVitalsState } from './slices/vitalsSlice';
import {colors, font} from '../../theme/index';
import responsive from '../../theme/responsive';
import CommonButton from '../../components/CommonButton';

export default function VitalsSavedSuccessScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // Animation for success icon
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      {/* <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Icon name="trending-up" size={20} color="#fff" />
          </View>
          <Text style={styles.logoText}>Liverlytics</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.todayButton}>
            <Text style={styles.todayText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bellIcon}>
            <Icon name="bell" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View> */}

      {/* Content */}
      <View style={styles.content}>
        {/* Success Icon with Rings */}
        <Animated.View 
          style={[
            styles.successContainer,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Outer Ring */}
          <View style={styles.outerRing} />
          
          {/* Middle Ring */}
          <View style={styles.middleRing} />
          
          {/* Inner Ring */}
          <View style={styles.innerRing} />
          
          {/* Check Icon */}
          <View style={styles.checkCircle}>
            <Icon name="check" size={36} color="#fff" strokeWidth={3} />
          </View>
        </Animated.View>

        {/* Success Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.successTitle}>Vitals Saved Successfully</Text>
          <Text style={styles.successSubtitle}>
            Your vitals have been recorded and synced with your health timeline.
          </Text>
          <Text style={styles.aiNote}>
            AI will check for unusual trends if enabled.
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <CommonButton 
          title="Add More Vitals" 
          onPress={() => {
            dispatch(clearVitalsState());
            navigation.navigate('AddVitalsScreen');
          }}
          bgColor={colors.primary}
          textColor={colors.white}
          paddingVertical={responsive.padding(16)}
          fontSize={font.lg}
          radius={responsive.borderRadius(12)}
          marginBottom={responsive.margin(12)}
        />
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={()=>navigation.navigate('Dashboard')}
        >
          <Text style={styles.secondaryButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>

     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsive.padding(16),
    paddingVertical: responsive.padding(12),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: responsive.width(32),
    height: responsive.height(32),
    borderRadius: responsive.borderRadius(6),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsive.margin(8),
  },
  logoText: {
    fontSize: font.xl,
    fontWeight: '700',
    color: colors.darkGray,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsive.width(12),
  },
  todayButton: {
    paddingHorizontal: responsive.padding(12),
    paddingVertical: responsive.padding(6),
    backgroundColor: colors.gray100,
    borderRadius: responsive.borderRadius(6),
  },
  todayText: {
    fontSize: font.base,
    color: colors.darkGray,
    fontWeight: '500',
  },
  bellIcon: {
    padding: responsive.padding(4),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: responsive.padding(32),
  },
  successContainer: {
    width: responsive.width(180),
    height: responsive.height(180),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsive.margin(40),
  },
  outerRing: {
    position: 'absolute',
    width: responsive.width(180),
    height: responsive.height(180),
    borderRadius: responsive.borderRadius(90),
    borderWidth: 1.5,
    borderColor: colors.mintMist,
  },
  middleRing: {
    position: 'absolute',
    width: responsive.width(140),
    height: responsive.height(140),
    borderRadius: responsive.borderRadius(70),
    borderWidth: 1.5,
    borderColor: colors.mintMist,
  },
  innerRing: {
    position: 'absolute',
    width: responsive.width(100),
    height: responsive.height(100),
    borderRadius: responsive.borderRadius(50),
    borderWidth: 1.5,
    borderColor: colors.mintMist,
  },
  checkCircle: {
    width: responsive.width(76),
    height: responsive.height(76),
    borderRadius: responsive.borderRadius(38),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  messageContainer: {
    alignItems: 'center',
  },
  successTitle: {
    fontSize: font.h6,
    fontWeight: '700',
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: responsive.margin(12),
  },
  successSubtitle: {
    fontSize: font.base,
    color: colors.gray666,
    textAlign: 'center',
    lineHeight: responsive.height(20),
    marginBottom: responsive.margin(16),
  },
  aiNote: {
    fontSize: font.sm,
    color: colors.lightGray,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: responsive.padding(16),
    paddingBottom: responsive.padding(24),
  },
  backButton: {
    backgroundColor: colors.primary,
    borderRadius: responsive.borderRadius(12),
    paddingVertical: responsive.padding(16),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  backButtonText: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.white,
  },
  secondaryButton: {
    paddingVertical: responsive.padding(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: font.base,
    fontWeight: '500',
    color: colors.gray666,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingVertical: responsive.padding(8),
    paddingBottom: responsive.padding(4),
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: responsive.padding(8),
  },
  navText: {
    fontSize: font.xs,
    color: colors.lightGray,
    marginTop: responsive.margin(4),
    fontWeight: '500',
  },
});