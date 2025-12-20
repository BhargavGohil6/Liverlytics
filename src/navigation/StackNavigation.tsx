import React from "react";
import { createStackNavigator, Header } from "@react-navigation/stack";
import Login from "../screens/auth/Login";
import SinUp from "../screens/auth/SinUp";
import OnboardingSteps from "../screens/OnboardingSteps/OnboardingSteps";
import PrivacyPolicy from "../screens/OnboardingSteps/DetailsPage/PrivacyPolicy";
import TermsofUse from "../screens/OnboardingSteps/DetailsPage/TermsofUse";
import TabNavigation from "./TabNavigation";
import HealthSyncNotEnabled from "../screens/newscreens/HealthSyncNotEnabled";
import UploadedLabReportsScreen from "../screens/newscreens/UploadedLabReportsScreen"
import DietFluidsScreen from "../screens/newscreens/DietFluidsScreen";
import VitalsOverviewScreen from "../screens/dashboard/VitalsOverviewScreen";
import VitalsHistoryScreen from "../screens/newscreens/VitalsHistoryScreen";
import AddVitalsScreen from "../screens/dashboard/addVitals";
import VitalsSavedSuccessScreen from "../screens/dashboard/VitalsSavedSuccessScreen";
import MELDHistoryScreen from "../screens/newscreens/MELDHistoryScreen";
import HealthSyncErrorScreen from "../screens/newscreens/HealthSyncErrorScreen";
import SyncCompleteScreen from "../screens/newscreens/SyncCompleteScreen";
import MELDDataEntryScreen from "../screens/newscreens/MELDDataEntryScreen";
import LabReportDetailsScreen from "../screens/newscreens/LabReportDetailsScreen";
import ExerciseHistoryScreen from "../screens/newscreens/ExerciseHistoryScreen";
import ExerciseActivityScreen from "../screens/newscreens/ExerciseActivityScreen";
import MedicationAddedScreen from "../screens/newscreens/MedicationAddedScreen";
import MedicationDetailsScreen from "../screens/newscreens/MedicationDetailsScreen";
import MedicationsListScreen from "../screens/newscreens/MedicationsListScreen";
import AddMedicationScreen from "../screens/newscreens/AddMedicationScreen";
import ReportsScreen from "../screens/newscreens/ReportsScreen";
import ProfileScreen from "../screens/newscreens/ProfileScreen";
import RemindersScreen from "../screens/newscreens/RemindersScreen";
import RemindersAlertsScreen from "../screens/newscreens/RemindersAlertsScreen";
import ReportsMainScreen from "../screens/newscreens/ReportsMainScreen";
import LabReportScreen from "../screens/newscreens/LabReportDetailsScreen";
import ViewLabReports from "../screens/newscreens/ViewLabreports";
import ReportMetadata from "../screens/newscreens/ReportMetadata";
import ViewTimeline from "../screens/newscreens/ViewTimeline";
import ProfileMainScreen from "../screens/newscreens/ProfileMainScreen";
import EditProfileScreen from "../screens/newscreens/EditProfileScreen";

const Stack = createStackNavigator();

export default function AuthNavigation() {
    return (
        <Stack.Navigator>
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
           <Stack.Screen name="UploadedLabReportsScreen" component={UploadedLabReportsScreen} options={{headerShown:false}}/>
           <Stack.Screen name="DietFluidsScreen" component={DietFluidsScreen} options={{headerShown:false}}/>
           <Stack.Screen name="VitalsOverviewScreen" component={VitalsOverviewScreen} options={{headerShown:false}}/>
          <Stack.Screen name="VitalsHistoryScreen" component={VitalsHistoryScreen} options={{headerShown:false}}/>
          <Stack.Screen name="AddVitalsScreen" component={AddVitalsScreen} options={{headerShown:false}}/>
         <Stack.Screen name="VitalsSavedSuccessScreen" component={VitalsSavedSuccessScreen} options={{headerShown:false}}/>
        <Stack.Screen name="MELDHistoryScreen" component={MELDHistoryScreen} options={{headerShown:false}}/>
        <Stack.Screen name="HealthSyncErrorScreen" component={HealthSyncErrorScreen} options={{headerShown:false}}/>
        <Stack.Screen name="SyncCompleteScreen" component={SyncCompleteScreen} options={{headerShown:false}}/>
        <Stack.Screen name="MELDDataEntryScreen" component={MELDDataEntryScreen} options={{headerShown:false}}/>
        <Stack.Screen name="LabReportDetailsScreen" component={LabReportDetailsScreen} options={{headerShown:false}}/>
       <Stack.Screen name="ExerciseHistoryScreen" component={ExerciseHistoryScreen} options={{headerShown:false}}/>
       <Stack.Screen name="ExerciseActivityScreen" component={ExerciseActivityScreen} options={{headerShown:false}}/>
        <Stack.Screen name="MedicationAddedScreen" component={MedicationAddedScreen} options={{headerShown:false}}/>
        <Stack.Screen name="MedicationDetailsScreen" component={MedicationDetailsScreen} options={{headerShown:false}}/>
       <Stack.Screen name="MedicationsListScreen" component={MedicationsListScreen} options={{headerShown:false}}/>
        <Stack.Screen name="AddMedicationScreen" component={AddMedicationScreen} options={{headerShown:false}}/>
       <Stack.Screen name="ReportsScreen" component={ReportsScreen} options={{headerShown:false}}/>
       <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{headerShown:false}}/>
       <Stack.Screen name="RemindersScreen" component={RemindersScreen} options={{headerShown:false}}/>
        <Stack.Screen name="LabReportScreen" component={LabReportScreen} options={{headerShown:false}}/>
        <Stack.Screen name="ViewLabReports" component={ViewLabReports} options={{headerShown:false}}/>
        <Stack.Screen name="ReportMetadata" component={ReportMetadata} options={{headerShown:false}}/>
       <Stack.Screen name="ViewTimeline" component={ViewTimeline} options={{headerShown:false}}/>
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{headerShown:false}}/>
        </Stack.Navigator>
    );
}
