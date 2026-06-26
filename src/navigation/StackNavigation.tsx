import React from "react";
import { createStackNavigator, Header } from "@react-navigation/stack";
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Login from "../screens/auth/Login";
import SinUp from "../screens/auth/SinUp";
import OnboardingSteps from "../screens/OnboardingSteps/OnboardingSteps";
import PrivacyPolicy from "../screens/OnboardingSteps/DetailsPage/PrivacyPolicy";
import TermsofUse from "../screens/OnboardingSteps/DetailsPage/TermsofUse";
import TabNavigation from "./TabNavigation";
import HealthSyncNotEnabled from "../screens/healthsync/HealthSyncNotEnabled";

import DietFluidsScreen from "../screens/diet/DietFluidsScreen";

import MELDHistoryScreen from "../screens/meld-calculator/MELDHistoryScreen";
import HealthSyncErrorScreen from "../screens/healthsync/HealthSyncErrorScreen";
import SyncCompleteScreen from "../screens/healthsync/SyncCompleteScreen";

import LabReportResultsScreen from "../screens/reports/lab-report/LabReportResultsScreen";
import UploadLabReportScreen from "../screens/reports/lab-report/UploadLabReportScreen";
import LabParametersScreen from "../screens/reports/lab-report/LabParametersScreen";
import MeldTrendScreen from "../screens/reports/lab-report/MeldTrendScreen";

import ExerciseHistoryScreen from "../screens/exercises/ExerciseHistoryScreen";
import ExerciseActivityScreen from "../screens/exercises/ExerciseActivityScreen";
import MedicationAddedScreen from "../screens/medications/MedicationAddedScreen";
import MedicationDetailsScreen from "../screens/medications/MedicationDetailsScreen";
import MedicationsListScreen from "../screens/medications/MedicationsListScreen";
import AddMedicationScreen from "../screens/medications/AddMedicationScreen";
import ReportsScreen from "../screens/reports/ReportsScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import RemindersScreen from "../screens/reminders/RemindersScreen";
import RemindersAlertsScreen from "../screens/reminders/RemindersAlertsScreen";
import ReportsMainScreen from "../screens/reports/ReportsMainScreen";
import LabReportScreen from "../screens/reports/lab-report/LabReportResultsScreen";
import ExerciseSavedScreen from "../screens/exercises/ExerciseSavedScreen";

import ReportMetadata from "../screens/reports/ReportMetadata";
import CompareReports from "../screens/reports/CompareReports";
import ViewTimeline from "../screens/timeline/ViewTimeline";
import ProfileMainScreen from "../screens/profile/ProfileMainScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import ProfilePictureScreen from "../screens/profile/ProfilePictureScreen";
import PrivacySettingsScreen from "../screens/profile/PrivacySettingsScreen";
import MedicalDisclaimerScreen from "../screens/profile/MedicalDisclaimerScreen";
import DataUsageSecurityScreen from "../screens/profile/DataUsageSecurityScreen";
import AITransparencyScreen from "../screens/profile/AITransparencyScreen";
import HealthDataAccessScreen from "../screens/profile/HealthDataAccessScreen";
import WearableSyncScreen from "../screens/profile/WearableSyncScreen";
import NotificationRemindersScreen from "../screens/profile/NotificationRemindersScreen";
import AlertThresholdsScreen from "../screens/profile/AlertThresholdsScreen";
import ResetPasswordScreen from "../screens/reminders/ResetPasswordScreen";
import ChangePasswordScreen from "../screens/profile/ChangePasswordScreen";
import EditHealthTargetsScreen from "../screens/profile/EditHealthTargetsScreen";
import AIAssistantSettingsScreen from "../screens/profile/AIAssistantSettingsScreen";

const Stack = createStackNavigator();

export default function AuthNavigation() {
    const onboardingCompleted = useSelector((state: RootState) => state.auth.onboardingCompleted);
    
    return (
        <Stack.Navigator initialRouteName={onboardingCompleted ? "Dashboard" : "OnboardingSteps"}>
            {/* <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
            <Stack.Screen name="SinUp" component={SinUp} options={{headerShown:false}}/> */}
            <Stack.Screen name="OnboardingSteps" component={OnboardingSteps} options={{headerShown:false}}/>
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{headerShown:false}}/>
            <Stack.Screen name="TermsofUse" component={TermsofUse} options={{headerShown:false}}/>
            {/* <Stack.Screen name="TabNavigation" component={TabNavigation} options={{headerShown:false}}/> */}
             <Stack.Screen
    name="Dashboard"
    component={TabNavigation}
    options={{ headerShown: false }}
  />
            <Stack.Screen name="HealthSyncNotEnabled" component={HealthSyncNotEnabled} options={{headerShown:false}}/>
           <Stack.Screen name="DietFluidsScreen" component={DietFluidsScreen} options={{headerShown:false}}/>

        <Stack.Screen name="MELDHistoryScreen" component={MELDHistoryScreen} options={{headerShown:false}}/>
        <Stack.Screen name="HealthSyncErrorScreen" component={HealthSyncErrorScreen} options={{headerShown:false}}/>
        <Stack.Screen name="SyncCompleteScreen" component={SyncCompleteScreen} options={{headerShown:false}}/>
        <Stack.Screen name="UploadLabReportScreen" component={UploadLabReportScreen} options={{headerShown:false}}/>
        <Stack.Screen name="LabParametersScreen" component={LabParametersScreen} options={{headerShown:false}}/>
        <Stack.Screen name="MeldTrendScreen" component={MeldTrendScreen} options={{headerShown:false}}/>
        <Stack.Screen name="LabReportResultsScreen" component={LabReportResultsScreen} options={{headerShown:false}}/>
       <Stack.Screen name="ExerciseHistoryScreen" component={ExerciseHistoryScreen} options={{headerShown:false}}/>
       <Stack.Screen name="ExerciseActivityScreen" component={ExerciseActivityScreen} options={{headerShown:false}}/>
       <Stack.Screen name="ExerciseSavedScreen" component={ExerciseSavedScreen} options={{headerShown:false}}/>
        <Stack.Screen name="MedicationAddedScreen" component={MedicationAddedScreen} options={{headerShown:false}}/>
        <Stack.Screen name="MedicationDetailsScreen" component={MedicationDetailsScreen} options={{headerShown:false}}/>
       <Stack.Screen name="MedicationsListScreen" component={MedicationsListScreen} options={{headerShown:false}}/>
        <Stack.Screen name="AddMedicationScreen" component={AddMedicationScreen} options={{headerShown:false}}/>
       <Stack.Screen name="ReportsScreen" component={ReportsScreen} options={{headerShown:false}}/>
       <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{headerShown:false}}/>
       <Stack.Screen name="RemindersScreen" component={RemindersScreen} options={{headerShown:false}}/>

        <Stack.Screen name="ReportMetadata" component={ReportMetadata} options={{headerShown:false}}/>
        <Stack.Screen name="CompareReports" component={CompareReports} options={{headerShown:false}}/>
       <Stack.Screen name="ViewTimeline" component={ViewTimeline} options={{headerShown:false}}/>
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{headerShown:false}}/>
        <Stack.Screen name="ProfilePictureScreen" component={ProfilePictureScreen} options={{headerShown:false}}/>
        <Stack.Screen name="PrivacySettingsScreen" component={PrivacySettingsScreen} options={{headerShown:false}}/>
        <Stack.Screen name="MedicalDisclaimerScreen" component={MedicalDisclaimerScreen} options={{headerShown:false}}/>
        <Stack.Screen name="DataUsageSecurityScreen" component={DataUsageSecurityScreen} options={{headerShown:false}}/>
        <Stack.Screen name="AITransparencyScreen" component={AITransparencyScreen} options={{headerShown:false}}/>
        <Stack.Screen name="HealthDataAccessScreen" component={HealthDataAccessScreen} options={{headerShown:false}}/>
        <Stack.Screen name="WearableSyncScreen" component={WearableSyncScreen} options={{headerShown:false}}/>
        <Stack.Screen name="NotificationRemindersScreen" component={NotificationRemindersScreen} options={{headerShown:false}}/>
        <Stack.Screen name="AlertThresholdsScreen" component={AlertThresholdsScreen} options={{headerShown:false}}/>
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{headerShown:false}}/>
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{headerShown:false}}/>
        <Stack.Screen name="EditHealthTargetsScreen" component={EditHealthTargetsScreen} options={{headerShown:false}}/>
        <Stack.Screen name="AIAssistantSettingsScreen" component={AIAssistantSettingsScreen} options={{headerShown:false}}/>
        </Stack.Navigator>
    );
}
