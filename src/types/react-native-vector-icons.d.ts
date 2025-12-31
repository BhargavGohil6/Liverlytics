declare module 'react-native-vector-icons/Ionicons' {
  import { Component } from 'react';
  import { StyleProp, ViewStyle } from 'react-native';

  interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: StyleProp<ViewStyle>;
  }

  export default class Icon extends Component<IconProps> {}
}