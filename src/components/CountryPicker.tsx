import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CountryPicker, { Country } from 'react-native-country-picker-modal';

interface CountryPickerProps {
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  style?: any;
}

const CountryPickerComponent = ({
  label,
  placeholder,
  value,
  onValueChange,
  style,
}: CountryPickerProps) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleSelectCountry = (country: Country) => {
    onValueChange(country.cca2);
    setShowPicker(false);
  };

  // Get country name from code
  const getCountryName = (code: string) => {
    if (!code) return placeholder;
    
    // This is a simplified approach - in a real app you might want to use the library's built-in method
    // or fetch from a mapping
    const countryMap: Record<string, string> = {
      'IN': 'India (IND)',
      'US': 'United States (USA)',
      'GB': 'United Kingdom (GBR)',
      'AU': 'Australia (AUS)',
      'CA': 'Canada (CAN)',
      'DE': 'Germany (DEU)',
      'FR': 'France (FRA)',
      'JP': 'Japan (JPN)',
      'CN': 'China (CHN)',
      'BR': 'Brazil (BRA)',
      'RU': 'Russia (RUS)',
      'ZA': 'South Africa (ZAF)',
      'NG': 'Nigeria (NGA)',
      'EG': 'Egypt (EGY)',
      'KE': 'Kenya (KEN)',
      'GH': 'Ghana (GHA)',
      'UG': 'Uganda (UGA)',
      'TZ': 'Tanzania (TZA)',
      'ZW': 'Zimbabwe (ZWE)',
      'ZM': 'Zambia (ZMB)',
      'MW': 'Malawi (MWI)',
      'SZ': 'Eswatini (SWZ)',
      'LS': 'Lesotho (LSO)',
      'NA': 'Namibia (NAM)',
      'BW': 'Botswana (BWA)',
      'MZ': 'Mozambique (MOZ)',
      'BI': 'Burundi (BDI)',
      'RW': 'Rwanda (RWA)',
      'KM': 'Comoros (COM)',
      'SC': 'Seychelles (SYC)',
      'MU': 'Mauritius (MUS)',
      'CV': 'Cape Verde (CPV)',
      'ST': 'São Tomé and Príncipe (STP)',
      'GQ': 'Equatorial Guinea (GNQ)',
      'GA': 'Gabon (GAB)',
      'CG': 'Republic of the Congo (COG)',
      'CD': 'Democratic Republic of the Congo (COD)',
      'AO': 'Angola (AGO)',
      'CF': 'Central African Republic (CAF)',
      'TD': 'Chad (TCD)',
      'CM': 'Cameroon (CMR)',
      'CI': 'Côte d\'Ivoire (CIV)',
      'GN': 'Guinea (GIN)',
      'GW': 'Guinea-Bissau (GNB)',
      'LR': 'Liberia (LBR)',
      'SL': 'Sierra Leone (SLE)',
      'TG': 'Togo (TGO)',
      'BJ': 'Benin (BEN)',
      'NE': 'Niger (NER)',
      'ML': 'Mali (MLI)',
      'BF': 'Burkina Faso (BFA)',
      'MR': 'Mauritania (MRT)',
      'SN': 'Senegal (SEN)',
      'GM': 'Gambia (GMB)',
    };

    return countryMap[code] || `${code}`;
  };

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TouchableOpacity style={styles.pickerContainer} onPress={() => setShowPicker(true)}>
        <Text style={styles.selectedText}>
          {value ? getCountryName(value) : placeholder}
        </Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>

      <CountryPicker
        visible={showPicker}
        countryCode={(value as any) || 'US'}
        onClose={() => setShowPicker(false)}
        onSelect={handleSelectCountry}
        withFilter
        withFlag
        withCountryNameButton
        withAlphaFilter
        withCallingCode
        containerButtonStyle={styles.pickerButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  selectedText: {
    fontSize: 16,
    color: '#000',
  },
  dropdownIcon: {
    fontSize: 18,
    color: '#555',
  },
  pickerButton: {
    display: 'none',
  },
});

export default CountryPickerComponent;