import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BookInfoStackProps } from '../types'

interface BookInfoProps {
  navigation: BookInfoStackProps['navigation']
};

const BookInfo: React.FC<BookInfoProps> = () => {
  return (
    <View>
      <Text>BookInfo</Text>
    </View>
  )
}

export default BookInfo

const styles = StyleSheet.create({})