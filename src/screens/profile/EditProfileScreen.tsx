// src/screens/EditProfileScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  SafeAreaView,
  Image,
  Platform,
  Modal,
} from 'react-native';
import Toast from 'react-native-toast-message';
import CommonLoader from '../../components/CommonLoader';
import CountryPicker from '../../components/CountryPicker';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from './slices/profileSlice';
import { RootState } from '../../redux/store';
import { updateUserProfile } from './slices/profileSlice';
import type { AppDispatch } from '../../redux/store';


type EditProfileScreenProps = {
  navigation: any;
};

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const dispatch: AppDispatch = useDispatch();
  const { userProfile, loading, error } = useSelector((state: RootState) => state.profile);
  
  // State for form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [medicalCondition, setMedicalCondition] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medications, setMedications] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(true);
  
  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Loader state
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isGenderModalVisible, setGenderModalVisible] = useState(false);
  
  // Get user email from auth state
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Update local state when profile data is fetched
  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setEmail(userProfile.email || '');
      setMobileNumber(userProfile.mobile_no || '');
      setGender(userProfile.gender_custom || '');
      setDob(userProfile.date_of_birth || '');
      setAddress(userProfile.address || '');
      setCountry(userProfile.country_code || '');
      setBio(userProfile.bio || '');
      setMedicalCondition(userProfile.medical_condition || '');
      setEmergencyContact(userProfile.emergency_contact || '');
      setBloodType(userProfile.blood_type || '');
      setAllergies(userProfile.allergies || '');
      setMedications(userProfile.medications || '');
      setProfilePicture(userProfile.profile_picture || null);
      setNotifications(Boolean(userProfile.notifications));
    }
  }, [userProfile]);
  
  // Fetch user profile on component mount
  useEffect(() => {
    if (user?.email) {
      dispatch(getUserProfile({ user: user.email }));
    }
  }, [dispatch, user?.email]);
  
  // Handle profile picture selection
  const handleProfilePictureSelect = () => {
    // For Toast, we'll use a simpler approach
    // Since Toast doesn't support multiple options like Alert, we'll implement a custom modal or use a different approach
    // For now, let's implement a simple approach with individual buttons
    // Or you could implement a custom modal for image selection
    console.log('Image selection options should appear here');
  };

  // Handle date selection from date picker
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep picker open on iOS, close on Android
    
    if (selectedDate) {
      // Format the date as YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDob(formattedDate);
    }
  };

  // Show date picker
  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (mobileNumber && !/^[+]?[0-9]{10,15}$/.test(mobileNumber.replace(/\s/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid mobile number';
    }
    
    if (emergencyContact && !/^[+]?[0-9]{10,15}$/.test(emergencyContact.replace(/\s/g, ''))) {
      newErrors.emergencyContact = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!userProfile) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'User profile data not loaded',
        visibilityTime: 3000,
      });
      return;
    }
    
    // Validate form
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fix the errors in the form',
        visibilityTime: 3000,
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // Extract first name and last name from full name
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      // Prepare the payload for the API call according to the required format
      const updatedProfile = {
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
        email: email,
        mobile_no: mobileNumber,
        gender_custom: gender,
        date_of_birth: dob,
        address: address,
        country_code: country,
        bio: bio,
      };
      
      const result = await dispatch(updateUserProfile(updatedProfile));
      
      // Check if the result has an error payload (rejected)
      if (updateUserProfile.rejected.match(result)) {
        // API returned an error - display the error message from payload
        const errorMessage = result.payload || 'Failed to update profile';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMessage,
          visibilityTime: 3000,
        });
        return;
      }
      
      // Check if the response contains a failure status in the message
      const responseData = result.payload;
      if (responseData?.message?.status === 'fail') {
        // API returned status: fail - display the error message
        const errorMessage = responseData.message.message || 'Failed to update profile';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMessage,
          visibilityTime: 3000,
        });
        return;
      }
      
      // Success case - profile updated successfully
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Profile updated successfully!',
        visibilityTime: 3000,
      });
      navigation.goBack();
    } catch (error: any) {
      // Display the actual error message from API response
      const errorMessage = error.message || 'Failed to update profile';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        visibilityTime: 3000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Loading and error handling
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text>Error loading profile: {error}</Text>
          <TouchableOpacity onPress={() => {
            if (user?.email) {
              dispatch(getUserProfile({ user: user.email }));
            }
          }}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  // Render the main content
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Icon name="trending-up" size={24} color="#fff" />
            </View>
            <Text style={styles.logoText}>Liverlytics</Text>
          </View>
        </View> */}
  
        <View style={styles.titleSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
        </View>
  
        <View style={styles.content}>
          {/* Profile Section */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Profile</Text>
            <Text style={styles.cardSubtitle}>Update your personal information.</Text>
  
            <View style={styles.avatarSection}>
              <TouchableOpacity onPress={handleProfilePictureSelect}>
                {profilePicture ? (
                  <Image source={{ uri: profilePicture }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.changePhotoButton} onPress={handleProfilePictureSelect}>
                <Icon name="camera-outline" size={16} color="#52a64a" />
                <Text style={styles.changePhotoText}>
                  {profilePicture ? 'Change Photo' : 'Add Photo'}
                </Text>
              </TouchableOpacity> */}
            </View>
  
            <View style={styles.inputGroup}>
              <View style={styles.inputRow}>
                <Icon name="person-outline" size={20} color="#6b7280" />
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter full name"
                  />
                </View>
              </View>
  
              <View style={styles.inputRow}>
                <Icon name="mail-outline" size={20} color="#6b7280" />
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter email"
                    keyboardType="email-address"
                  />
                </View>
              </View>
  
              <View style={styles.inputRow}>
                <Icon name="call-outline" size={20} color="#6b7280" />
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>Mobile Number</Text>
                  <TextInput
                    style={styles.input}
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
              
              <View style={styles.inputRow}>
                <Icon name="male-female-outline" size={20} color="#6b7280" />
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>Gender</Text>
                  <TouchableOpacity style={styles.selectInput} onPress={() => setGenderModalVisible(true)}>
                    <Text style={styles.selectText}>{gender || 'Select gender'}</Text>
                    <Icon name="chevron-down" size={20} color="#9ca3af" />
                  </TouchableOpacity>

                  {/* Gender Selection Modal */}
                  <Modal
                    visible={isGenderModalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setGenderModalVisible(false)}
                  >
                    <TouchableOpacity
                      style={styles.modalOverlay}
                      activeOpacity={1}
                      onPress={() => setGenderModalVisible(false)}
                    >
                      <View style={styles.genderModalContent}>
                        <TouchableOpacity
                          style={[styles.genderOption, styles.lastGenderOption]}
                          onPress={() => {
                            setGender('Male');
                            setGenderModalVisible(false);
                          }}
                        >
                          <Text style={styles.optionText}>Male</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.genderOption}
                          onPress={() => {
                            setGender('Female');
                            setGenderModalVisible(false);
                          }}
                        >
                          <Text style={styles.optionText}>Female</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </Modal>
                </View>
              </View>
              
              <View style={styles.inputRow}>
                <Icon name="calendar-outline" size={20} color="#6b7280" />
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>Date of Birth</Text>
                  <TouchableOpacity style={styles.selectInput} onPress={showDatepicker}>
                    <Text style={styles.selectText}>{dob || 'Select Date'}</Text>
                    <Icon name="chevron-down" size={20} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Date Picker Modal for Android */}
              {showDatePicker && Platform.OS === 'android' && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dob ? new Date(dob) : new Date()}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={handleDateChange}
                />
              )}
              
              {/* Date Picker Modal for iOS */}
              {showDatePicker && Platform.OS === 'ios' && (
                <View style={styles.dateTimePickerContainer}>
                  <View style={styles.dateTimePickerHeader}>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={styles.dateTimePickerCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={styles.dateTimePickerDone}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={dob ? new Date(dob) : new Date()}
                    mode="date"
                    is24Hour={true}
                    display="spinner"
                    onChange={handleDateChange}
                  />
                </View>
              )}
              
              <View style={styles.inputRow}>
                <Icon name="location-outline" size={20} color="#6b7280" />
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>Country</Text>
                  <CountryPicker
                    label=""
                    placeholder="Select country"
                    value={country}
                    onValueChange={setCountry}
                    containerButtonStyle={styles.selectInput}
                  />
                </View>
              </View>
              
              {/* <View style={styles.inputRow}>
                <Icon name="home-outline" size={20} color="#6b7280" />
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>Address</Text>
                  <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter address"
                  />
                </View>
              </View> */}
              
              {/* <View style={styles.inputRow}>
                <Icon name="document-text-outline" size={20} color="#6b7280" />
                <View style={styles.inputContent}>
                  <Text style={styles.inputLabel}>Bio</Text>
                  <TextInput
                    style={[styles.input, { minHeight: 60, textAlignVertical: 'top' }]}
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Tell us about yourself"
                    multiline
                  />
                </View>
              </View> */}
            </View>
          </View>
  
          {/* Preferences */}
          {/* <View style={styles.card}>
            <Text style={styles.cardTitle}>Preferences</Text>
            <Text style={styles.cardSubtitle}>Control alerts and account options.</Text>
  
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceInfo}>
                <Icon name="notifications-outline" size={20} color="#374151" />
                <View style={styles.preferenceText}>
                  <Text style={styles.preferenceLabel}>Notifications</Text>
                  <Text style={styles.preferenceSubtext}>
                    Enable reminders and important alerts
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#d1d5db', true: '#86efac' }}
                thumbColor={notifications ? '#52a64a' : '#f3f4f6'}
              />
            </View>
  
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Account Settings</Text>
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Icon name="shield-checkmark-outline" size={20} color="#374151" />
                  <Text style={styles.settingText}>Login & Security</Text>
                </View>
                <View style={styles.settingRight}>
                  <Text style={styles.settingSubtext}>Password and sign-in options</Text>
                  <Icon name="chevron-forward" size={20} color="#9ca3af" />
                </View>
              </TouchableOpacity>
            </View>
          </View> */}
  
          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
  
          <Text style={styles.notice}>
            Changes apply to all dashboards and alerts.{'\n'}
            Text size respects your system accessibility settings.
          </Text>
        </View>
          
        {/* Loader */}
        <CommonLoader visible={isUpdating} message="Updating Profile..." />
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
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: '#52a64a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6b7280',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#52a64a',
  },
  inputGroup: {
    gap: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  inputContent: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 6,
  },
  input: {
    fontSize: 15,
    color: '#1f2937',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  selectText: {
    fontSize: 15,
    color: '#1f2937',
  },

  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  preferenceText: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  preferenceSubtext: {
    fontSize: 13,
    color: '#6b7280',
  },
  section: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingSubtext: {
    fontSize: 13,
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#52a64a',
    gap: 6,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  notice: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  
  // Custom styles for gender dropdown
  genderOption: {
    paddingVertical: 10, // Reduced from default
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
  },
  
  lastGenderOption: {
    borderBottomWidth: 0,
  },
  
  // Styles for gender modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '85%',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  optionText: {
    fontSize: 16,
    color: '#2D3748',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  retryText: {
    color: '#52a64a',
    fontWeight: '600',
    marginTop: 10,
  },
  
  dateTimePickerContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  dateTimePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  dateTimePickerCancel: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '500',
  },
  dateTimePickerDone: {
    color: '#52a64a',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default EditProfileScreen;