import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import responsive from '../theme/responsive';

const { width, height } = Dimensions.get('window');

interface CommonPopupProps {
  visible: boolean;
  title: string;
  message: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  onClose?: () => void;
  showBottomButtons?: boolean; // New prop to control button layout
  bottomPrimaryButtonText?: string; // Bottom button texts
  bottomSecondaryButtonText?: string; // Bottom button texts
  onBottomPrimaryPress?: () => void; // Bottom button handlers
  onBottomSecondaryPress?: () => void; // Bottom button handlers
}

const CommonPopup: React.FC<CommonPopupProps> = ({
  visible,
  title,
  message,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
  onClose,
  showBottomButtons,
  bottomPrimaryButtonText,
  bottomSecondaryButtonText,
  onBottomPrimaryPress,
  onBottomSecondaryPress,
}) => {
  const handleOverlayPress = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay} onTouchEnd={handleOverlayPress}>
        <View style={styles.popupContainer} onTouchEnd={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {onClose && (
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.body}>
            <Text style={styles.message}>{message}</Text>
          </View>
          
          {primaryButtonText && onPrimaryPress && (
            <View style={styles.buttonContainer}>
              {secondaryButtonText && onSecondaryPress && (
                <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onSecondaryPress}>
                  <Text style={styles.secondaryButtonText}>{secondaryButtonText}</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={onPrimaryPress}>
                <Text style={styles.primaryButtonText}>{primaryButtonText}</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Bottom Buttons Section */}
          {showBottomButtons && (
            <View style={styles.bottomButtonContainer}>
              {bottomSecondaryButtonText && onBottomSecondaryPress && (
                <TouchableOpacity 
                  style={[styles.bottomButton, styles.bottomSecondaryButton]} 
                  onPress={onBottomSecondaryPress}
                >
                  <Text style={styles.bottomSecondaryButtonText}>{bottomSecondaryButtonText}</Text>
                </TouchableOpacity>
              )}
              
              {bottomPrimaryButtonText && onBottomPrimaryPress && (
                <TouchableOpacity 
                  style={[styles.bottomButton, styles.bottomPrimaryButton]} 
                  onPress={onBottomPrimaryPress}
                >
                  <Text style={styles.bottomPrimaryButtonText}>{bottomPrimaryButtonText}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: width * 0.85,
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: responsive.width(12),
    padding: responsive.padding(20),
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: responsive.margin(10),
  },
  title: {
    fontSize: responsive.fontSize(18),
    fontWeight: 'bold',
    color: '#0F2740',
    flex: 1,
  },
  closeButton: {
    padding: responsive.padding(5),
  },
  closeText: {
    fontSize: responsive.fontSize(20),
    color: '#777',
  },
  body: {
    marginBottom: responsive.margin(20),
  },
  message: {
    fontSize: responsive.fontSize(14),
    color: '#555',
    lineHeight: responsive.fontSize(18),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: responsive.width(10),
    marginBottom: responsive.margin(10),
  },
  button: {
    flex: 1,
    paddingVertical: responsive.padding(12),
    paddingHorizontal: responsive.padding(16),
    borderRadius: responsive.width(8),
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#E0E0E0',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: responsive.width(10),
    marginTop: responsive.margin(10),
  },
  bottomButton: {
    flex: 1,
    paddingVertical: responsive.padding(12),
    paddingHorizontal: responsive.padding(16),
    borderRadius: responsive.width(8),
    alignItems: 'center',
  },
  bottomPrimaryButton: {
    backgroundColor: '#4CAF50',
  },
  bottomSecondaryButton: {
    backgroundColor: '#E0E0E0',
  },
  bottomPrimaryButtonText: {
    color: 'white',
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
  },
  bottomSecondaryButtonText: {
    color: '#333',
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
  },
});

export default CommonPopup;