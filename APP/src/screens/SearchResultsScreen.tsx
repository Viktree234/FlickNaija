import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { Movie, SearchFilters } from '../types';
import * as movieService from '../services/movieService';
import { COLORS, PLATFORMS_LIST, PRICE_CATEGORIES } from '../constants';

interface SearchResultsScreenProps {
  initialQuery?: string;
  onNavigate: (route: string, params?: any) => void;
}

const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({ initialQuery = '', onNavigate }) => {
  const [query, setQuery] = useState(initialQuery);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    lowDataOnly: false
  });

  const fetchResults = async (q: string) => {
    setLoading(true);
    try {
      const results = await movieService.searchMovies(q);
      const filtered = results.filter((m) => {
        if (filters.lowDataOnly && !m.lowDataFriendly) return false;
        if (filters.platform && !m.platforms.some((p) => p.name === filters.platform)) return false;
        if (filters.priceCategory && m.priceCategory !== filters.priceCategory) return false;
        return true;
      });
      setMovies(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(query);
  }, [query, filters]);

  return (
    <View style={styles.screen}>
      <Header onHome={() => onNavigate('Home')} onBrowse={() => onNavigate('Search')} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.searchRow}>
          <View style={{ flex: 1 }}>
            <SearchBar onSearch={(q) => setQuery(q)} initialValue={query} />
          </View>
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          >
            <Text style={[styles.filterButtonText, showFilters && styles.filterButtonTextActive]}>Filter</Text>
          </TouchableOpacity>
        </View>

        {showFilters && (
          <View style={styles.filtersPanel}>
            <Text style={styles.filterTitle}>Platforms</Text>
            <View style={styles.pillsRow}>
              <TouchableOpacity onPress={() => setFilters({ ...filters, platform: undefined })} style={[styles.pill, !filters.platform && styles.pillActive]}>
                <Text style={[styles.pillText, !filters.platform && styles.pillTextActive]}>All</Text>
              </TouchableOpacity>
              {PLATFORMS_LIST.map((p) => (
                <TouchableOpacity key={p} onPress={() => setFilters({ ...filters, platform: p })} style={[styles.pill, filters.platform === p && styles.pillActive]}>
                  <Text style={[styles.pillText, filters.platform === p && styles.pillTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.filterTitle}>Low Data Only</Text>
              <TouchableOpacity onPress={() => setFilters({ ...filters, lowDataOnly: !filters.lowDataOnly })} style={[styles.toggle, filters.lowDataOnly && styles.toggleActive]}>
                <View style={[styles.toggleKnob, filters.lowDataOnly && styles.toggleKnobActive]} />
              </TouchableOpacity>
            </View>

            <Text style={styles.filterTitle}>Price Type</Text>
            <View style={styles.pillsRow}>
              <TouchableOpacity onPress={() => setFilters({ ...filters, priceCategory: undefined })} style={[styles.pill, !filters.priceCategory && styles.pillActive]}>
                <Text style={[styles.pillText, !filters.priceCategory && styles.pillTextActive]}>All</Text>
              </TouchableOpacity>
              {PRICE_CATEGORIES.map((c) => (
                <TouchableOpacity key={c} onPress={() => setFilters({ ...filters, priceCategory: c })} style={[styles.pill, filters.priceCategory === c && styles.pillActive]}>
                  <Text style={[styles.pillText, filters.priceCategory === c && styles.pillTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.resultsTitle}>
          {query ? `Results for "${query}"` : 'Browse Movies'}
          <Text style={styles.count}> ({movies.length})</Text>
        </Text>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={COLORS.primary} />
          </View>
        ) : movies.length > 0 ? (
          <View style={styles.grid}>
            {movies.map((movie) => (
              <View key={movie.id} style={styles.gridItem}>
                <MovieCard movie={movie} onPress={(id) => onNavigate('Details', { id })} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No results found. Try "Nollywood" or "Free".</Text>
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
    paddingBottom: 120
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12
  },
  filterButtonTextActive: {
    color: '#000'
  },
  filtersPanel: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 12
  },
  filterTitle: {
    color: '#9ca3af',
    fontWeight: '800',
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: 2
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  pill: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  pillText: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '700'
  },
  pillTextActive: {
    color: '#000'
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 999,
    backgroundColor: '#111',
    padding: 3
  },
  toggleActive: {
    backgroundColor: COLORS.primary
  },
  toggleKnob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff'
  },
  toggleKnobActive: {
    alignSelf: 'flex-end'
  },
  resultsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 16
  },
  count: {
    color: '#6b7280',
    fontSize: 14
  },
  loading: {
    paddingVertical: 40
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12
  },
  gridItem: {
    width: '46%'
  },
  empty: {
    paddingVertical: 60,
    alignItems: 'center'
  },
  emptyText: {
    color: '#9ca3af'
  }
});

export default SearchResultsScreen;
