import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { Movie } from '../types';
import { COLORS } from '../constants';
import * as movieService from '../services/movieService';
import * as geminiService from '../services/geminiService';

interface MovieDetailsScreenProps {
  id: number;
  onBack: () => void;
}

const MovieDetailsScreen: React.FC<MovieDetailsScreenProps> = ({ id, onBack }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [aiTagline, setAiTagline] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const data = await movieService.getMovieById(id);
        if (data) {
          setMovie(data);
          const tagline = await geminiService.generateNaijaTagline(data.title, data.description);
          setAiTagline(tagline);
        }
      } finally {
        setLoading(false);
      }
    };
    loadMovie();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Movie not found</Text>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.link}>Go Back Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const trailerEmbed = movieService.toYouTubeEmbed(movie.trailer_url);

  const handleShare = () => {
    const text = `Check out "${movie.title}" on FlickNaija! ${aiTagline} Watch it on ${movie.platforms[0]?.name}.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Image source={{ uri: movie.backdrop_url || movie.poster_url }} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>{movie.title}</Text>
            <Text style={styles.heroMeta}>
              {movie.year} • {movie.genres.join(', ')} • ★ {movie.rating}
            </Text>
          </View>
        </View>

        {aiTagline ? (
          <View style={styles.tagline}>
            <Text style={styles.taglineText}>"{aiTagline}"</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>The Story</Text>
          <Text style={styles.sectionBody}>{movie.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Where to Watch in Nigeria</Text>
          {movie.platforms.length === 0 ? (
            <Text style={styles.sectionBody}>No provider info yet.</Text>
          ) : (
            movie.platforms.map((p, idx) => (
              <TouchableOpacity key={`${p.name}-${idx}`} style={styles.platformCard} onPress={() => Linking.openURL(p.link)}>
                <View style={styles.platformLeft}>
                  {p.logo ? <Image source={{ uri: p.logo }} style={styles.platformLogo} /> : null}
                  <View>
                    <Text style={styles.platformName}>{p.name}</Text>
                    <Text style={styles.platformPrice}>{p.price}</Text>
                  </View>
                </View>
                <Text style={styles.watch}>Watch</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Official Trailer</Text>
          {trailerEmbed ? (
            <View style={styles.trailerWrap}>
              <WebView source={{ uri: trailerEmbed }} style={styles.trailer} />
            </View>
          ) : (
            <View style={styles.trailerFallback}>
              <Text style={styles.sectionBody}>Trailer not available yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  backText: {
    color: '#fff',
    fontWeight: '700'
  },
  shareButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.primary
  },
  shareText: {
    color: '#000',
    fontWeight: '800'
  },
  content: {
    paddingBottom: 40
  },
  hero: {
    height: 300,
    position: 'relative'
  },
  heroImage: {
    width: '100%',
    height: '100%'
  },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.45)'
  },
  heroText: {
    position: 'absolute',
    bottom: 20,
    left: 16
  },
  heroTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '900'
  },
  heroMeta: {
    color: '#d1d5db',
    marginTop: 6
  },
  tagline: {
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(16,185,129,0.4)',
    backgroundColor: 'rgba(16,185,129,0.12)'
  },
  taglineText: {
    color: COLORS.primary,
    fontWeight: '800',
    textAlign: 'center'
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 8
  },
  sectionBody: {
    color: '#9ca3af'
  },
  platformCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  platformLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  platformLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#111'
  },
  platformName: {
    color: '#fff',
    fontWeight: '700'
  },
  platformPrice: {
    color: '#9ca3af',
    fontSize: 12
  },
  watch: {
    color: '#000',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontWeight: '800',
    fontSize: 12
  },
  trailerWrap: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#111'
  },
  trailer: {
    flex: 1,
    backgroundColor: '#111'
  },
  trailerFallback: {
    height: 180,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  center: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12
  },
  link: {
    color: COLORS.primary,
    fontWeight: '800'
  }
});

export default MovieDetailsScreen;
