import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VitalsOverviewScreen from "../screens/vitals/VitalsOverviewScreen";
import VitalsHistoryScreen from "../screens/vitals/VitalsHistoryScreen";
import AddVitalsScreen from "../screens/vitals/addVitals";
import VitalsSavedSuccessScreen from "../screens/vitals/VitalsSavedSuccessScreen";
import RHRChartScreen from "../screens/vitals/RHRChartScreen";
import BPChartScreen from "../screens/vitals/BPChartScreen";
import GlucoseChartScreen from "../screens/vitals/GlucoseChartScreen";
import SleepChartScreen from "../screens/vitals/SleepChartScreen";
import SpO2ChartScreen from "../screens/vitals/SpO2ChartScreen";
import WeightChartScreen from "../screens/vitals/WeightChartScreen";
import StepsChartScreen from "../screens/vitals/StepsChartScreen";

const Stack = createStackNavigator();

export default function VitalsStackNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="VitalsOverview" component={VitalsOverviewScreen} options={{headerShown:false}}/>
            <Stack.Screen name="VitalsHistoryScreen" component={VitalsHistoryScreen} options={{headerShown:false}}/>
            <Stack.Screen name="AddVitalsScreen" component={AddVitalsScreen} options={{headerShown:false}}/>
            <Stack.Screen name="VitalsSavedSuccessScreen" component={VitalsSavedSuccessScreen} options={{headerShown:false}}/>
            <Stack.Screen name="RHRChartScreen" component={RHRChartScreen} options={{headerShown:false}}/>
            <Stack.Screen name="BPChartScreen" component={BPChartScreen} options={{headerShown:false}}/>
            <Stack.Screen name="GlucoseChartScreen" component={GlucoseChartScreen} options={{headerShown:false}}/>
            <Stack.Screen name="SleepChartScreen" component={SleepChartScreen} options={{headerShown:false}}/>
            <Stack.Screen name="SpO2ChartScreen" component={SpO2ChartScreen} options={{headerShown:false}}/>
            <Stack.Screen name="WeightChartScreen" component={WeightChartScreen} options={{headerShown:false}}/>
            <Stack.Screen name="StepsChartScreen" component={StepsChartScreen} options={{headerShown:false}}/>
        </Stack.Navigator>
    );
}