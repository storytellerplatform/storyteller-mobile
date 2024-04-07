import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Layout from '../components/Layout';
import { SearchStackProps, StoryType } from '../types/index';
import { createStory } from '../store/storySlice';
import { createCatelog, createCatelogContent, request, testApi, testApi2 } from '../Api/index';
import { searchImage } from '../utils/image';
import axios from 'axios';

interface SearchProps {
  navigation: SearchStackProps['navigation']
};

const Search: React.FC<SearchProps> = ({ navigation }) => {
  const dispatch = useDispatch();

  const [url, setUrl] = useState<string>('');
  const [story, setStory] = useState<StoryType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchStory = async () => {
    setLoading(true);
    Keyboard.dismiss();
    try {
      // const response = await testApi();
      // const response = await testApi2('今天天氣很好!');
      const response = await createCatelog("https://www.wenku8.net/modules/article/reader.php?aid=1787");
      // setStory(response.data);
      // dispatch(createStory(response.data));
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching story:', error);
      Alert.alert('Error', 'Unable to fetch story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout navigation={navigation} showBackButton={false}>
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
          {story && (
            <View style={styles.storyContainer}>
              <Text style={styles.storyTitle}>{story.title}</Text>
              <Text style={styles.storyContent}>{story.content}</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
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
    marginBottom: 16,
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
    paddingTop: 16,
    paddingBottom: 16,
    paddingStart: 32,
    paddingEnd: 16,
    borderRadius: 50,
    marginBottom: 20,
    color: '#000000',
    fontWeight: '400',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#ff8501',
    padding: 10,
    paddingVertical: 16,
    borderRadius: 50,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '400',
  },
  storyContainer: {
    marginTop: 20,
    padding: 10,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  storyContent: {
    fontSize: 14,
  },
});

export default Search;