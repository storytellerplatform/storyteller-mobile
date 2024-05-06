import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, StatusBar, Image, Modal, Button, TouchableWithoutFeedback, useWindowDimensions, GestureResponderEvent } from 'react-native';
import { bgColors } from '../data/settingStory';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import { BookInfoProps, ReadingStackProps } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import createIdxArray from '../utils/createIndexArr';
import { createCatelogContent, createTTS, generateMusic } from '../Api';
import replaceSpecialChars from './../utils/replaceSpecialChars';
import { graySettingsImage, rightArrowImage } from '../utils/image';
import PagerView from 'react-native-pager-view';
import { bookNotFound, unableFetchBook, unableFetchBookContent } from '../utils/alert';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ReadingPageProps {
  navigation: ReadingStackProps['navigation']
  route: ReadingStackProps['route']
};

const Reading: React.FC<ReadingPageProps> = ({ navigation, route }) => {
  const currentDate = new Date();
  const currentTime = currentDate.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });

  const { width, height } = useWindowDimensions();

  const pagerViewRef = useRef<PagerView>(null);

  const [isLeisureMode, setIsLeisureMode] = useState<boolean>(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState<boolean>(false);
  const [showHeaderFooter, setShowHeaderFooter] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>('#FCE6C9');
  const [fontSize, setFontSize] = useState<number>(16);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [musicLoading, setMusicLoading] = useState<boolean>(false);
  const [sounds, setSound] = useState<Audio.Sound | null>(null);
  const [TTS, setTTS] = useState<Audio.Sound | null>(null);
  const [TTSLoading, setTTSLoading] = useState<boolean>(false);
  const [bookInfo, setBookInfo] = useState<BookInfoProps | null>(null);
  const [content, setContent] = useState<string>("");

  // 頁面
  const [currentPage, setCurrentPage] = useState<number>(0);

  const bookId = route.params.id;
  const chapterId = route.params.chapter;
  const url = route.params.url;

  const lineHeight = 52;
  const PerPageCount = (width / fontSize) * (height / lineHeight);
  const totalPages = content.length / PerPageCount;

  /**
   * todo: 組件卸載時刪除音樂
   */
  useEffect(() => { }, []);

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
    const fetchBookContent = async () => {
      try {
        const bookContent = await createCatelogContent(url.toString());
        setContent(bookContent.data);
      } catch (error) {
        unableFetchBookContent();
      }
    };

    fetchBookContent();
  }, [bookId, chapterId]);

  const contentSlice = (index: number): string => {
    const curPageContent = content.slice(index * PerPageCount, index * PerPageCount + PerPageCount);
    return curPageContent;
  };

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
    if (fontSize === 28 || fontSize === 16) return;
    setFontSize((preFS) => preFS + adjust);
  };

  const onPageSelected = (event: { nativeEvent: { position: number } }) => {
    setCurrentPage(event.nativeEvent.position);
  };

  const goToPage = (pageNumber: number) => {
    pagerViewRef.current?.setPage(pageNumber);
  };

  /**
    處理音樂工具
  */
  const toDataURI = (blob: Blob) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const uri = reader.result?.toString();
        resolve(uri);
      };
    });

  const toBuffer = async (blob: Blob) => {
    const uri: any = await toDataURI(blob);
    const base64 = uri.replace(/^.*,/g, "");
    return Buffer.from(base64, "base64");
  };

  const constructTempFilePath = async (buffer: any) => {
    const tempFilePath = FileSystem.cacheDirectory + "audio.mp3";
    await FileSystem.writeAsStringAsync(
      tempFilePath,
      buffer.toString("base64"),
      {
        encoding: FileSystem.EncodingType.Base64,
      }
    );

    return tempFilePath;
  };

  const fetchAndPlayWavFile = async () => {
    setMusicLoading(true);

    try {

      // const data = await response.json();

      const response = await generateMusic({
        texts: replaceSpecialChars(contentSlice(currentPage)),
        duration: 30,
      });

      const blob = await response.data;
      const buffer = await toBuffer(blob);
      const tempFilePath = await constructTempFilePath(buffer);
      const { sound } = await Audio.Sound.createAsync({ uri: tempFilePath });
      await sound.playAsync();

    } catch (error) {
      console.error('Error fetching the WAV file:', error);
    } finally {
      setMusicLoading(false);
    }
  };

  /**
   * 音樂暫停、重播、刪除...
   */
  const pauseMusic = async () => {
    if (sounds) {
      await sounds.pauseAsync();
    }
  };

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

  const deleteMusic = async () => {
    if (sounds) {
      await sounds.unloadAsync();
      setSound(null);
      // 可以选择删除文件
      await FileSystem.deleteAsync(FileSystem.documentDirectory + 'music.wav');
    }
  };

  /**
   * 人聲說劇
   */
  const fetchTTSAndPlay = async (text: string, gender: boolean = true) => {
    setTTSLoading(true);
    try {
      const response = await createTTS(
        text,
        gender
      );

      const blob = await response.data;
      const buffer = await toBuffer(blob);
      const tempFilePath = await constructTempFilePath(buffer);
      const { sound } = await Audio.Sound.createAsync({ uri: tempFilePath });
      await sound.playAsync();

    } catch (err) {
      console.error(err);
    } finally {
      setTTSLoading(false);
    };
  };

  const handleScreenTap = (event: GestureResponderEvent) => {
    const { locationX } = event.nativeEvent;
    const thirdOfWidth = width / 3;
    if (locationX < thirdOfWidth) {
      goToPage(Math.max(currentPage - 1, 0));
    } else if (locationX > 2 * thirdOfWidth) {
      goToPage(Math.min(currentPage + 1, totalPages));
    } else {
      setShowHeaderFooter((prevState) => !prevState);
    }
  };

  const handleShadowTap = () => {
    setShowHeaderFooter((prevState) => !prevState);
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
    <SafeAreaView style={{ backgroundColor: `${bgColor}`, ...styles.container }}>
      <StatusBar hidden={true} translucent={true} />

      {showHeaderFooter && (
        <>
          <View style={styles.header}>
            <View style={styles.headerLeftSection}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image style={styles.headerRightIcon} source={rightArrowImage} />
              </TouchableOpacity>
              <Text style={styles.headerText} numberOfLines={2}>{bookInfo.title}</Text>
            </View>
            <TouchableOpacity onPress={() => setSettingsModalVisible((prevState) => !prevState)}>
              <Image style={styles.headerLeftIcon} source={graySettingsImage} />
            </TouchableOpacity>
          </View>
          <TouchableWithoutFeedback
            onPress={handleShadowTap}
          >
            <View
              style={styles.overShadow}
            ></View>
          </TouchableWithoutFeedback>
        </>
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
                onPress={() => fetchTTSAndPlay("你好 媽喀巴咖 你好 馬卡巴咖 you are my sunshine my only sunshine")}
              >
                <Text>{TTSLoading ? "Loading..." : "朗讀"}</Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableOpacity>
      </Modal>

      {/* Main Content */}
      <View style={{ height: '96%' }}>
        {content ?
          <PagerView
            style={{ flex: 1 }}
            onPageSelected={onPageSelected}
            ref={pagerViewRef}
            initialPage={0}
          >
            {createIdxArray(totalPages).map((value, index) => (
              <View key={index} style={{ flex: 1 }}>
                <TouchableOpacity
                  style={styles.content}
                  onPress={handleScreenTap}
                  activeOpacity={1}
                >
                  <View style={styles.content}>
                    <Text style={[styles.novelText, { fontSize: fontSize }]} >
                      {contentSlice(value)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </PagerView> :
          <>
            <View style={styles.loading}>
              <Text style={styles.loadingText} >Loading...</Text>
            </View>
          </>
        }
      </View>

      <View style={styles.footer}>
        <View style={{ flex: 0.4, alignItems: 'flex-start' }}>
          <Text style={styles.footerText} numberOfLines={2}>{bookInfo.title}</Text>
        </View>
        <View style={{ flex: 0.2, alignItems: 'center' }}>
          <Text style={[styles.footerText,]}>
            {currentPage + 1} / {Number(totalPages.toFixed(0)) + 1}
          </Text>
        </View>
        <View style={{ flex: 0.4, alignItems: 'flex-end' }}>
          <Text style={styles.footerText}>{currentTime}</Text>
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
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    width: '100%',
    backgroundColor: '#2b2b2b',
    paddingHorizontal: 20,
    paddingTop: '12%',
    paddingBottom: 20,
    zIndex: 9999,
  },
  headerLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  headerRightIcon: {
    width: 26,
    height: 26,
    transform: [{ rotate: '180deg' }],
  },
  headerText: {
    width: '80%',
    color: '#c4c4c4',
    fontSize: 14,
    fontWeight: '600',
  },
  headerLeftIcon: {
    width: 32,
    height: 32,
  },
  overShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#676767',
    opacity: 0.3,
    zIndex: 9990,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 18,
    paddingHorizontal: 12,
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
    lineHeight: 16,
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
    lineHeight: 20,
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
    paddingBottom: 0,
    paddingHorizontal: 24,
    zIndex: 9000,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '500',
    opacity: 0.4,
  },
  footer2: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: '#2b2b2b',
    paddingHorizontal: 20,
    paddingVertical: 60,
    zIndex: 9900,
  },
  pageNav: {
    flexDirection: 'row',
  },
  pageNavButton: {
    color: '#FFFFFF',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#717171'
  }
});

export default Reading;
