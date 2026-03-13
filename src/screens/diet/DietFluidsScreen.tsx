// src/screens/DietFluidsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  useWindowDimensions,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchDietEntries, addDietEntry, deleteDietEntry, fetchDietEntryById, updateDietEntry, fetchTodayDiet } from './slices/dietSlice';
import Toast from 'react-native-toast-message';
import responsive from '../../theme/responsive';
import colors from '../../theme/color';



type DietFluidsScreenProps = {
  navigation: any;
};

const DietFluidsScreen = ({ navigation }: DietFluidsScreenProps) => {
  const [itemName, setItemName] = useState('');
  const [sodium, setSodium] = useState('');
  const [fluid, setFluid] = useState('');
  const [protein, setProtein] = useState('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [customTimes, setCustomTimes] = useState<Record<string, Date>>({}); // Store custom times by entry ID
  
  const dispatch = useDispatch<AppDispatch>();
  const { data: entries, daily_limits, overall_totals, loading, error } = useSelector((state: RootState) => state.diet);
  console.log('diet data', { entries, daily_limits, overall_totals })
  useEffect(() => {
    dispatch(fetchTodayDiet());
  }, [dispatch]);

  // Get user from auth state
  const { user } = useSelector((state: RootState) => state.auth);

  const handleAddEntry = () => {
    if (!itemName || !sodium || !fluid || !protein) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all fields',
        visibilityTime: 3000,
      });
      return;
    }

    const userEmail = user?.email || ''; // Use email from auth state
    
    const addData: any = {
      item_name: itemName,
      sodium: sodium,
      fluid_ml: fluid,
      protein: protein,
      user: userEmail,
    };
    
    dispatch(addDietEntry(addData)).then((result) => {
      if (addDietEntry.fulfilled.match(result)) {
        // Store the custom time using the actual entry ID from response if available
        const entryId = result.payload?.diet_and_fluids_id || `temp_${Date.now()}`;
        setCustomTimes(prev => ({
          ...prev,
          [entryId]: new Date(selectedTime) // Store the selected time
        }));
        
        // Clear form fields
        setItemName('');
        setSodium('');
        setFluid('');
        setProtein('');
        setSelectedTime(new Date()); // Reset to current time
        // Refresh today's diet to get updated totals and limits
        dispatch(fetchTodayDiet());
      }
    });
  };

  const handleUpdateEntry = () => {
    if (!itemName || !sodium || !fluid || !protein || !editingEntryId) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all fields',
        visibilityTime: 3000,
      });
      return;
    }

    const userEmail = user?.email || ''; // Use email from auth state
    
    const updateData: any = {
      diet_and_fluids_id: editingEntryId,
      item_name: itemName,
      sodium: sodium,
      fluid_ml: fluid,
      protein: protein,
      user: userEmail,
    };
    
    // Only add time field if the backend supports it
    // For now, we'll store it locally in customTimes
    setCustomTimes(prev => ({
      ...prev,
      [editingEntryId]: new Date(selectedTime)
    }));
    
    dispatch(updateDietEntry(updateData)).then((result) => {
      if (updateDietEntry.fulfilled.match(result)) {
        // Clear form fields and exit edit mode
        setItemName('');
        setSodium('');
        setFluid('');
        setProtein('');
        setEditingEntryId(null);
        setSelectedTime(new Date()); // Reset to current time
        // Refresh today's diet to get updated totals and limits
        dispatch(fetchTodayDiet());
      }
    });
  };

  const handleDeleteEntry = (entryId: string) => {
    dispatch(deleteDietEntry(entryId)).then((result) => {
      if (deleteDietEntry.fulfilled.match(result)) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Entry deleted successfully!',
          visibilityTime: 2000,
        });
        
        // Refresh today's diet to get updated totals and limits
        dispatch(fetchTodayDiet());

        // If we were editing this entry, clear the form
        if (editingEntryId === entryId) {
          setItemName('');
          setSodium('');
          setFluid('');
          setProtein('');
          setEditingEntryId(null);
        }
      }
    });
  };

  const handleEditEntry = (entry: any) => {
    if (entry.name) {
      // Set the form fields with the entry data
      setItemName(entry.item_name || '');
      setSodium(entry.sodium || '');
      setFluid(entry.fluid_ml || '');
      setProtein(entry.protein || '');
      setEditingEntryId(entry.name);
      
      // Set the time if it exists in customTimes or use creation time
      if (entry.name && customTimes[entry.name]) {
        setSelectedTime(new Date(customTimes[entry.name]));
      } else if (entry.creation) {
        setSelectedTime(new Date(entry.creation));
      }
    }
  };

  const handleCancelEdit = () => {
    // Clear form fields and exit edit mode
    setItemName('');
    setSodium('');
    setFluid('');
    setProtein('');
    setEditingEntryId(null);
  };

  // Time picker functions
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleTimeConfirm = () => {
    setShowTimePicker(false);
    // Time is already updated in state through selectHour and selectMinute
  };

  const handleTimeCancel = () => {
    // Reset to current time
    setSelectedTime(new Date());
    setShowTimePicker(false);
  };

  const selectHour = (hour: number) => {
    setSelectedTime(prevTime => {
      const newTime = new Date(prevTime);
      newTime.setHours(hour);
      return newTime;
    });
  };

  const selectMinute = (minute: number) => {
    setSelectedTime(prevTime => {
      const newTime = new Date(prevTime);
      newTime.setMinutes(minute);
      return newTime;
    });
  };

  // Use totals from API if available, otherwise calculate
  const calculateTotals = () => {
    if (overall_totals) {
      return {
        totalSodium: overall_totals.sodium || 0,
        totalFluid: overall_totals.fluid_ml || 0,
        totalProtein: (overall_totals as any).protein || 0
      };
    }
    
    if (!entries) return { totalSodium: 0, totalFluid: 0, totalProtein: 0 };
    
    // Get today's date for comparison
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // Filter entries for today's date only
    const todayEntries = entries.filter(entry => {
      if (!entry || !entry.creation) return false;
      // Parse the creation date and compare with today
      const entryDate = new Date(entry.creation);
      const entryDateStr = entryDate.toISOString().split('T')[0];
      return entryDateStr === todayStr;
    });
    
    // Calculate totals for today's entries only
    return todayEntries.reduce((totals, entry) => {
      return {
        totalSodium: totals.totalSodium + (parseInt(entry.sodium) || 0),
        totalFluid: totals.totalFluid + (parseInt(entry.fluid_ml) || 0),
        totalProtein: totals.totalProtein + (parseInt((entry as any).protein) || 0)
      };
    }, { totalSodium: 0, totalFluid: 0, totalProtein: 0 });
  };

  const { totalSodium, totalFluid, totalProtein } = calculateTotals();

  // Orientation handling for responsive layout
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  
  // Check if daily totals exceed user targets
  const checkIfTargetsExceeded = () => {
    // Default targets
    const defaultSodiumTarget = 2000; // mg
    const defaultFluidTarget = 1800; // mL
    const defaultProteinTarget = 50; // g
    
    // Use limits from API if available
    const sodiumTarget = daily_limits?.daily_sodium_limit || defaultSodiumTarget;
    const fluidTarget = daily_limits?.daily_fluid_limit || defaultFluidTarget;
    const proteinTarget = (daily_limits as any)?.daily_protein_limit || defaultProteinTarget;
    
    // Check if current totals exceed targets
    const isSodiumExceeded = totalSodium > sodiumTarget;
    const isFluidExceeded = totalFluid > fluidTarget;
    const isProteinExceeded = totalProtein > proteinTarget;
    
    return {
      isSodiumExceeded,
      isFluidExceeded,
      isProteinExceeded,
      sodiumTarget,
      fluidTarget,
      proteinTarget
    };
  };
  
  const { isSodiumExceeded, isFluidExceeded, isProteinExceeded, sodiumTarget, fluidTarget, proteinTarget } = checkIfTargetsExceeded();
  
  // Determine alert text based on exceeded targets
  const getAlertText = () => {
    const exceededItems = [];
    
    if (isSodiumExceeded) {
      exceededItems.push(`Sodium (${totalSodium.toLocaleString()}mg > ${sodiumTarget}mg)`);
    }
    
    if (isFluidExceeded) {
      exceededItems.push(`Fluid (${totalFluid.toLocaleString()}mL > ${fluidTarget}mL)`);
    }
    
    if (isProteinExceeded) {
      exceededItems.push(`Protein (${totalProtein.toLocaleString()}g > ${proteinTarget}g)`);
    }
    
    if (exceededItems.length > 0) {
      return `⚠️ Target exceeded: ${exceededItems.join(', ')}`;
    }
    
    return 'As of now';
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: responsive.padding(20) }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={responsive.fontSize(24)} color={colors.darkGray} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Diet & Fluids</Text>
          {/* <Text style={styles.subtitle}>Track today's sodium and fluid intake</Text> */}

          {/* Today's Totals */}
          <View style={styles.totalsCard}>
            <Text style={styles.totalsTitle}>Today's Totals</Text>
            <View style={styles.totalsRow}>
              <View style={[styles.totalItem, { flex: 1, marginRight: responsive.margin(8), marginBottom: responsive.margin(8) }] }>
                <Text style={styles.totalLabel}>Sodium</Text>
                <Text style={styles.totalValue}>{totalSodium.toLocaleString()} mg</Text>
              </View>
              <View style={[styles.totalItem, { flex: 1, marginRight: responsive.margin(8), marginBottom: responsive.margin(8) }] }>
                <Text style={styles.totalLabel}>Fluid</Text>
                <Text style={styles.totalValue}>{totalFluid.toLocaleString()} mL</Text>
              </View>
              <View style={[styles.totalItem, { flex: 1 }] }>
                <Text style={styles.totalLabel}>Protein</Text>
                <Text style={styles.totalValue}>{totalProtein.toLocaleString()} g</Text>
              </View>
            </View>
            <Text style={[styles.timestamp, (isSodiumExceeded || isFluidExceeded || isProteinExceeded) ? styles.alertText : null]}>
              {getAlertText()}
            </Text>
          </View>

          {/* Add Entry */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Add Entry</Text>
            
            <Text style={styles.inputLabel}>Item Name</Text>
            <View style={[styles.inputContainer, { flexDirection: isLandscape ? 'row' : 'row' }] }>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={itemName}
                onChangeText={setItemName}
                placeholder="e.g., Chicken soup"
              />
              <Icon name="create-outline" size={responsive.fontSize(20)} color={colors.coolGray} />
            </View>

            <Text style={styles.inputLabel}>Sodium (mg)</Text>
            <View style={[styles.inputContainer, { flexDirection: isLandscape ? 'row' : 'row' }] }>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={sodium}
                onChangeText={setSodium}
                placeholder="e.g., 650"
                keyboardType="numeric"
              />
              <Icon name="calculator-outline" size={responsive.fontSize(20)} color={colors.coolGray} />
            </View>

            <Text style={styles.inputLabel}>Fluid (mL)</Text>
            <View style={[styles.inputContainer, { flexDirection: isLandscape ? 'row' : 'row' }] }>
              <TextInput
                style={[styles.input, { flex: 1 }]} 
                value={fluid}
                onChangeText={setFluid}
                placeholder="e.g., 240"
                keyboardType="numeric"
              />
              <Icon name="water-outline" size={responsive.fontSize(20)} color={colors.coolGray} />
            </View>
            
            <Text style={styles.inputLabel}>Protein (g)</Text>
            <View style={[styles.inputContainer, { flexDirection: isLandscape ? 'row' : 'row' }] }>
              <TextInput
                style={[styles.input, { flex: 1 }]} 
                value={protein}
                onChangeText={setProtein}
                placeholder="e.g., 25"
                keyboardType="numeric"
              />
              <Icon name="nutrition-outline" size={responsive.fontSize(20)} color={colors.coolGray} />
            </View>

            <View style={styles.timestampRow}>
              <TouchableOpacity 
                style={styles.timestampTouchable}
                onPress={() => setShowTimePicker(true)}
              >
                <Icon name="time-outline" size={responsive.fontSize(20)} color={colors.coolGray} />
                <Text style={styles.timestampText}>{formatTime(selectedTime)}</Text>
                <Icon name="chevron-forward" size={responsive.fontSize(20)} color={colors.coolGray} />
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              {editingEntryId ? (
                <>
                  <TouchableOpacity 
                    style={[styles.addButton, styles.updateButton, { flex: isLandscape ? 0.45 : 1, marginRight: isLandscape ? responsive.margin(8) : 0, marginBottom: responsive.margin(8) }]}
                    onPress={handleUpdateEntry}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <Text style={styles.addButtonText}>Update Entry</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.addButton, styles.cancelButton, { flex: isLandscape ? 0.45 : 1, marginLeft: isLandscape ? responsive.margin(8) : 0 }]}
                    onPress={handleCancelEdit}
                    disabled={loading}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity 
                  style={[styles.addButton, { marginBottom: responsive.margin(8) }]}
                  onPress={handleAddEntry}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <Text style={styles.addButtonText}>Add Entry</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Today's Entries */}
          <View style={styles.entriesSection}>
            <View style={styles.entriesHeader}>
              <Text style={styles.entriesTitle}>Today's Entries</Text>
              {/* <Text style={styles.deleteHint}>Tap trash to delete</Text> */}
            </View>

            {(() => {
              // Get today's date for comparison
              const today = new Date();
              const todayStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
                          
              // Filter entries for today's date only
              const todayEntries = entries?.filter(entry => {
                if (!entry || !entry.creation) return false;
                // Parse the creation date and compare with today
                const entryDate = new Date(entry.creation);
                const entryDateStr = entryDate.toISOString().split('T')[0];
                return entryDateStr === todayStr;
              }) || [];
                          
              return todayEntries.length > 0 ? (
                todayEntries.map((entry, index) => (
                  <View key={entry.name || index} style={styles.entryCard}>
                    <TouchableOpacity 
                      style={styles.entryContent}
                      onPress={() => handleEditEntry(entry)}
                      disabled={loading}
                    >
                      <Text style={styles.entryName}>{entry.item_name}</Text>
                      <Text style={styles.entryDetails}>
                        Sodium: {entry.sodium} mg • Fluid: {entry.fluid_ml} mL{entry && (entry as any).protein ? ` • Protein: ${(entry as any).protein} g` : ''}
                      </Text>
                      <Text style={styles.entryTime}>
                        • {entry.name && customTimes[entry.name] 
                          ? customTimes[entry.name].toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                          : (entry.creation 
                              ? new Date(entry.creation).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                              : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.deleteButton, { marginLeft: isLandscape ? responsive.margin(8) : 0, marginTop: isLandscape ? 0 : responsive.margin(8) }]} 
                      onPress={() => entry.name && handleDeleteEntry(entry.name)}
                      disabled={loading}
                    >
                      <Icon name="trash-outline" size={responsive.fontSize(20)} color={colors.alertRed} />
                      <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.noEntriesText}>
                  {loading ? 'Loading entries...' : 'No entries found for today. Add your first entry!'}
                </Text>
              );
            })()}
          </View>

          {/* Tip */}
          {/* <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              Tip: Higher sodium increases fluid retention. Track daily intake to manage cirrhosis symptoms.
            </Text>
          </View> */}
        </View>
      </ScrollView>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.timePickerOverlay}>
          <View style={styles.timePickerContainer}>
            <View style={styles.timePickerHeader}>
              <Text style={styles.timePickerTitle}>Select Time</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <Icon name="close" size={responsive.fontSize(24)} color={colors.darkGray} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.timePickerContent}>
              {/* Hours Column */}
              <View style={styles.timeColumn}>
                <Text style={styles.timeColumnLabel}>Hours</Text>
                <ScrollView style={styles.timeScrollView}>
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[
                        styles.timeItem,
                        selectedTime.getHours() === hour && styles.selectedTimeItem
                      ]}
                      onPress={() => selectHour(hour)}
                    >
                      <Text style={[
                        styles.timeItemText,
                        selectedTime.getHours() === hour && styles.selectedTimeItemText
                      ]}>
                        {hour.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              {/* Minutes Column */}
              <View style={styles.timeColumn}>
                <Text style={styles.timeColumnLabel}>Minutes</Text>
                <ScrollView style={styles.timeScrollView}>
                  {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={[
                        styles.timeItem,
                        selectedTime.getMinutes() === minute && styles.selectedTimeItem
                      ]}
                      onPress={() => selectMinute(minute)}
                    >
                      <Text style={[
                        styles.timeItemText,
                        selectedTime.getMinutes() === minute && styles.selectedTimeItemText
                      ]}>
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
            
            <View style={styles.timePickerButtons}>
              <TouchableOpacity 
                style={[styles.timePickerButton, styles.timePickerCancelButton]}
                onPress={handleTimeCancel}
              >
                <Text style={styles.timePickerCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.timePickerButton, styles.timePickerConfirmButton]}
                onPress={handleTimeConfirm}
              >
                <Text style={styles.timePickerConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  header: {
    padding: responsive.padding(16),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  content: {
    padding: responsive.padding(16),
  },
  title: {
    fontSize: responsive.fontSize(24),
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: responsive.margin(4),
  },
  subtitle: {
    fontSize: responsive.fontSize(14),
    color: colors.coolGray,
    marginBottom: responsive.margin(24),
  },
  totalsCard: {
    backgroundColor: colors.white,
    padding: responsive.padding(20),
    borderRadius: responsive.borderRadius(16),
    marginBottom: responsive.margin(16),
    borderWidth: 1,
    borderColor: colors.gray200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalsTitle: {
    fontSize: responsive.fontSize(18),
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: responsive.margin(16),
    textAlign: 'center',
  },
  totalsRow: {
    flexDirection: 'row',
    gap: responsive.margin(8),
    marginBottom: responsive.margin(8),
    flexWrap: 'wrap',
  },
  totalItem: {
    flex: 1,
    backgroundColor: colors.white,
    padding: responsive.padding(16),
    borderRadius: responsive.borderRadius(12),
    borderWidth: 1,
    borderColor: colors.gray200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  totalLabel: {
    fontSize: responsive.fontSize(12),
    color: colors.coolGray,
    marginBottom: responsive.margin(4),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: responsive.fontSize(22),
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  timestamp: {
    fontSize: responsive.fontSize(13),
    color: colors.coolGray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  alertText: {
    color: colors.alertRed,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.white,
    padding: responsive.padding(16),
    borderRadius: responsive.borderRadius(12),
    marginBottom: responsive.margin(16),
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  cardTitle: {
    fontSize: responsive.fontSize(18),
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: responsive.margin(16),
  },
  inputLabel: {
    fontSize: responsive.fontSize(14),
    fontWeight: '500',
    color: colors.darkGray,
    marginBottom: responsive.margin(8),
    marginTop: responsive.margin(12),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: responsive.borderRadius(8),
    paddingHorizontal: responsive.padding(12),
    marginBottom: responsive.margin(8),
  },
  input: {
    flex: 1,
    paddingVertical: responsive.padding(12),
    fontSize: responsive.fontSize(15),
    color: colors.darkGray,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsive.padding(12),
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: responsive.borderRadius(8),
    paddingHorizontal: responsive.padding(12),
    marginTop: responsive.margin(16),
    marginBottom: responsive.margin(8),
  },
  timestampTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timestampText: {
    flex: 1,
    fontSize: responsive.fontSize(15),
    color: colors.darkGray,
    marginLeft: responsive.margin(8),
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: responsive.padding(14),
    borderRadius: responsive.borderRadius(8),
    alignItems: 'center',
    marginTop: responsive.margin(16),
    flex: 1,
  },
  updateButton: {
    backgroundColor: colors.primary,
    marginRight: responsive.margin(8),
  },
  cancelButton: {
    backgroundColor: colors.white,
    
    //  backgroundColor: '#333',
    marginLeft: responsive.margin(8),
    borderRadius: responsive.borderRadius(8),
    borderWidth: 1,
    borderColor: colors.gray200,
    height: responsive.height(48),
    justifyContent: 'center',
  },
   cancelButtonText: {
    // backgroundColor: colors.coolGray,
    color: '#333',
    
    marginLeft: responsive.margin(8),
  },
  addButtonText: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: colors.white,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsive.margin(16),
    flexWrap: 'wrap',
    gap: responsive.margin(8),
  },
  entriesSection: {
    marginBottom: responsive.margin(16),
  },
  entriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsive.margin(12),
  },
  entriesTitle: {
    fontSize: responsive.fontSize(18),
    fontWeight: '600',
    color: colors.darkGray,
  },
  deleteHint: {
    fontSize: responsive.fontSize(12),
    color: colors.coolGray,
  },
  entryCard: {
    backgroundColor: colors.white,
    padding: responsive.padding(16),
    borderRadius: responsive.borderRadius(12),
    marginBottom: responsive.margin(12),
    borderWidth: 1,
    borderColor: colors.gray200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  entryContent: {
    flex: 1,
  },
  entryName: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: responsive.margin(4),
  },
  entryDetails: {
    fontSize: responsive.fontSize(13),
    color: colors.coolGray,
    marginBottom: responsive.margin(2),
  },
  entryTime: {
    fontSize: responsive.fontSize(12),
    color: colors.coolGray,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsive.padding(8),
    paddingHorizontal: responsive.padding(12),
    borderWidth: 1,
    borderColor: colors.softPink,
    borderRadius: responsive.borderRadius(6),
    backgroundColor: colors.softRed,
  },
  deleteText: {
    fontSize: responsive.fontSize(13),
    fontWeight: '500',
    color: colors.alertRed,
    marginLeft: responsive.margin(4),
  },
  tipCard: {
    backgroundColor: colors.lightPeach,
    padding: responsive.padding(12),
    borderRadius: responsive.borderRadius(8),
    borderWidth: 1,
    borderColor: colors.orangeF93,
  },
  tipText: {
    fontSize: responsive.fontSize(13),
    color: colors.brownOverlay60,
    lineHeight: responsive.height(18),
  },
  noEntriesText: {
    textAlign: 'center',
    fontSize: responsive.fontSize(14),
    color: colors.coolGray,
    paddingVertical: responsive.padding(20),
  },
  // Time Picker Styles
  timePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePickerContainer: {
    backgroundColor: colors.white,
    borderRadius: responsive.borderRadius(16),
    width: '90%',
    maxWidth: 350,
    maxHeight: '80%',
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: responsive.padding(20),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  timePickerTitle: {
    fontSize: responsive.fontSize(18),
    fontWeight: '600',
    color: colors.darkGray,
  },
  timePickerContent: {
    flexDirection: 'row',
    padding: responsive.padding(20),
    justifyContent: 'space-around',
  },
  timeColumn: {
    flex: 1,
    alignItems: 'center',
  },
  timeColumnLabel: {
    fontSize: responsive.fontSize(14),
    fontWeight: '600',
    color: colors.darkGray,
    marginBottom: responsive.margin(12),
  },
  timeScrollView: {
    maxHeight: 200,
  },
  timeItem: {
    paddingVertical: responsive.padding(12),
    paddingHorizontal: responsive.padding(20),
    alignItems: 'center',
  },
  selectedTimeItem: {
    backgroundColor: colors.primary + '20',
    borderRadius: responsive.borderRadius(8),
  },
  timeItemText: {
    fontSize: responsive.fontSize(16),
    color: colors.darkGray,
  },
  selectedTimeItemText: {
    color: colors.primary,
    fontWeight: '600',
  },
  timePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: responsive.padding(20),
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  timePickerButton: {
    flex: 1,
    paddingVertical: responsive.padding(14),
    borderRadius: responsive.borderRadius(8),
    alignItems: 'center',
    marginHorizontal: responsive.margin(4),
  },
  timePickerCancelButton: {
    backgroundColor: colors.gray100,
  },
  timePickerConfirmButton: {
    backgroundColor: colors.primary,
  },
  timePickerCancelText: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: colors.darkGray,
  },
  timePickerConfirmText: {
    fontSize: responsive.fontSize(16),
    fontWeight: '600',
    color: colors.white,
  },
});

export default DietFluidsScreen;