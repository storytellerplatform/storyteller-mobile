import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Layout from '../components/Layout';
import storiesData from '../data/stories';
import { HomeStackProps } from '../types/index';

interface StoryType {
  imageUrl: string;
  username: string;
};

const NewStory = ({ imageUrl, username }: StoryType) => (
  <TouchableOpacity style={styles.story}>
    <Image source={{ uri: imageUrl }} style={styles.storyImage} />
    <Text style={styles.storyText}>{username}</Text>
  </TouchableOpacity>
);

interface HomePorps {
  navigation: HomeStackProps['navigation']
};

const Home: React.FC<HomePorps> = ({ navigation }) => {
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
            {storiesData.map(story => (
              <NewStory
                key={story.id}
                imageUrl={story.imageUri}
                username={story.username}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.mainContainer}>
          <View style={styles.mainContent}>
            {/* 推薦書籍 */}
            <View style={styles.recommendNovelHeader}>
              <Text style={styles.titleText}>推薦好書</Text>
              <Text style={styles.moreNovelLink}>查看更多</Text>
            </View>

            <View style={styles.recommendNovel}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {/* 推薦書籍第一排 */}
                {storiesData.map((story, index) => (
                  index % 2 == 1 && (
                    <View key={story.id} >
                      <View style={styles.recommendNovelBox}>
                        <Image
                          style={styles.novelImage}
                          source={{ uri: story.imageUri }}
                        />
                        <Text style={styles.novelName}>
                          {story.name}
                        </Text>
                      </View>

                      <View style={styles.recommendNovelBox}>
                        <Image
                          style={styles.novelImage}
                          source={{ uri: storiesData[index - 1].imageUri }}
                        />
                        <Text style={styles.novelName}>
                          {storiesData[index - 1].name}
                        </Text>
                      </View>
                    </View>
                  )
                ))}
              </ScrollView>
            </View>

            {/* 熱門書籍 */}

            {/* 排行榜 */}
            <View style={styles.rankContainer}>
              <Text style={styles.titleText}>熱門排行</Text>
              <View style={styles.rankCol}>
                {storiesData.map(story => (
                  <View key={story.id} style={styles.rankNovel}>
                    <Image
                      style={styles.rankNovelImage}
                      source={{ uri: story.imageUri }}
                    />
                    <View style={styles.rankNovelIntro}>
                      <Text style={styles.rankNovelName}>{story.name}</Text>
                      <Text
                        numberOfLines={4}
                        style={styles.rankNovelDescribe}
                      >
                        {story.describe}
                      </Text>
                    </View>
                  </View>
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
    fontWeight: '500',
    marginTop: 2,
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
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  recommendNovel: {
    height: 'auto',
    marginBottom: 20,
  },
  recommendNovelBox: {
    height: 200,
    marginBottom: 8,
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
    height: 160,
    borderRadius: 10,
    marginEnd: 6,
  },
  rankNovelIntro: {
    width: '60%',
  },
  rankNovelName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rankNovelDescribe: {
    fontSize: 14,
    opacity: 0.6,
  }
});

export default Home;