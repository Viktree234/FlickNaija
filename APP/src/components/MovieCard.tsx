import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Movie } from '../types';
import { COLORS } from '../constants';

interface MovieCardProps {
  movie: Movie;
  onPress: (id: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(movie.id)}>
      <View style={styles.posterWrap}>
        <Image source={{ uri: movie.poster_url }} style={styles.poster} />
        <View style={styles.yearBadge}>
          <Text style={styles.yearText}>{movie.year || '—'}</Text>
        </View>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>★ {movie.rating}</Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={1}>{movie.title}</Text>
      <Text style={styles.meta} numberOfLines={1}>
        {movie.genres?.[0] || 'Genre'} • <Text style={styles.platform}>{movie.platforms?.[0]?.name || 'Stream'}</Text>
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: 14
  },
  posterWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#111',
    position: 'relative',
    height: 210
  },
  poster: {
    width: '100%',
    height: '100%'
  },
  yearBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  yearText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700'
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  ratingText: {
    color: '#fbbf24',
    fontSize: 10,
    fontWeight: '700'
  },
  title: {
    marginTop: 8,
    color: '#fff',
    fontWeight: '700'
  },
  meta: {
    marginTop: 2,
    color: COLORS.muted,
    fontSize: 11
  },
  platform: {
    color: COLORS.primary,
    fontWeight: '700'
  }
});

export default MovieCard;
