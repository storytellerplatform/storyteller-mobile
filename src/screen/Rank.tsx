import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import Layout from '../components/Layout';
import { RankStackProps } from '../types/index';
import storiesData from '../data/stories';

interface RankProps {
  navigation: RankStackProps['navigation']
};

const Rank: React.FC<RankProps> = ({ navigation }) => {
  return (
    <Layout navigation={navigation} showBackButton={false} >
      {/* 这里是 Rank 页面特有的内容 */}
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.titleText}>日閱讀</Text>
          <Text style={styles.titleText}>日收藏</Text>
          <Text style={styles.titleText}>月收藏</Text>
          <Text style={styles.titleText}>月收藏</Text>
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
        >
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
        </ScrollView>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 32,
  },
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingRight: '30%',
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 16,
    zIndex: 100
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  rankCol: {
    marginTop: 60,
    paddingHorizontal: 10,
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

export default Rank;