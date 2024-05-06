import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import Layout from '../components/Layout';
import { BookProps, BookInfoProps, SearchStackProps } from '../types/index';
import { createCatelog, createCatelogContent } from '../Api/index';
import { bookImage, searchImage } from '../utils/image';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SearchProps {
  navigation: SearchStackProps['navigation']
};

const Search: React.FC<SearchProps> = ({ navigation }) => {
  const [url, setUrl] = useState<string>('https://www.wenku8.net/modules/article/reader.php?aid=1787');
  const [loading, setLoading] = useState<boolean>(false);
  const [book, setBook] = useState<BookProps | null>(null);
  const [addBookSuccess, setAddBookSuccess] = useState<number>(1);

  const fetchStory = async () => {
    setLoading(true);
    setAddBookSuccess(1);
    Keyboard.dismiss();
    try {
      // example https://www.wenku8.net/modules/article/reader.php?aid=1787
      const response = await createCatelog(url);
      const bookData: BookProps = response.data;
      console.log(bookData);
      setBook(bookData);
    } catch (error) {
      console.error('Error fetching story:', error);
      Alert.alert('Error', 'Unable to fetch story');
    } finally {
      setLoading(false);
    }
  };

  const getIdFromUrl = (url: string) => {
    const aidRegex = /aid=(\d+)/;
    const match = url.match(aidRegex);
    if (match && match[1]) {
      return match[1].toString();
    } else {
      Alert.alert('aid value not found');
      return null;
    }
  };

  const addBook = async (url: string, img: string, title: string, subtitle: string) => {
    try {
      const storedBook = await AsyncStorage.getItem('book');
      const bookList: Array<BookInfoProps> = storedBook ? JSON.parse(storedBook) : [];
      const id = getIdFromUrl(url);
      if (!id) { return; }
      const bookInfo: BookInfoProps = {
        id: id,
        title: title,
        img: img,
        url: url,
        subtitle: subtitle,
      };
      const isBookExist = bookList.some(book => book.id === id);
      if (!isBookExist) {
        bookList.push(bookInfo);
        setAddBookSuccess(3);
      } else {
        setAddBookSuccess(2);
      }
      await AsyncStorage.setItem('book', JSON.stringify(bookList));
    } catch (err) {
      Alert.alert('Error', 'Unable to store story');
    }
  };

  return (
    <Layout navigation={navigation} showBackButton={false}>
      <ScrollView>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <View style={styles.titleBox}>
              <Image style={styles.titleImg} source={searchImage} />
              <Text style={styles.title}>搜尋書本</Text>
            </View>
            <TextInput
              style={styles.input}
              onChangeText={setUrl}
              value={url}
              placeholder="輸入一個網址"
              inputMode='url'
              multiline={true}
            />
            <TouchableOpacity style={styles.button} onPress={fetchStory}>
              {loading ?
                <Text style={styles.buttonText}>Loading...</Text> :
                <Text style={styles.buttonText}>搜尋</Text>
              }
            </TouchableOpacity>

            {book &&
              <View style={styles.book}>
                <Image style={styles.bookImage} source={{ uri: book.img }} />
                <Text style={styles.bookTitle}>{book.title}</Text>
                <TouchableOpacity
                  style={styles.addBookButton}
                  onPress={() => addBook(url, book.img, book.title, book.brife_content)}
                >
                  <Text style={styles.addBookText}>
                    {
                      addBookSuccess === 1 ? "新增此書籍" :
                        addBookSuccess === 2 ? "書籍已成功添加" : "書籍已存在"
                    }
                  </Text>
                </TouchableOpacity>
              </View>
            }
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  titleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  titleImg: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    paddingTop: 20,
    paddingBottom: 20,
    paddingStart: 40,
    paddingEnd: 16,
    borderRadius: 50,
    marginBottom: 20,
    color: '#000000',
    textAlignVertical: "top",
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#ffa600',
    paddingVertical: 12,
    paddingBottom: 18,
    borderRadius: 50,
    marginBottom: 50,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  book: {
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
    marginBottom: 100,
  },
  bookImage: {
    width: 180,
    height: 260,
    borderRadius: 10,
    marginBottom: 16
  },
  bookTitle: {
    width: '70%',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  addBookButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: '#ffa600',
  },
  addBookText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default Search;