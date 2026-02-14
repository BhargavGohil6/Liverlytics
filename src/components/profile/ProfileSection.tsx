import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ProfileSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actionButton?: {
    title: string;
    onPress: () => void;
    icon?: string;
  };
  containerStyle?: object;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  subtitle,
  children,
  actionButton,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {actionButton && (
          <TouchableOpacity style={styles.actionButton} onPress={actionButton.onPress}>
            {actionButton.icon && (
              <Icon name={actionButton.icon} size={16} color="#fff" />
            )}
            <Text style={styles.actionButtonText}>{actionButton.title}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#52ab3c',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 16,
  },
});

export default ProfileSection;