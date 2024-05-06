import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import Layout from '../components/Layout';
import { BookInfoProps, HomeStackProps } from '../types/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StoryType {
  imageUrl: string;
  username: string;
};

const NewStory = ({ imageUrl, username }: StoryType) => (
  <View style={styles.story}>
    <Image source={{ uri: imageUrl }} style={styles.storyImage} />
    <Text style={styles.storyText} numberOfLines={2}>{username}</Text>
  </View>
);

interface HomePorps {
  navigation: HomeStackProps['navigation']
};

const Home: React.FC<HomePorps> = ({ navigation }) => {
  const [bookData, setBookData] = useState<Array<BookInfoProps>>([]);

  const navgateBookInfo = (bookId: string) => {
    navigation.navigate('BookInfo', { id: bookId })
  };

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const storedBookData = await AsyncStorage.getItem('book');
        console.log(storedBookData);
        const parsedBookData = storedBookData ? JSON.parse(storedBookData) : [];
        setBookData(parsedBookData);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Unable to fetch story');
      };
    };
    fetchBookData();
  }, []);

  return (
    <Layout navigation={navigation} showBackButton={false} >
      <ScrollView
        style={styles.homeScreen}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topContainer}>
          <Text style={styles.updateText}>最近更新</Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.stories}
          >
            {bookData.map(book => (
              <TouchableOpacity
                key={book.id}
                onPress={() => navgateBookInfo(book.id)}
              >
                <NewStory
                  imageUrl={book.img}
                  username={book.title}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.mainContainer}>
          <View style={styles.mainContent}>
            {/* 推薦書籍 */}
            {/* <View style={styles.recommendNovelHeader}>
              <Text style={styles.titleText}>推薦好書</Text>
              <Text style={styles.moreNovelLink}>查看更多</Text>
            </View> */}
            {/* 
            <View style={styles.recommendNovel}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {bookData.map((book, index) => (
                  index % 2 == 1 && (
                    <View key={book.id} >
                      <TouchableOpacity
                        style={styles.recommendNovelBox}
                        onPress={() => navgateBookInfo(book.id)}
                      >
                        <Image
                          style={styles.novelImage}
                          source={{ uri: book.img }}
                        />
                        <Text style={styles.novelName} numberOfLines={2}>
                          {book.title}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.recommendNovelBox}
                        onPress={() => navgateBookInfo(bookData[index - 1].id)}
                      >
                        <Image
                          style={styles.novelImage}
                          source={{ uri: bookData[index - 1].img }}
                        />
                        <Text style={styles.novelName}>
                          {bookData[index - 1].title}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )
                ))}
              </ScrollView>
            </View>
 */}
            {/* 熱門書籍 */}

            {/* 排行榜 */}
            <View style={styles.rankContainer}>
              <Text style={styles.titleText}>書籍清單</Text>
              <View style={styles.rankCol}>
                {bookData.map(book => (
                  <TouchableOpacity
                    key={book.id}
                    style={styles.rankNovel}
                    onPress={() => navgateBookInfo(book.id)}
                  >
                    <Image
                      style={styles.rankNovelImage}
                      source={{ uri: book.img }}
                    />
                    <View style={styles.rankNovelIntro}>
                      <Text
                        style={styles.rankNovelName}
                        numberOfLines={2}
                      >
                        {book.title}
                      </Text>
                      <Text
                        numberOfLines={4}
                        style={styles.rankNovelDescribe}
                      >
                        {book.subtitle}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

          </View>
        </View >
      </ScrollView>
    </Layout >
  );
}

const styles = StyleSheet.create({
  homeScreen: {
    backgroundColor: 'white',
  },
  topContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  updateText: {
    marginLeft: 20,
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  enterIcon: {
    width: 10,
    height: 10,
  },
  stories: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginHorizontal: 20,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
  },
  story: {
    alignItems: 'center',
    marginRight: 15,
  },
  storyImage: {
    width: 80, // Increased from 64 to 80
    height: 80, // Increased from 64 to 80
    borderRadius: 40, // Ensure this is always half of width/height to keep it circular
    borderWidth: 3, // Making the border thicker
    borderColor: '#ff8501',
    marginBottom: 5, // Space between the image and text
  },
  storyText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2,
    width: 80,
  },
  mainContainer: {
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
  },
  mainContent: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  mainText: {
    fontSize: 48
  },
  titleText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  recommendNovel: {
    height: 'auto',
    marginBottom: 20,
  },
  recommendNovelBox: {
    height: 200,
    marginBottom: 12,
  },
  novelImage: {
    width: 120,
    height: 160,
    borderRadius: 10,
    marginEnd: 24
  },
  novelName: {
    width: 120,
    paddingTop: 4,
    paddingHorizontal: 2,
    fontSize: 14,
    fontWeight: '500',
  },
  recommendNovelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankContainer: {
    paddingBottom: 60,
  },
  moreNovelLink: {
    fontWeight: '600',
    opacity: 0.6
  },
  rankHeader: {
  },
  rankHeaderText: {
  },
  rankCol: {
  },
  rankNovel: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    width: '100%',
  },
  rankNovelImage: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginEnd: 6,
  },
  rankNovelIntro: {
    width: '60%',
  },
  rankNovelName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rankNovelDescribe: {
    fontSize: 12,
    opacity: 0.6,
  }
});

export default Home;