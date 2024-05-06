import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Layout from '../components/Layout';
import { BookInfoProps, LibraryStackProps } from '../types/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BookList from '../components/BookList';

interface LibraryProps {
  navigation: LibraryStackProps['navigation']
};

interface PartBookType {
  id: string;
  title: string;
  img: string;
};

const Library: React.FC<LibraryProps> = ({ navigation }) => {
  const [booksList, setBookList] = useState<Array<PartBookType>>([]);

  React.useEffect(() => {
    const getCollection = async () => {
      try {
        const storedBookList = await AsyncStorage.getItem('collection');
        const storedTotalBook = await AsyncStorage.getItem('book');
        if (storedBookList && storedTotalBook) {
          const bookIds: Array<string> = JSON.parse(storedBookList);
          const collectedBookList: PartBookType[] = bookIds.map(id => {
            const totalBook = JSON.parse(storedTotalBook);
            const foundBook = totalBook.find((book: BookInfoProps) => book.id === id);
            const { subtitle, url, ...partBookData } = foundBook;
            return partBookData;
          });
          setBookList(collectedBookList);
        }
      } catch (err) {
        console.error(err);
      };
    }

    getCollection();
  }, []);

  return (
    <Layout navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.navBox}>
          {/* <Text style={styles.navText}>歷史紀錄</Text> */}
          <View>
            <Text style={styles.navText}>我的收藏</Text>
            <View style={styles.underline}></View>
          </View>
          {/* <Text style={styles.navText}>更新通知</Text> */}
        </View>
        <FlatList
          data={booksList}
          renderItem={({ item }) =>
            <BookList
              id={item.id}
              title={item.title}
              imageUrl={item.img}
              navigation={navigation}
            />
          }
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
    // justifyContent: 'space-between',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingHorizontal: 32,
    paddingBottom: 10,
  },
  navText: {
    // color: '#828282',
    color: '#666666',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  underline: {
    width: '120%',
    height: 2,
    backgroundColor: '#c0c0c0',
    alignSelf: 'center',
    borderRadius: 50,
  },
});

export default Library;