import React from 'react';
import { View, Text, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import responsive from '../theme/responsive';

interface CommonLoaderProps {
  visible: boolean;
  message?: string;
}

const CommonLoader: React.FC<CommonLoaderProps> = ({ visible, message = 'Loading...' }) => {
  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={true}
            size="large"
            color="#52ab3c"
          />
          <Text style={styles.loadingText}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: responsive.height(100),
    width: responsive.width(200),
    borderRadius: responsive.borderRadius(10),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: responsive.padding(20),
  },
  loadingText: {
    marginTop: responsive.margin(10),
    fontSize: responsive.fontSize(14),
    color: '#333333',
    fontWeight: '500',
  },
});

export default CommonLoader;