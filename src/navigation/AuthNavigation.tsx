import React from "react";
import { createStackNavigator, Header } from "@react-navigation/stack";
import Login from "../screens/auth/Login";
import SinUp from "../screens/auth/SinUp";
import OnboardingSteps from "../screens/OnboardingSteps/OnboardingSteps";
import PrivacyPolicy from "../screens/OnboardingSteps/DetailsPage/PrivacyPolicy";
import TermsofUse from "../screens/OnboardingSteps/DetailsPage/TermsofUse";

const Stack = createStackNavigator();

export default function AuthNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
            <Stack.Screen name="SinUp" component={SinUp} options={{headerShown:false}}/>
            <Stack.Screen name="OnboardingSteps" component={OnboardingSteps} options={{headerShown:false}}/>
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{headerShown:false}}/>
            <Stack.Screen name="TermsofUse" component={TermsofUse} options={{headerShown:false}}/>
        </Stack.Navigator>
    );
}
