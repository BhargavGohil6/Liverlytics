import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import responsive from '../../theme/responsive';
import { PRIMARY_COLOR, CoolGray } from '../../theme/color';
import Icon from 'react-native-vector-icons/Feather';

const Allset = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconcontainer}>
        {/* <Text style={styles.title}>All Set!</Text>
            <Text style={styles.subtitle}>You're all set to start using the app.</Text> */}
        <Icon name="check-circle" size={50} color="white" />
      </View>
      <Text style={styles.title}>You’re All Set!</Text>
      {/* <Text style={styles.subtitle}>
        Your profile is ready and all preferences have been saved.
      </Text> */}
      <Text style={styles.subtitle}>
         You can adjust your targets anytime in Settings. We’ll start
          monitoring your logs and alert you based on your thresholds.
      </Text>

      {/* <View style={styles.subcontainer}>
        <Text>
          You can adjust your targets anytime in Settings. We’ll start
          monitoring your logs and alert you based on your thresholds.
        </Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:responsive.width(285),
    marginLeft:responsive.margin(15),
  },
  title: {
    fontSize: responsive.fontSize(24),
    fontWeight: 'bold',
    marginTop: responsive.height(16),
  },
  subtitle: {
    fontSize: responsive.fontSize(16),
    marginBottom: responsive.height(16),
    color: CoolGray,
    alignSelf: 'center',
    textAlign: 'center',
  },
  iconcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
    width: responsive.width(100),
    height: responsive.height(100),
    borderRadius: responsive.borderRadius(10),
  },
  subcontainer:{
    padding:responsive.padding(10),
    // backgroundColor:White,
    marginTop:responsive.margin(10),
    borderRadius:responsive.borderRadius(10),
    borderWidth:1,
    borderColor:'#9999',
    textAlign:'center',
    alignSelf: 'center',
  }
});

export default Allset;
