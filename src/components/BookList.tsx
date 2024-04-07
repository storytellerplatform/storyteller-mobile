import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { BookListStackProps, BookType } from '../types';

interface BookListProps {
  item: BookType
  navigation: BookListStackProps['navigation']
};

const BookList: React.FC<BookListProps> = ({ item, navigation }) => {
  return (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Reading', { id: item.id })}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>{item.author}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
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
    width: 80,
    height: 100,
    borderRadius: 10,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    flex: 0.1,
    color: 'black',
    fontSize: 16,
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
