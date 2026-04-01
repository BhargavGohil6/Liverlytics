import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import CustomCheckbox from '../../components/CommonCheckbox';
import responsive from '../../theme/responsive';
import CommonButton from '../../components/CommonButton';
import AgreementScreen from './AgreementScreen';
import Toast from 'react-native-toast-message';
import HealthAccess from './HealthAccess';
import AIConsent from './AIConsent';
import HealthTargets from './HealthTargets';
import Allset from './Allset';
import BasicDetailsScreen from './BasicDetailsScreen';
import { useDispatch, useSelector } from 'react-redux';
import { submitAllConsents } from './slices/onboardingSlice';
import { setOnboardingCompleted } from '../auth/slices/authSlice';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Production use should import a full implementation of this.
const { width, height } = Dimensions.get('window');

// Import CommonPopup component
import CommonPopup from '../../components/CommonPopup';

// 2. Mock slidesData
const slides = [
  {
    id: '1',
    title: 'Tell us about you',
    content: 'BasicDetailsScreen',
    nextButtonText: 'Next',
  },
  {
    id: '2',
    title: 'Before You Begin',
    content: 'AgreementScreen',
    nextButtonText: 'Next',
  },
   {
    id: '3',
    title: 'AI Assistance Consent',
    content: 'AIConsent',
    nextButtonText: 'Next',
  },
  {
    id: '4',
    title: 'Set Your Goals',
    content: 'HealthTargets',
    nextButtonText: 'Next',
  },
  {
    id: '5',
    title: 'Health Data Permissions',
    content: 'HealthAccess',
    nextButtonText: 'Next',
  },
  {
    id: '6',
    title: 'Welcome!',
    content: 'Allset',
    nextButtonText: 'Go to Dashboard',
  },
];

// 6. Content Component Mapping
const contentComponents: { [key: string]: React.ComponentType } = {
  BasicDetailsScreen: BasicDetailsScreen,
  AgreementScreen: AgreementScreen,
  HealthAccess: HealthAccess,
  AIConsent: AIConsent,
  HealthTargets: HealthTargets,
  Allset: Allset,
};

// --- Main Component ---
export default function OnboardingSteps() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWearablePopup, setShowWearablePopup] = useState(false);
  const [hasRespondedToWearablePopup, setHasRespondedToWearablePopup] = useState(false); 
  const flatListRef = useRef<FlatList>(null);
  const dispatch = useDispatch();
  const { submitting, apiResponseStatus } = useSelector((state: any) => state.onboarding);
  const navigation = useNavigation<any>();

  const route = useRoute<any>();
  const startIndex = route?.params?.startIndex ?? 0;

  useEffect(() => {
    if (flatListRef.current && startIndex > 0) {
      flatListRef.current.scrollToIndex({ index: startIndex, animated: false });
      setCurrentIndex(startIndex);
    }
  }, [startIndex]);

  useEffect(() => {
    if (currentIndex === 4 && !showWearablePopup && !hasRespondedToWearablePopup) { 
      setShowWearablePopup(true);
    }
  }, [currentIndex, showWearablePopup, hasRespondedToWearablePopup]);

  const { privacyAccepted, termsAccepted, medicalAccepted, aiConsentOption } = useSelector(
    (state: any) => state.onboarding,
  );

  const allAgreementsAccepted =
    privacyAccepted && termsAccepted && medicalAccepted;
  
  const aiConsentSelected = aiConsentOption !== null && aiConsentOption !== undefined;

  const handleViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<any> }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const scrollToNext = () => {
    console.log('🔵 scrollToNext called, currentIndex:', currentIndex);
    
    if (currentIndex === 1 && !allAgreementsAccepted) {
      Toast.show({ type: 'error', text1: 'Please accept all agreements' });
      return;
    }
    
    if (currentIndex === 2 && !aiConsentSelected) {
      Toast.show({ type: 'error', text1: 'Please select an AI consent option' });
      return;
    }

    if (currentIndex < slides.length - 1) {
      // Show wearable popup at Step 4 before moving to Step 5
      if (currentIndex === 3 && !hasRespondedToWearablePopup) { 
        console.log('🔴 Showing wearable popup');
        setShowWearablePopup(true);
        // Don't scroll yet - wait for popup response
        return;
      }
      console.log('🟢 Scrolling to next index:', currentIndex + 1);
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Last slide - submit consents
      dispatch(submitAllConsents() as any)
        .unwrap()
        .then((response: any) => {
          console.log('📋 Response received in component:', response);
          console.log('📋 Response status:', response?.status);
          console.log('📋 Response overall_status:', response?.overall_status);
          console.log('📋 Response message:', response?.message);
          
          // Navigate to dashboard on success
          // Check multiple possible success indicators
          const isSuccess = 
            response?.status === 'success' || 
            response?.overall_status === 'success' ||
            (response?.message && !response?.error);
          
          if (isSuccess) {
            console.log('✅ Onboarding completed successfully!');
            dispatch(setOnboardingCompleted());
            console.log('🔄 Navigating to Dashboard...');
            console.log('Navigation methods available:', Object.keys(navigation));
            
            // Try navigate first, fallback to replace
            if (navigation.navigate) {
              console.log('Using navigation.navigate');
              navigation.navigate('Dashboard');
            } else if (navigation.replace) {
              console.log('Using navigation.replace');
              navigation.replace('Dashboard');
            }
            
            console.log('✅ Navigation command executed');
          } else {
            console.log('❌ API returned non-success status:', response);
            // Don't navigate - user needs to fix errors first
            Toast.show({
              type: 'error',
              text1: 'Please fix the errors',
              text2: response?.message || 'Some values need correction before proceeding.',
              visibilityTime: 5000,
            });
          }
        })
        .catch((error: any) => {
          console.error('❌ Submission error:', error);
          
          // Check if it's a validation error with specific message
          if (error?.status === 'fail' || error?.overall_status === 'error') {
            // Show detailed validation error
            Toast.show({
              type: 'error',
              text1: 'Validation Error',
              text2: error?.message || 'Please check your input values and try again.',
              visibilityTime: 6000,
              topOffset: 50,
            });
          } else {
            // Generic error
            Toast.show({
              type: 'error',
              text1: 'Submission failed',
              text2: error?.message || 'Please try again.',
              visibilityTime: 5000,
            });
          }
          
          // DO NOT navigate to dashboard on error - stay on this screen
          // User must fix the values and try again
        });
    }
  };

  const scrollToPrevious = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
    const currentSlide = slides[currentIndex];

    return (
      <View style={stepIndicatorStyles.container}>
        <Text style={stepIndicatorStyles.stepTitleText}>
          {currentSlide.title}
        </Text>
        <Text style={stepIndicatorStyles.stepText}>
          Step {currentStep} of {totalSteps}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    const ContentComponent = contentComponents[item.content as keyof typeof contentComponents];

    return (
      <View style={localStyles.slide}>
        <ContentComponent />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/Transparent 1.png')}
        style={styles.image}
      />

      <StepIndicator
        currentStep={currentIndex + 1}
        totalSteps={slides.length}
      />

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        scrollEnabled={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
        disableIntervalMomentum={true}
        style={localStyles.flatList}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onScrollToIndexFailed={info => {
          flatListRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: false,
          });
        }}
      />

      <View style={styles.navButtonContainer}>
        {currentIndex === 5 ? (
          <CommonButton
            onPress={scrollToNext}
            style={styles.fullWidthButton}
            title={slides[currentIndex].nextButtonText}
            disabled={submitting}
          />
        ) : currentIndex === 0 ? (
          <CommonButton
            onPress={scrollToNext}
            style={styles.fullWidthButton}
            title={slides[currentIndex].nextButtonText}
            disabled={submitting}
          />
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <TouchableOpacity
              onPress={scrollToPrevious}
              style={styles.navButton}
            >
              <Text style={styles.previousText}>Previous</Text>
            </TouchableOpacity>
            
            <CommonButton
              onPress={scrollToNext}
              style={styles.primaryNavButton}
              title={slides[currentIndex].nextButtonText}
              disabled={submitting}
            />
          </View>
        )}
      </View>
      <Text style={styles.disclaimer}>
        This app does NOT replace professional medical care.
      </Text>

      <CommonPopup
        visible={showWearablePopup}
        title="Connect Your Wearable"
        message="Connect your smartwatch to automatically sync your health data like steps, heart rate, sleep, oxygen, and blood pressure.This helps us give you accurate insights and personalized recommendations."
        showBottomButtons={true}
        bottomPrimaryButtonText="Yes"
        bottomSecondaryButtonText="Skip"
        onBottomPrimaryPress={() => {
          console.log('✅ Wearable popup YES clicked, currentIndex:', currentIndex);
          setShowWearablePopup(false);
          setHasRespondedToWearablePopup(true);
          // Scroll to next screen after popup is closed
          setTimeout(() => {
            console.log('🔄 Scrolling to index:', currentIndex + 1);
            if (flatListRef.current) {
              flatListRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
            }
          }, 100);
        }}
        onBottomSecondaryPress={() => {
          console.log('✅ Wearable popup SKIP clicked, currentIndex:', currentIndex);
          setShowWearablePopup(false);
          setHasRespondedToWearablePopup(true);
          // Scroll to next screen after popup is closed
          setTimeout(() => {
            console.log('🔄 Scrolling to index:', currentIndex + 1);
            if (flatListRef.current) {
              flatListRef.current.scrollToIndex({ index: currentIndex + 2, animated: true });
            }
          }, 100);
        }}
        onClose={() => {
          console.log('❌ Wearable popup CLOSED, currentIndex:', currentIndex);
          setShowWearablePopup(false);
          setHasRespondedToWearablePopup(true);
          // Scroll to next screen after popup is closed
          setTimeout(() => {
            console.log('🔄 Scrolling to index:', currentIndex + 1);
            if (flatListRef.current) {
              flatListRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
            }
          }, 100);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 0 : responsive.height(20),
  },
  // image: {
  //   width: responsive.width(160),
  //   height: responsive.height(48),
  //   alignSelf: 'center',
  //   marginTop: responsive.height(10),
  //   marginBottom: responsive.height(10),
  //   resizeMode: 'contain',
  // },
    image: {
    width: responsive.width(200),
    height: responsive.height(60),
    marginTop: responsive.margin(10),
    alignSelf: 'center'
  },
  disclaimer: {
    marginTop: responsive.height(15),
    fontSize: responsive.fontSize(12),
    color: '#A0AEC0',
    textAlign: 'center',
    paddingHorizontal: responsive.padding(20),
    marginBottom: responsive.height(10),
  },
  navButtonContainer: {
    width: '100%',
    paddingHorizontal: responsive.padding(25),
    paddingBottom: responsive.height(10),
    marginTop: responsive.height(10),
  },
  navButton: {
    width: responsive.width(140),
    padding: responsive.padding(12),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: responsive.borderRadius(12),
    alignItems: 'center',
    justifyContent: 'center',
    height: responsive.height(48),
    backgroundColor: '#FFFFFF',
  },
  primaryNavButton: {
    width: responsive.width(140),
    padding: responsive.padding(12),
    borderRadius: responsive.borderRadius(12),
    alignItems: 'center',
    justifyContent: 'center',
    height: responsive.height(48),
    backgroundColor: '#52ab3c', 
  },
  fullWidthButton: {
    width: '100%',
    height: responsive.height(52),
    borderRadius: responsive.borderRadius(14),
  },
  skipButton: {
    width: '100%',
    padding: responsive.padding(12),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: responsive.borderRadius(14),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: responsive.height(52),
  },
  skipButtonText: {
    fontSize: responsive.fontSize(16),
    color: '#4A5568',
    fontWeight: '600',
  },
  previousText: {
    fontSize: responsive.fontSize(16),
    color: '#4A5568',
    fontWeight: '500',
  }
});

const localStyles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
  slide: {
    width: wp('100%'),
    flex: 1,
    alignItems: 'center',
  },
});

const stepIndicatorStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: responsive.padding(5),
    marginBottom: responsive.padding(10),
  },
  stepTitleText: {
    fontSize: responsive.fontSize(24),
    fontWeight: '800',
    color: '#0F2740',
    marginBottom: responsive.padding(4),
  },
  stepText: {
    fontSize: responsive.fontSize(14),
    color: '#718096',
    fontWeight: '500',
  },
});
