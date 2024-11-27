import { Slot } from 'expo-router';
import { withLayoutContext } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// Create top tabs navigator
const MaterialTopTabs = createMaterialTopTabNavigator();

// Properly configure the navigator with layout context
const TopTabs = withLayoutContext(MaterialTopTabs.Navigator);

export default function OrdersLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
      <TopTabs
        screenOptions={{
          tabBarLabelStyle: { textTransform: 'none' },
        }}>
        <TopTabs.Screen 
          name="index"
          options={{ 
            title: 'Active',
          }}
        />
        <TopTabs.Screen 
          name="archive"
          options={{ 
            title: 'Archive',
          }}
        />
      </TopTabs>
    </SafeAreaView>
  );
}

// Add this to handle the root layout
export const unstable_settings = {
  initialRouteName: 'index',
};