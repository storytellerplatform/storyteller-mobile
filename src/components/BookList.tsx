import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { BookListStackProps } from '../types';

interface BookListProps {
  id: string;
  title: string;
  author?: string;
  subtitle?: string;
  imageUrl: string;
  navigation: BookListStackProps['navigation']
};

const BookList: React.FC<BookListProps> = ({ id, title, imageUrl, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('BookInfo', { id: id })}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {/* <Text style={styles.subtitle}>{subtitle}</Text> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#d0d0d0',
    borderBottomStartRadius: 2,
    borderBottomEndRadius: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 120,
    borderRadius: 10,
    marginRight: 36,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    width: '84%',
    color: 'black',
    fontSize: 20,
    fontWeight: '700',
  },
  author: {
    flex: 0.2,
    fontSize: 15,
    opacity: 0.35,
    fontWeight: '600',
  },
  subtitle: {
    flex: 0.7,
    fontSize: 14,
    opacity: 0.5,
    fontWeight: '600',
  },
});

export default BookList;
