import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import responsive from '../../theme/responsive';
import {
  CoolGray,
  PRIMARY_COLOR,
  Navyblue,
  BlueishGray,
} from '../../theme/color';
import { setAIConsentOption } from './slices/onboardingSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import axios from 'axios';
import RadioButton from 'react-native-radio-buttons-group';

const AIConsent = () => {
  const dispatch = useDispatch();
  const selectedOption = useSelector(
    (state: RootState) => state.onboarding.aiConsentOption,
  );
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAIConsentData();
  }, []);

  const fetchAIConsentData = async () => {
    try {
      const response = await axios.get(
        'https://cirrhosis.mukesoft.com/api/method/cirrhosis_custom.cirrhosis_ai_assistant_settings.get_ai_assistant_settings',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'token 72b96de8ae8c469:96b6b5699febb74',
          },
        },
      );

      if (response.data.message.status === 'success') {
        setData(response.data.message);
      }
    } catch (error: any) {
      // Alert.alert('Error', 'Failed to load AI consent settings.');
      console.error(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const radioButtons = [
    {
      id: 'on_device',
      label: data?.option_1 || 'Use AI (On-Device Only)',
      description: data?.option_1_description,
      selected: selectedOption === 'on_device',
    },
    {
      id: 'cloud_support',
      label: 'Use AI with Cloud Support (OpenAI)',
      description:
        data?.option_2_description ||
        'Send selected lab reports, extracted lab values, and related health information to OpenAI, our third-party AI provider, for MELD calculations and health insights.',
      selected: selectedOption === 'cloud_support',
    },
    {
      id: 'no_ai',
      label: data?.option_3 || 'Do Not Use AI Features',
      description: data?.option_3_description,
      selected: selectedOption === 'no_ai',
    },
  ];

  const handleSelect = (id: string) => {
    console.log(id);
    dispatch(setAIConsentOption(id as any));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.headingContainer}>
        {/* <Text style={styles.heading}>AI Assistance Consent</Text> */}
        <Text style={styles.description}>
          AI helps interpret your vitals and lab reports. Processing happens
          on-device for privacy unless you choose cloud support with OpenAI.
          OpenAI processing is optional and requires your permission.
        </Text>
      </View>
     
      <RadioButton
        radioButtons={radioButtons.map(btn => ({
          id: btn.id,
          label: (
            <View style={styles.radioLabelContainer}>
              <Text style={styles.radioTitle}>{btn.label}</Text>
              {btn.description && (
                <Text style={styles.radioDescription}>{btn.description}</Text>
              )}
            </View>
          ),
          value: btn.id,
          selected: selectedOption === btn.id,
          layout: 'column',
          containerStyle: styles.radioContainer,
          onPress: handleSelect,
          color: PRIMARY_COLOR,
        }))}
        selectedId={selectedOption || undefined}
        onPress={handleSelect}
        layout="column"
      />
      {selectedOption === 'cloud_support' && (
        <View style={styles.cloudNoteContainer}>
          <Text style={styles.cloudNoteTitle}>Cloud AI Consent</Text>
          <Text style={styles.cloudNoteText}>
            When you choose cloud support, selected lab reports, extracted text,
            lab values, and related health information may be shared with OpenAI,
            our third-party AI provider, to extract lab values, calculate MELD
            scores, and generate health insights. You will still be asked to
            agree before each lab report upload.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default AIConsent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'row',
    padding: responsive.padding(12),
    borderWidth: 1,
    borderColor: CoolGray,
    borderRadius: responsive.borderRadius(10),
    justifyContent: 'center',
    marginVertical: responsive.margin(10),
    alignItems: 'center',
    width:responsive.width(320),
    //  paddingHorizontal: responsive.padding(16),
    marginHorizontal: responsive.margin(16),
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: responsive.padding(24),
  },
  heading: {
    fontSize: responsive.fontSize(24),
    fontWeight: '700',
    // marginBottom: 20,
    color: Navyblue,
  },
  description: {
    fontSize: responsive.fontSize(13),
    color: BlueishGray,
    // width:responsive.width(330),
  },
  title: {
    fontSize: responsive.fontSize(15),
    color: Navyblue,
    marginLeft: responsive.margin(10),
    fontWeight: '600',
    width: responsive.width(210),
  },
  subtitle: {
    fontSize: responsive.fontSize(12),
    color: BlueishGray,
    marginLeft: responsive.margin(10),
  },
  reqired: {
    fontSize: responsive.fontSize(12),
    borderWidth: 1,
    // backgroundColor:LightgrayColor,
    borderRadius: responsive.borderRadius(10),
    color: PRIMARY_COLOR,
    padding: responsive.padding(5),
  },
  subcontainer: {
    padding: responsive.padding(10),
    marginTop: responsive.margin(10),
    borderRadius: responsive.borderRadius(10),
    flexDirection: 'row',
  },
  radioContainer: {
    marginBottom: responsive.margin(16),
    padding: responsive.padding(12),
    backgroundColor: '#fff',
    borderRadius: responsive.borderRadius(12),
    borderWidth: 1,
    borderColor: CoolGray,
    flexDirection: 'row',
    // marginVertical: responsive.margin(10),
    // width: responsive.width(290),
    // width:responsive.width(300),
    // alignItems:'center',
    // alignSelf:'center',
    // marginLeft:responsive.margin(-60),
    justifyContent:'flex-start',
  },
  radioLabelContainer: { marginLeft: responsive.margin(5), },
  radioTitle: {
    fontSize: responsive.fontSize(15),
    // font established: '600',
    color: Navyblue,
    width:responsive.width(265),
    
  },
  radioDescription: {
    fontSize: responsive.fontSize(12),
    color: BlueishGray,
    marginTop: 4,
    width:responsive.width(265),
  },
  selectedBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: PRIMARY_COLOR + '10',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedText: {
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  cloudNoteContainer: {
    marginHorizontal: responsive.margin(16),
    marginTop: responsive.margin(12),
    padding: responsive.padding(12),
    backgroundColor: '#F8FAFC',
    borderRadius: responsive.borderRadius(12),
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  cloudNoteTitle: {
    fontSize: responsive.fontSize(15),
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: responsive.margin(6),
  },
  cloudNoteText: {
    fontSize: responsive.fontSize(13),
    color: '#475569',
    lineHeight: responsive.fontSize(18),
  },
  headingContainer: {
     flex: 1,
    // padding: responsive.padding(12),   
    justifyContent: 'center',
    marginVertical: responsive.margin(10),
    alignItems: 'center',
    width:responsive.width(320),
    marginHorizontal: responsive.margin(16),
  },
});
