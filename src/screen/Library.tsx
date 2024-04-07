import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Layout from '../components/Layout';
import BookList from '../components/BookList';
// import bookdata from './../data/book';
import bookdata from '../data/book.json';
import { LibraryStackProps } from '../types/index';

interface LibraryProps {
  navigation: LibraryStackProps['navigation']
};

const Library: React.FC<LibraryProps> = ({ navigation }) => {
  return (
    <Layout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.navBox}>
          <Text style={styles.navText}>歷史紀錄</Text>
          <Text style={styles.navText}>我的收藏</Text>
          <Text style={styles.navText}>更新通知</Text>
        </View>
        <FlatList
          data={bookdata}
          renderItem={({ item }) => <BookList item={item} navigation={navigation} />}
          keyExtractor={item => item.id}
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  navBox: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingHorizontal: 32,
    paddingBottom: 10,
  },
  navText: {
    color: '#828282',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default Library;