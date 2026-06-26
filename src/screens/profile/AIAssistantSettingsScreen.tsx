import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { saveAISettings } from './slices/profileSlice';
import Toast from 'react-native-toast-message';

type AIAssistantSettingsScreenProps = {
  navigation: any;
};

const AIAssistantSettingsScreen: React.FC<AIAssistantSettingsScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { userProfile } = useSelector((state: RootState) => state.profile);
  const { aiSettingsLoading, aiSettingsError } = useSelector(
    (state: RootState) => state.profile
  );

  const [selectedOption, setSelectedOption] = useState<
    'use_ai_recommended' | 'use_ai_with_cloud' | 'do_not_use_ai'
  >('use_ai_recommended');

  // Set selected option from user profile's ai_consent_profile
  useEffect(() => {
    console.log('AI Settings - userProfile:', userProfile);
    console.log('AI Settings - ai_consent_profile:', userProfile?.ai_consent_profile);
    
    if (userProfile?.ai_consent_profile) {
      const validOptions: Array<'use_ai_recommended' | 'use_ai_with_cloud' | 'do_not_use_ai'> = [
        'use_ai_recommended',
        'use_ai_with_cloud',
        'do_not_use_ai',
      ];
      
      if (validOptions.includes(userProfile.ai_consent_profile)) {
        console.log('Setting selected option to:', userProfile.ai_consent_profile);
        setSelectedOption(userProfile.ai_consent_profile);
      }
    }
  }, [userProfile]);

  const handleSave = () => {
    if (!user?.email) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'User email not found',
      });
      return;
    }

    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    dispatch(
      saveAISettings({
        email: user.email,
        ai_setting: selectedOption,
        date: today,
      }) as any
    )
      .unwrap()
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'AI settings saved successfully',
        });
        // Navigate back after successful save
        navigation.goBack();
      })
      .catch((error: any) => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error || 'Failed to save AI settings',
        });
      });
  };

  const options = [
    {
      id: 'use_ai_recommended',
      title: 'Use AI (On-Device Only)',
      description: 'AI processing happens locally on your device for maximum privacy.',
      icon: 'phone-portrait-outline',
    },
    {
      id: 'use_ai_with_cloud',
      title: 'Use AI with Cloud Support (OpenAI)',
      description: 'Send selected lab reports, extracted text, lab values, and related health information to OpenAI, our third-party AI provider, for MELD calculations and health insights. You will still be asked to agree before each lab report upload.',
      icon: 'cloud-outline',
    },
    {
      id: 'do_not_use_ai',
      title: 'Do Not Use AI Features',
      description: 'Disable all AI-powered features and recommendations.',
      icon: 'close-circle-outline',
    },
  ];

  if (aiSettingsLoading && !userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#52ab3c" />
          <Text style={styles.loadingText}>Loading AI settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Assistant Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.descriptionCard}>
          <Icon name="information-circle-outline" size={24} color="#52ab3c" />
          <Text style={styles.descriptionText}>
            AI helps interpret your vitals and lab reports. Processing happens on-device for
            privacy unless you choose cloud support with OpenAI. OpenAI processing is optional
            and requires your permission before lab report uploads.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Choose AI Processing Mode</Text>

        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              selectedOption === option.id && styles.optionCardSelected,
            ]}
            onPress={() => setSelectedOption(option.id as any)}
          >
            <View
              style={[
                styles.radioButton,
                selectedOption === option.id && styles.radioButtonSelected,
              ]}
            >
              {selectedOption === option.id && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
            {/* <Icon
              name={option.icon}
              size={28}
              color={selectedOption === option.id ? '#52ab3c' : '#9ca3af'}
              style={styles.optionIcon}
            /> */}
            <View style={styles.optionContent}>
              <Text
                style={[
                  styles.optionTitle,
                  selectedOption === option.id && styles.optionTitleSelected,
                ]}
              >
                {option.title}
              </Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          {aiSettingsLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Icon name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Save Settings</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          You can change these settings at any time. Changes will take effect immediately.
        </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  descriptionCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  descriptionText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  optionCardSelected: {
    borderColor: '#52ab3c',
    backgroundColor: '#f0fdf4',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  radioButtonSelected: {
    borderColor: '#52ab3c',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#52ab3c',
  },
  optionIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  optionTitleSelected: {
    color: '#52ab3c',
  },
  optionDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#52ab3c',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 16,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  footerNote: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default AIAssistantSettingsScreen;
