import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import MovieSectionCards from '../components/MovieSectionCards';
import { Movie } from '../types';
import * as movieService from '../services/movieService';
import { COLORS } from '../constants';

interface HomeScreenProps {
  onNavigate: (route: string, params?: any) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [newAfro, setNewAfro] = useState<Movie[]>([]);
  const [cheapest, setCheapest] = useState<Movie[]>([]);
  const [lowData, setLowData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [t, a, c, l] = await Promise.all([
          movieService.getTrendingMovies(),
          movieService.getNewAfroFilms(),
          movieService.getCheapestPicks(),
          movieService.getLowDataPicks()
        ]);
        setTrending(t);
        setNewAfro(a);
        setCheapest(c);
        setLowData(l);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSearch = (query: string) => {
    onNavigate('Search', { query });
  };

  const handleMoviePress = (id: number) => {
    onNavigate('Details', { id });
  };

  return (
    <View style={styles.screen}>
      <Header onHome={() => onNavigate('Home')} onBrowse={() => onNavigate('Search')} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Watch <Text style={{ color: COLORS.primary }}>Correct</Text> Movies Legally in Naija.
          </Text>
          <Text style={styles.heroSubtitle}>
            Find where to stream, rent or buy. Optimized for low data and high vibes.
          </Text>
          <SearchBar onSearch={handleSearch} />
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading Vibes...</Text>
          </View>
        ) : (
          <View>
            <MovieSectionCards title="Trending Now" movies={trending} onMoviePress={handleMoviePress} />
            <MovieSectionCards title="Cheapest Picks" movies={cheapest} onMoviePress={handleMoviePress} />

            <TouchableOpacity style={styles.promo}>
              <Text style={styles.promoLabel}>Editor's Pick</Text>
              <Text style={styles.promoTitle}>New Afro-Futurism Classics</Text>
              <Text style={styles.promoSubtitle}>Discover the next wave of cinema.</Text>
            </TouchableOpacity>

            <MovieSectionCards title="New Afro Films" movies={newAfro} onMoviePress={handleMoviePress} />
            <MovieSectionCards title="Low Data Picks" movies={lowData} onMoviePress={handleMoviePress} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg
  },
  content: {
    padding: 16,
    paddingBottom: 100
  },
  hero: {
    marginBottom: 24
  },
  heroTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 10
  },
  heroSubtitle: {
    color: '#9ca3af',
    fontSize: 16,
    marginBottom: 16
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 10
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 12,
    letterSpacing: 2
  },
  promo: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  promoLabel: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  promoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 6
  },
  promoSubtitle: {
    color: '#9ca3af',
    marginTop: 4
  }
});

export default HomeScreen;
