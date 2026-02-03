import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieSectionCardsProps {
  title: string;
  movies: Movie[];
  onMoviePress: (id: number) => void;
}

const MovieSectionCards: React.FC<MovieSectionCardsProps> = ({ title, movies, onMoviePress }) => {
  if (!movies.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.viewAll}>View All</Text>
      </View>
      <FlatList
        data={movies}
        horizontal
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <MovieCard movie={item} onPress={onMoviePress} />}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800'
  },
  viewAll: {
    color: '#34d399',
    fontSize: 12,
    fontWeight: '700'
  }
});

export default MovieSectionCards;
