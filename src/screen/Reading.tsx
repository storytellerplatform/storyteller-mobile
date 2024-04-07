import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, StatusBar, Image, Modal, Button, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import ReadingSettingIcon from '../assets/settings.png';
import bookdata from '../data/book.json';
import { bgColors } from '../data/settingStory';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import { BookType, ReadingStackProps } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { primaryColor } from '../globalStyle';
import PagerView from 'react-native-pager-view';
import createIdxArray from '../utils/createIndexArr';
import { createMusic } from '../Api';

interface ReadingPageProps {
  navigation: ReadingStackProps['navigation']
  route: ReadingStackProps['route']
};

const Reading: React.FC<ReadingPageProps> = ({ navigation, route }) => {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();

  const [isLeisureMode, setIsLeisureMode] = useState<boolean>(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState<boolean>(false);
  const [showHeaderFooter, setShowHeaderFooter] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>('#FCE6C9');
  const [fontSize, setFontSize] = useState<number>(16);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [musicLoading, setMusicLoading] = useState<boolean>(false);
  const [sounds, setSound] = useState<Audio.Sound | null>(null);

  // 頁面
  const [currentPage, setCurrentPage] = useState<number>(0);

  const id = route.params.id;
  const book_in_index: BookType | undefined = bookdata.find(book => book.id === id);

  if (book_in_index === undefined) {
    return "error";
  }

  const toggleLeisureMode = () => {
    setIsLeisureMode(!isLeisureMode);
  };

  const handleSettingsModal = () => {
    setSettingsModalVisible((prevSettingsModalVisible) => !prevSettingsModalVisible);
  };

  const handleBgColorClick = (bgColorProp: string) => {
    setBgColor(bgColorProp);
  };

  const handleFontSizeClick = (adjust: number) => {
    setFontSize((preFS) => preFS + adjust);
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: showHeaderFooter });
  }, [showHeaderFooter, navigation]);

  const handleScreenTap = () => {
    setShowHeaderFooter(!showHeaderFooter);
  };

  useEffect(() => {
    navigation.setOptions({
      title: book_in_index?.title,
      headerStyle: {
        backgroundColor: primaryColor,
      },
      headerTintColor: 'black',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: () => (
        <TouchableOpacity onPress={handleSettingsModal}>
          <Image source={ReadingSettingIcon} style={{ width: 30, height: 30, alignSelf: 'center' }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleSettingsModal]);

  const fetchAndPlayWavFile = async () => {
    setMusicLoading(true);

    try {
      const response = await createMusic(
        book_in_index.content[0][2],
        5,
      );

      const buffer = Buffer.from(response.data, 'binary').toString('base64');
      const path = FileSystem.documentDirectory + 'music.wav';
      await FileSystem.writeAsStringAsync(path, buffer, { encoding: FileSystem.EncodingType.Base64 });

      // todo: 修改
      const { sound } = await Audio.Sound.createAsync({ uri: path });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Error fetching the WAV file:', error);
    } finally {
      setMusicLoading(false);
    }
  };

  // 暂停音乐
  const pauseMusic = async () => {
    if (sounds) {
      await sounds.pauseAsync();
    }
  };

  // 继续播放音乐
  const resumeMusic = async () => {
    if (sounds) {
      await sounds.playAsync();
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      pauseMusic();
      setIsPlaying(false);
    } else {
      resumeMusic();
      setIsPlaying(true);
    }
  };

  const replayMusic = async () => {
    if (sounds) {
      await sounds.stopAsync();
      await sounds.playAsync();
    }
  };

  // 删除音乐
  const deleteMusic = async () => {
    if (sounds) {
      await sounds.unloadAsync();
      setSound(null);
      // 可以选择删除文件
      await FileSystem.deleteAsync(FileSystem.documentDirectory + 'music.wav');
    }
  };

  // 组件卸载时，卸载音乐.
  useEffect(() => {
    return () => {
      if (sounds) {
        sounds.unloadAsync();
      }
    };
  }, [sounds]);


  // 組件卸載時停止播放音樂
  // useEffect(() => {
  //   return () => {
  //     if (sound) {
  //       sound.release();
  //     }
  //   };
  // }, [sound]);

  const onPageSelected = (event: { nativeEvent: { position: number } }) => {
    setCurrentPage(event.nativeEvent.position);
  };

  const lineHeight = 52;
  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;
  const PerPageCount = (width / fontSize) * (height / lineHeight);
  const totalPages = book_in_index.content[0][2].length / PerPageCount;

  return (
    <SafeAreaView style={{ backgroundColor: `${bgColor}`, ...styles.container }}>
      <StatusBar hidden={true} translucent={true} />

      {showHeaderFooter && (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Library')}>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsModalVisible}
        // backdropPressToClose={true}
        onRequestClose={handleSettingsModal}
      >
        <TouchableWithoutFeedback onPress={handleSettingsModal}>
          <View style={styles.modalBackground}></View>
        </TouchableWithoutFeedback>

        <TouchableOpacity style={styles.modalOverlay} onPress={handleSettingsModal}>
          <View style={styles.modalView}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.settingContentContainer}
            >
              <Text style={styles.bgColorText}>背景顏色</Text>
              {bgColors.map((bgColor, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleBgColorClick(bgColor)}
                    style={{ backgroundColor: `${bgColor}`, ...styles.bgColorContainer }}>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>

            <View style={styles.fontContainer}>
              <TouchableOpacity
                style={styles.fontButton}
                onPress={() => handleFontSizeClick(-2)}
              >
                <Text>縮小字體</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.fontButton}
                onPress={() => handleFontSizeClick(2)}
              >
                <Text>放大字體</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.audioContainer}>
              <TouchableOpacity
                onPress={fetchAndPlayWavFile}
                style={styles.audioButton}
              >
                <Text>{musicLoading ? "Loading..." : "播放音樂"}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={togglePlayPause}
                style={styles.audioButton}
              >
                <Text>{isPlaying ? "暫停音樂" : "繼續播放"}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={deleteMusic}
                style={styles.audioButton}
              >
                <Text>關閉音樂</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.fontContainer}>
              <TouchableOpacity
                style={[styles.fontButton, isLeisureMode ? styles.leisureModeActive : {}]}
                onPress={toggleLeisureMode}
              >
                <Text>休閒模式</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.fontContainer}>
              <TouchableOpacity
                style={[styles.fontButton, isLeisureMode ? styles.leisureModeActive : {}]}
                onPress={toggleLeisureMode}
              >
                <Text>朗讀</Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableOpacity>
      </Modal>


      <PagerView
        style={{ flex: 1 }}
        onPageSelected={onPageSelected}
        initialPage={0}
      >
        {createIdxArray(totalPages).map((_, index) => (
          <View key={index} style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.content}
              onPress={handleScreenTap}
              activeOpacity={1}
            >
              <View style={styles.content}>
                <Text style={styles.novelText} >
                  {book_in_index.content[0][2].slice(_ * PerPageCount, _ * PerPageCount + PerPageCount)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </PagerView>

      <View style={styles.footer}>
        <View style={{ flex: 0.4, alignItems: 'flex-start' }}>
          <Text style={styles.footerText}>{book_in_index.title}</Text>
        </View>
        <View style={{ flex: 0.2, alignItems: 'center' }}>
          <Text style={[styles.footerText,]}>
            {currentPage + 1} / {Number(totalPages.toFixed(0))}
          </Text>
        </View>
        <View style={{ flex: 0.4, alignItems: 'flex-end' }}>
          <Text style={styles.footerText}>{currentHour}:{currentMinute}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  touchableArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 6,
  },
  book_title: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  book_subtitle: {
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  book_content: {
    lineHeight: 24,
    color: '#333',
    textAlign: 'left',
    paddingHorizontal: 10,
  },
  textContainer: {
    flex: 1,
    zIndex: 1, // Higher z-index than the ScrollView
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalContainer: {
    width: 'auto',
    height: 'auto',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 50,
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.0)', // 半透明背景
  },
  modalView: {
    margin: 20,
    marginTop: 70,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  settingContentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 15,
    paddingVertical: 20,
  },
  bgColorText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  bgColorContainer: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    borderRadius: 50,
    padding: 20,
    marginHorizontal: 2,
  },
  fontContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 20,
  },
  fontButton: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    borderRadius: 20,
    paddingHorizontal: 32,
    paddingVertical: 4,
  },
  audioContainer: {
    flexDirection: 'row',
    paddingBottom: 20,
    gap: 16,
  },
  audioButton: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  leisureModeActive: {
    backgroundColor: 'gray',
  },
  novelText: {
    paddingHorizontal: 6,
    lineHeight: 40,
    fontSize: 22,
    paddingBottom: 10,
  },
  footer: {
    flex: 1,
    position: 'absolute',
    bottom: 30,
    left: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    paddingHorizontal: 24,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '400'
  },
});

export default Reading;
