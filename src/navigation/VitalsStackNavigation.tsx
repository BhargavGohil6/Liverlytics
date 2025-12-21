import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VitalsOverviewScreen from "../screens/vitals/VitalsOverviewScreen";
import VitalsHistoryScreen from "../screens/vitals/VitalsHistoryScreen";
import AddVitalsScreen from "../screens/vitals/addVitals";
import VitalsSavedSuccessScreen from "../screens/vitals/VitalsSavedSuccessScreen";

const Stack = createStackNavigator();

export default function VitalsStackNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="VitalsOverview" component={VitalsOverviewScreen} options={{headerShown:false}}/>
            <Stack.Screen name="VitalsHistoryScreen" component={VitalsHistoryScreen} options={{headerShown:false}}/>
            <Stack.Screen name="AddVitalsScreen" component={AddVitalsScreen} options={{headerShown:false}}/>
            <Stack.Screen name="VitalsSavedSuccessScreen" component={VitalsSavedSuccessScreen} options={{headerShown:false}}/>
        </Stack.Navigator>
    );
}