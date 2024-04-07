import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // 确保已经添加了图标库

const SettingsScreen = ({ navigation, route }) => {
  const { backgroundColor, setContentStyle } = route.params;

  return (
    <View>
      {/* 这里添加设置背景颜色和字体大小的控件 */}
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [contentFontSize, setContentFontSize] = useState(14);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings', {
          backgroundColor: backgroundColor,
          setContentStyle: ({ color, fontSize }) => {
            setBackgroundColor(color);
            setContentFontSize(fontSize);
          }
        })}>
          <Icon name="gear" size={25} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, backgroundColor, contentFontSize]);

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.content, { fontSize: contentFontSize }]}>
        {/* 内容 */}
      </Text>
    </ScrollView>
  );
};

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    // ...
  },
  content: {
    // ...
  },
  // 其他样式...
});

export default App;
