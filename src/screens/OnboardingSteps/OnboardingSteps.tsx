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
import { useDispatch, useSelector } from 'react-redux';
import { submitAllConsents } from './slices/onboardingSlice';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { logout } from '../auth/slices/authSlice';
import { useRoute } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Production use should import a full implementation of this.
const { width, height } = Dimensions.get('window');

// 2. Mock slidesData
const slides = [
  {
    id: '1',
    title: 'Before You Begin',
    content: 'AgreementScreen',
    nextButtonText: 'Next',
  },
  {
    id: '2',
    title: 'Health Data Permissions',
    content: 'HealthAccess',
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
    title: 'Welcome!',
    content: 'Allset',
    nextButtonText: 'Go to Dashboard',
  },
];



// 6. Content Component Mapping
const contentComponents = {
  AgreementScreen: AgreementScreen,
  HealthAccess: HealthAccess,
  AIConsent: AIConsent,
  HealthTargets: HealthTargets,
  Allset: Allset,
};

// --- Main Component ---
export default function OnboardingSteps() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const dispatch = useDispatch();
  const { submitting } = useSelector((state: any) => state.onboarding);
  const submitting1 = useSelector((state: any) =>
    console.log('submitting', state),
  );
  const navigation = useNavigation<any>();

  const route = useRoute();
  const startIndex = route?.params?.startIndex ?? 0;

  useEffect(() => {
    if (flatListRef.current && startIndex > 0) {
      flatListRef.current.scrollToIndex({ index: startIndex, animated: false });
      setCurrentIndex(startIndex);
    }
  }, [startIndex]);
  // Redux Agreement status
  const { privacyAccepted, termsAccepted, medicalAccepted, aiConsentOption } = useSelector(
    (state: any) => state.onboarding,
  );

  const allAgreementsAccepted =
    privacyAccepted && termsAccepted && medicalAccepted;
  
  const aiConsentSelected = aiConsentOption !== null && aiConsentOption !== undefined;

  // FlatList viewability logic
  const handleViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<any> }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // Next button click handler
  // const scrollToNext = () => {
  //   if (currentIndex === 0 && !allAgreementsAccepted) {
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Agreement Required',
  //       text2: 'Please accept all terms and conditions to continue.',
  //       position: 'Top',

  //     });
  //     return;
  //   }
  //   if (currentIndex < slides.length - 1) {
  //     flatListRef.current.scrollToIndex({
  //       index: currentIndex + 1,
  //       animated: true,
  //     });
  //   } else {
  //     console.log('Onboarding Finished! Navigating to Home...');
  //     // navigation.navigate('Home'); // Replace with actual navigation logic
  //   }
  // };

  const scrollToNext = () => {
    if (currentIndex === 0 && !allAgreementsAccepted) {
      Toast.show({ type: 'error', text1: 'Please accept all agreements' });
      return;
    }
    
    // Check if we're on the AI consent screen (index 2) and user hasn't selected an option
    if (currentIndex === 2 && !aiConsentSelected) {
      Toast.show({ type: 'error', text1: 'Please select an AI consent option' });
      return;
    }

    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // LAST SCREEN → API CALL VIA REDUX
      // dispatch(submitAllConsents()).then((action) => {
      //   console.log('Onboarding Finished! Navigating to Home...', action);
      //   if (action.meta.requestStatus === 'fulfilled') {
      //     navigation.replace('Dashboard');
      //   }
      // });
      //   dispatch(submitAllConsents())
      // .unwrap() // ← Yeh important hai
      // .then(() => {
      navigation.replace('Dashboard');
      // })
      // .catch((error) => {
      //   Toast.show({
      //     type: 'error',
      //     text1: 'Submission failed',
      //     text2: error?.message || 'Please try again',
      //   });
      // });
    }
  };

  const scrollToPrevious = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  // Step Indicator Component (moved inside to be self-contained)
  const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
    const currentSlide = slides[currentIndex];

    return (
      <View style={stepIndicatorStyles.container}>
        {/* Dynamically get the title from the slide data */}
        <Text style={stepIndicatorStyles.stepTitleText}>
          {currentSlide.title}
        </Text>
        {/* <Text style={stepIndicatorStyles.stepText}>
          Step {currentStep} of {totalSteps}
        </Text> */}
        {/* <View style={stepIndicatorStyles.dotsContainer}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              style={[
                stepIndicatorStyles.dot,
                {
                  backgroundColor:
                    index === currentStep - 1 ? '#4CAF50' : '#D0D0D0', // Only current step is green
                  width:
                    index === currentStep - 1
                      ? responsive.width(16)
                      : responsive.width(8), // Make current dot longer
                },
              ]}
            />
          ))}
        </View> */}
      </View>
    );
  };

  // FlatList Item Renderer
  const renderItem = ({ item }: { item: any }) => {
    const ContentComponent = contentComponents[item.content];

    return (
      <View style={localStyles.slide}>
        <ContentComponent />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header (Logo) */}
      <Image
        source={require('../../assets/Transparent 1.png')}
        style={styles.image}
      />

      {/* Step Indicator (Steps 1 to 5) */}
      <StepIndicator
        currentStep={currentIndex + 1}
        totalSteps={slides.length}
      />

      {/* Main Content (Changes on Next click) */}
      {/* <FlatList
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
        style={localStyles.flatList} // Use localStyles for FlatList
      /> */}

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

      {/* Next Button and Disclaimer */}
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          marginTop: 20,
          paddingHorizontal: 20,
        }}
      >
        {currentIndex === 4 ? ( // On the Allset screen (index 4), show only the next button centered
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
              width: responsive.width(300),
              gap: 20,
            }}
          >
            {currentIndex > 0 ? (
              <TouchableOpacity
                onPress={scrollToPrevious}
                style={styles.navButton}
              >
                <Text style={{ fontSize: 16, color: '#333' }}>Previous</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: responsive.width(150) }} /> // align fix for first screen
            )}
            <CommonButton
              onPress={scrollToNext}
              style={styles.navButton}
              title={slides[currentIndex].nextButtonText}
              disabled={submitting}
            />
          </View>
        )}
      </View>
      <Text style={styles.disclaimer}>
        This app does NOT replace professional medical care.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: responsive.padding(20),
    backgroundColor: 'white',
    marginTop: '10%',
    // width: responsive.width(400),
  },
  tital: {
    fontSize: responsive.fontSize(22),
    color: '#0F2740',
  },
  disclaimer: {
    marginTop: responsive.height(15),
    fontSize: responsive.fontSize(12),
    color: '#777',
    textAlign: 'center',
  },
  button: {
    width: responsive.width(150),
    alignSelf: 'center',
    height: responsive.height(40),
  },
  navButton: {
    width: responsive.width(150),
    padding: 12,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: responsive.height(40),
  },
  fullWidthButton: {
    width: '85%', // Make it full width but with some margin
    alignSelf: 'center',
    marginHorizontal: '7.5%', // Center the button with equal margins
  },
  image: {
    width: responsive.width(200),
    height: responsive.height(60),
    marginTop: responsive.margin(10),
  },
});

const localStyles = StyleSheet.create({
  flatList: {
    flex: 1,
    // The FlatList must manage the scrolling space
  },
  slide: {
    // width: Dimensions.get('window').width, // Full width for Paging
    // width: Platform.OS === 'ios' ? Dimensions.get('screen').width : Dimensions.get('screen').width,
    width: wp('100%'),

    flex: 1,
    // marginHorizontal: responsive.margin(20),
    // marginHorizontal: responsive.margin(120),
    alignItems: 'center',
    // justifyContent:'center',
    // alignSelf: 'center',
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentTitle: {
    fontSize: responsive.fontSize(20),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: responsive.width(200),
    height: responsive.height(100),
  },
});

const headerStyles = StyleSheet.create({
  container: {
    paddingHorizontal: responsive.padding(20),
    paddingVertical: responsive.padding(10),
    alignItems: 'center',
  },
  logoText: {
    fontSize: responsive.fontSize(28),
    fontWeight: '900',
    color: '#4CAF50', // Liverlytics Green
    // For a better look, you might use a custom font or icon here
  },
});

const stepIndicatorStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: responsive.padding(10),
    marginBottom: responsive.padding(15),
  },
  stepTitleText: {
    fontSize: responsive.fontSize(22),
    fontWeight: 'bold',
    color: '#0F2740',
    marginBottom: responsive.padding(5),
  },
  stepText: {
    fontSize: responsive.fontSize(16),
    color: '#555',
    marginBottom: responsive.padding(10),
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: responsive.padding(5),
    alignItems: 'center',
  },
  dot: {
    height: responsive.height(8),
    borderRadius: responsive.width(4),
    marginHorizontal: responsive.width(4),
    transitionProperty: 'width',
    transitionDuration: '0.3s',
  },
});
