import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import responsive from '../../theme/responsive';
import { PRIMARY_COLOR, CoolGray } from '../../theme/color';
import Icon from 'react-native-vector-icons/Feather';
import {colors, font} from '../../theme/index';

const Allset = () => {
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
    <View style={styles.container}>
      {/* <View style={styles.iconcontainer}> */}
        {/* <Text style={styles.title}>All Set!</Text>
            <Text style={styles.subtitle}>You're all set to start using the app.</Text> */}
        {/* <Icon name="check-circle" size={50} color="white" /> */}
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
      {/* </View> */}
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
});

export default Allset;
