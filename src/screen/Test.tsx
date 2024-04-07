import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tests = () => {
  return (
    <SafeAreaView style={{ flex: 1, }}>
      <PagerView style={{ flex: 1 }}>
        <View style={{ flex: 1 }} key="1">
          <TouchableOpacity>
            <Text>First page</Text>
            <Text>Swipe ➡️</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }} key="2">
          <TouchableOpacity>
            <Text>Second page</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }} key="3">
          <TouchableOpacity>
            <Text>Third page</Text>
          </TouchableOpacity>
        </View>
      </PagerView>
    </SafeAreaView>
  )
}

export default Tests;

const styles = StyleSheet.create({})