import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type ProfilePictureScreenProps = {
  navigation: any;
  route: any;
};

const ProfilePictureScreen: React.FC<ProfilePictureScreenProps> = ({ navigation, route }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(route.params?.currentImage || null);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageSelection = () => {
    Alert.alert(
      'Select Profile Picture',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => {
            // TODO: Implement camera functionality with react-native-image-picker
            console.log('Take photo pressed');
            // Example implementation:
            // launchCamera({ mediaType: 'photo', quality: 0.8 }, (response) => {
            //   if (response.assets && response.assets[0]) {
            //     setSelectedImage(response.assets[0].uri);
            //   }
            // });
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: () => {
            // TODO: Implement gallery selection with react-native-image-picker
            console.log('Choose from gallery pressed');
            // Example implementation:
            // launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
            //   if (response.assets && response.assets[0]) {
            //     setSelectedImage(response.assets[0].uri);
            //   }
            // });
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleRemoveImage = () => {
    Alert.alert(
      'Remove Profile Picture',
      'Are you sure you want to remove your profile picture?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setSelectedImage(null);
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement actual save functionality
      // This would typically dispatch an action to update the profile
      console.log('Saving profile picture:', selectedImage);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(() => resolve(null), 1000));
      
      // Navigate back with the new image
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile picture');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile Picture</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          disabled={isSaving}
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        >
          <Text style={[styles.saveText, isSaving && styles.saveTextDisabled]}>
            {isSaving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.imageContainer}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Icon name="person-circle-outline" size={120} color="#d1d5db" />
              <Text style={styles.placeholderText}>No profile picture</Text>
            </View>
          )}
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={handleImageSelection}>
            <Icon name="images-outline" size={24} color="#52ab3c" />
            <Text style={styles.optionText}>Change Picture</Text>
          </TouchableOpacity>

          {selectedImage && (
            <TouchableOpacity style={styles.optionButton} onPress={handleRemoveImage}>
              <Icon name="trash-outline" size={24} color="#ef4444" />
              <Text style={[styles.optionText, { color: '#ef4444' }]}>Remove Picture</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Profile Picture Guidelines</Text>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Icon name="checkmark-circle" size={16} color="#52ab3c" />
              <Text style={styles.infoText}>Clear, well-lit photo</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="checkmark-circle" size={16} color="#52ab3c" />
              <Text style={styles.infoText}>Face should be clearly visible</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="checkmark-circle" size={16} color="#52ab3c" />
              <Text style={styles.infoText}>File size under 5MB</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="checkmark-circle" size={16} color="#52ab3c" />
              <Text style={styles.infoText}>JPG, PNG, or GIF format</Text>
            </View>
          </View>
        </View>
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
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#52ab3c',
  },
  saveButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  saveTextDisabled: {
    color: '#9ca3af',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#e5e7eb',
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
    fontWeight: '500',
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#52ab3c',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
});

export default ProfilePictureScreen;