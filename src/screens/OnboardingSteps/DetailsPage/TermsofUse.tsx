import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import responsive from '../../../theme/responsive';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Feather';
import Icon3 from 'react-native-vector-icons/Fontisto';
import Icon4 from 'react-native-vector-icons/EvilIcons';
import {
  CoolGray,
  LightgrayColor,
  White,
  Navyblue,
} from '../../../theme/color';
import CommonButton from '../../../components/CommonButton';
import axios from 'axios';
import { BASE_URL } from '../../../services/api/url';
import { useDispatch } from 'react-redux';
import { acceptTerms } from '../slices/onboardingSlice';

export default function TermsofUse({ navigation }) {
  const [temsText, setTemsText] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const handleAccept = () => {
    dispatch(acceptTerms());
    navigation.goBack();
  };

useEffect(() => {
  fetchTems();
}, []);

const fetchTems = async () => {
const API_URL = BASE_URL + '/cirrhosis_custom.cirrhosis_terms_of_use.get_current_terms_of_use';

    try {
      const res = await axios.get(API_URL, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'token 72b96de8ae8c469:96b6b5699febb74',
        },
      });
      setTemsText(res.data.message?.terms_of_use || 'No content available.');
    } catch (error) {
      setTemsText('Failed to load privacy policy.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
    <ScrollView>
      <Image
        source={require('../../../assets/Transparent 1.png')}
        style={styles.image}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            borderWidth: 1,
            borderRadius: 5,
            left: 0,
          }}
        >
          <Icon name="left" size={responsive.fontSize(24)} color="black" />
        </TouchableOpacity>
        <Text>Terms of Use</Text>
      </View>
      <View style={styles.subcontainer}>
        <Text style={styles.titale}>View Full Terms</Text>
        <Text style={styles.subtitle}>
          Please review the Liverlytics Terms of Use below.
        </Text>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.sectionWrapper}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Effective: Jan 15, 2025 </Text>
              <Text style={styles.sectionTitle}>V 1.2</Text>
            </View>
            <View style={styles.section1}>
              <View style={styles.details}>
                <Icon
                  name="bars"
                  size={responsive.fontSize(20)}
                  color={Navyblue}
                />
                <Text style={styles.contentTitle}>Contents</Text>
              </View>
              <View style={styles.details}>
                <Icon2
                  name="hash"
                  size={responsive.fontSize(20)}
                  color={Navyblue}
                />
                <Text style={styles.contentTitle}>1. Acceptance of Terms</Text>
              </View>
              <View style={styles.details}>
                <Icon2
                  name="lock"
                  size={responsive.fontSize(20)}
                  color={Navyblue}
                />
                <Text style={styles.contentTitle}>
                  2. Eligibility & Accounts
                </Text>
              </View>
              <View style={styles.details}>
                <Icon1
                  name="stethoscope"
                  size={responsive.fontSize(20)}
                  color={Navyblue}
                />
                <Text style={styles.contentTitle}>3. Not Medical Advice</Text>
              </View>
              <View style={styles.details}>
                <Icon2
                  name="database"
                  size={responsive.fontSize(20)}
                  color={Navyblue}
                />
                <Text style={styles.contentTitle}>4. Data & Privacy</Text>
              </View>
              <View style={styles.details}>
                <Icon2
                  name="shield"
                  size={responsive.fontSize(20)}
                  color={Navyblue}
                />
                <Text style={styles.contentTitle}>
                  5. User Responsibilities
                </Text>
              </View>
              <View style={styles.details}>
                <Icon1
                  name="balance-scale"
                  size={responsive.fontSize(20)}
                  color={Navyblue}
                />
                <Text style={styles.contentTitle}>
                  6. Limitation of Liability
                </Text>
              </View>
              <View style={styles.details}>
                <Icon3
                  name="world-o"
                  size={responsive.fontSize(20)}
                  color={Navyblue}
                />
                <Text style={styles.contentTitle}>7. International Use</Text>
              </View>
              <View style={styles.details}>
                <Icon4
                  name="refresh"
                  size={responsive.fontSize(20)}
                  color={Navyblue}
                />
                <Text style={styles.contentTitle}>8. Changes to Terms</Text>
              </View>
              <View style={styles.details}>
                <Icon2
                  name="mail"
                  size={responsive.fontSize(20)}
                  color={Navyblue}
                />
                <Text style={styles.contentTitle}>9. Contact</Text>
              </View>
            </View>
            <View style={styles.section2}>
              <Text style={styles.contentTitle}>{temsText}</Text>
              {/* <Text style={styles.description}>
                By creating an account or using Liverlytics, you agree to these
                Terms of Use and our Privacy Policy. If you do not agree, do not
                use the app.
              </Text> */}
            </View>
          </View>
        </ScrollView>
      </View>
      <CommonButton title="I Agree" fontSize={22} style={styles.buttion} onPress={handleAccept} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: responsive.padding(20),
    backgroundColor: 'white',
    paddingVertical: responsive.padding(50),
  },
  image: {
    width: responsive.width(200),
    height: responsive.height(60),
    marginTop: responsive.margin(10),
    alignSelf: 'center',
  },
  titale: {
    fontSize: responsive.fontSize(24),
    fontWeight: '600',
  },
  subtitle: {
    fontSize: responsive.fontSize(12),
  },
  subcontainer: {
    padding: responsive.padding(10),
    backgroundColor: White,
    marginTop: responsive.margin(10),
    borderRadius: responsive.borderRadius(10),
    marginBottom: responsive.margin(20),
  },
  buttion: {
    marginTop: responsive.margin(30),
    marginBottom: responsive.margin(20),
    borderRadius: responsive.borderRadius(22),
  },
  sectionWrapper: {
    borderWidth: 0.5,
    color: LightgrayColor,
    borderRadius: responsive.borderRadius(10),
    padding: responsive.padding(13),

    // marginBottom: responsive.margin(15),
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: responsive.fontSize(12),
    color: CoolGray,
  },
  section1: {
    padding: responsive.padding(15),
    backgroundColor: LightgrayColor,
    borderRadius: responsive.borderRadius(10),
    marginTop: responsive.margin(10),
  },
  details: {
    flexDirection: 'row',
    gap: responsive.margin(10),
    alignItems: 'center',
    paddingTop: responsive.padding(10),
  },
  contentTitle: {
    fontSize: responsive.fontSize(12),
    color: Navyblue,
    fontWeight: '600',
  },
  scrollContainer: {
    // flex: 1,
    marginTop: responsive.margin(10),
  },
  section2: {
    borderWidth: 0.8,
    marginTop: responsive.margin(10),
    borderColor: LightgrayColor,
    borderRadius: responsive.borderRadius(10),
    padding: responsive.padding(10),
  },
  description:{
    fontSize:responsive.fontSize(12),
    color:Navyblue
  }
  
});
