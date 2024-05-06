import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AllChapterProp, BookContentProps, BookInfoProps, BookInfoStackProps, BookProps, ChapterProps } from '../types'
import { SafeAreaView } from 'react-native-safe-area-context'
import { grayRightArrowImage, outlineStarImage, rightArrowImage, starImage } from '../utils/image'
import truncateString from '../utils/truncateString'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { bookNotFound, unableFetchBook, unableFetchBookContent } from '../utils/alert'
import { createCatelog } from '../Api'
import { BookContentResponse } from '../types/api'
import getcIdFromUrl from '../utils/getCidFromUrl'
import getLastSegment from '../utils/getPrevSegment'

interface BookInfoScreenProps {
  navigation: BookInfoStackProps['navigation'],
  route: BookInfoStackProps['route'],
};

const BookInfo: React.FC<BookInfoScreenProps> = ({ navigation, route }) => {
  const bookId: String = route.params.id;
  const [bookInfo, setBookInfo] = useState<BookInfoProps | null>(null);
  const [bookContent, setBookContent] = useState<BookContentProps | null>(null);
  const [showFullText, setShowFullText] = useState<boolean>(false);
  const [isCollected, setIsCollected] = useState<boolean>(false);

  useEffect(() => {
    const fetchBookList = async () => {
      try {
        const storedBookList = await AsyncStorage.getItem('book');
        const parsedBookList: Array<BookInfoProps> = storedBookList ? JSON.parse(storedBookList) : [];
        const selectedBook = parsedBookList.find(book => book.id === bookId);
        if (!selectedBook) {
          bookNotFound();
          return;
        }
        setBookInfo(selectedBook);
      } catch (error) {
        unableFetchBook();
      }
    };

    fetchBookList();
  }, [bookId]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        if (!bookInfo) return;
        const book = await createCatelog(bookInfo.url);
        const resBookContent: BookContentResponse = book.data.content;
        let transformedContent: AllChapterProp = {};

        Object.entries(resBookContent).map(([volume, chapters], index) => {
          const chapterTitle: string = `${volume}_${index}`;
          if (Array.isArray(chapters)) {
            const transformedChapters = chapters.map((chapter) => ({
              cid: getcIdFromUrl(chapter.url),
              name: chapter.subtitle,
              url: chapter.url
            }));

            transformedContent[chapterTitle] = transformedChapters;
          }
        });

        const formatBookContent: BookContentProps = {
          id: bookId.toString(),
          content: transformedContent
        };
        setBookContent(formatBookContent);
      } catch (error) {
        console.error(error);
        unableFetchBookContent();
      }
    };
    fetchBook();
  }, [bookInfo]);

  useEffect(() => {
    const checkIsCollected = async () => {
      try {
        const storedData = await AsyncStorage.getItem('collection');
        if (storedData) {
          const bookIds: Array<string> = JSON.parse(storedData);
          setIsCollected(bookIds.includes(bookId.toString()));
        };
      } catch (err) {
        console.log(err);
      };
    };

    checkIsCollected();
  }, []);

  const toggleShowText = () => {
    setShowFullText(!showFullText);
  };

  const collectBook = async () => {
    try {
      setIsCollected(prevState => !prevState);
      const value = await AsyncStorage.getItem('collection');

      const storedBookList = value ? JSON.parse(value) : [];

      if (!isCollected) {
        storedBookList.push(bookId);
        const updatedBookList = JSON.stringify(storedBookList);
        await AsyncStorage.setItem('collection', updatedBookList);
      } else {
        const updatedBookList = storedBookList.filter((storedbookID: string) => storedbookID !== bookId);
        await AsyncStorage.setItem('collection', JSON.stringify(updatedBookList));
      };
      const test = await AsyncStorage.getItem('collection');
      console.log(test);
    } catch (err) {
      console.error(err);
    };
  };

  if (!bookInfo) {
    return (
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Image style={styles.headerLeftIcon} source={rightArrowImage} />
          </TouchableOpacity>
          {/* <Text style={styles.headerText}>{truncateString(bookInfo.title, 15)}</Text> */}
        </View>
        {/* Loading Icon */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Image style={styles.headerLeftIcon} source={rightArrowImage} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{truncateString(bookInfo.title, 18)}</Text>
      </View>

      <ScrollView>
        {/* book info */}
        <View style={styles.bookMain}>
          <Image style={styles.bookImage} source={{ uri: bookInfo.img }} />
          <View style={styles.bookInfo}>
            <Text style={styles.title}>{bookInfo.title}</Text>
            <TouchableOpacity
              style={styles.collection}
              onPress={() => collectBook()}
            >
              {
                isCollected ?
                  <Image
                    style={styles.star}
                    source={starImage}
                  /> :
                  <Image
                    style={styles.star}
                    source={outlineStarImage}
                  />
              }
              <Text style={styles.collectionText}>{isCollected ? "已收藏" : "加入收藏"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* book describe */}
        <TouchableOpacity style={styles.describe} onPress={toggleShowText}>
          <Text
            style={styles.subTitle}
            numberOfLines={showFullText ? undefined : 3}
          >
            {bookInfo.subtitle}
          </Text>
          {!showFullText &&
            <Image style={styles.showMoreIcon} source={grayRightArrowImage} />
          }
        </TouchableOpacity>

        {/* chapter list */}
        {
          bookContent ?
            <>
              <View style={styles.chapterList}>
                {
                  Object.entries(bookContent.content).map(([volume, chapters]) => (
                    <View key={volume}>
                      <Text style={styles.chatperTitle}>{getLastSegment(volume)}</Text>
                      {chapters.map((chapter: ChapterProps) => {
                        const cid = chapter.cid as string;
                        return cid ? (
                          <TouchableOpacity
                            key={chapter.cid}
                            style={styles.chapterRow}
                            onPress={() => navigation.navigate('Reading', { id: bookId, chapter: cid, url: chapter.url })}
                          >
                            <Text style={styles.chapterText}>{truncateString(chapter.name, 16)}</Text>
                          </TouchableOpacity>
                        ) : null;
                      })}
                    </View>
                  ))
                }
              </View>
            </>
            :
            <>
              <View style={styles.loading}>
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            </>
        }
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffa600',
  },
  headerLeftIcon: {
    width: 20,
    height: 20,
    marginRight: 20,
    transform: [{ rotate: '180deg' }]
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white'
  },
  bookMain: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 20,
  },
  bookImage: {
    width: 140,
    height: 200,
    borderRadius: 10,
  },
  bookInfo: {
    flexDirection: 'column',
    width: '55%',
    gap: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  author: {
    fontSize: 18,
    fontWeight: '700',
    color: '#828282',
  },
  collection: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  star: {
    width: 28,
    height: 28,
  },
  collectionText: {
    fontSize: 16,
    fontWeight: '900',
  },
  describe: {
  },
  subTitle: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    color: '#787878',
    fontSize: 16,
    fontWeight: '400',
  },
  showMoreIcon: {
    position: 'absolute',
    right: 24,
    bottom: 40,
    width: 24,
    height: 24,
    transform: [{ rotate: '90deg' }]
  },
  chatperTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chapterList: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 120,
  },
  chapterRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 3,
    borderTopColor: '#dadada',
    borderBottomColor: '#dadada',
  },
  chapterText: {
    color: '#8d8d8d',
    fontSize: 16,
    fontWeight: '700',
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    color: '#717171',
    fontSize: 28,
    fontWeight: '600',
  },
})

export default BookInfo