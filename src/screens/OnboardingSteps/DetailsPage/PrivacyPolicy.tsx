import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,ScrollView } from 'react-native';
import responsive from '../../../theme/responsive';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Octicons';
import {CoolGray, LightgrayColor, White} from '../../../theme/color'
import CommonButton from '../../../components/CommonButton';
import { useDispatch } from 'react-redux';
import { acceptPrivacy } from '../slices/onboardingSlice';
import axios from 'axios';
import { BASE_URL } from '../../../services/api/url';


export default function PrivacyPolicy({ navigation }) {
  const [policyText, setPolicyText] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const handleAccept = () => {
  dispatch(acceptPrivacy());    
  navigation.goBack();           
};
useEffect(() => {
    fetchPrivacyPolicy();
  }, []);
  const fetchPrivacyPolicy = async () => {
const API_URL = BASE_URL + '/cirrhosis_custom.cirrhosis_privacy_policy.get_current_privacy_policy';

    try {
      const res = await axios.get(API_URL, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'token 72b96de8ae8c469:96b6b5699febb74',
        },
      });
      setPolicyText(res.data.message?.privacy_policy || 'No content available.');
    } catch (error) {
      setPolicyText('Failed to load privacy policy.');
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
        <Text>Privacy Policy</Text>
      </View>
      <View
        style={{
          padding: responsive.padding(10),
          backgroundColor: LightgrayColor,
          marginTop: responsive.margin(10),
          borderRadius: responsive.borderRadius(10),
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center',gap:responsive.width(10) }}>
          <Icon1
            name="shield-check"
            size={responsive.fontSize(24)}
            color="black"
          />
          <Text style={styles.titale}>How We Handle Your Data</Text>
        </View>
        <View style={{ marginTop: responsive.margin(10),flexDirection:'row',justifyContent:'space-between' }}>
        <Text style={styles.subtitle}>Last updated: Jan 12, 2025</Text>
        <Text style={styles.subtitle}> V1.2 </Text>
        </View>
        <View style={styles.subcontainer}>
          {/* <Text>1. Overview</Text> */}
          <Text>{policyText}</Text>
        </View>
      </View>
      <CommonButton title="Accept" fontSize={22} style={styles.buttion} onPress={handleAccept} />
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
    fontSize: responsive.fontSize(16),
    fontWeight: '700',
  },
  subtitle:{
    fontSize:responsive.fontSize(12),
    color:CoolGray,
    fontWeight:'400'
  },
  subcontainer:{
    padding:responsive.padding(10),
    backgroundColor:White,
    marginTop:responsive.margin(10),
    borderRadius:responsive.borderRadius(10),
    // height:responsive.height(100)
  },
  buttion:{
    marginTop:responsive.margin(20),
    marginBottom:responsive.margin(20),
    borderRadius:responsive.borderRadius(22)
  }
});
