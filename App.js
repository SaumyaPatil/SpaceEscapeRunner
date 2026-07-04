import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const SHIP_WIDTH = 60;
const SHIP_HEIGHT = 70;
const MOVE_STEP = 30;
const ASTEROID_SIZE = 50;
const FALL_SPEED = 6;
const SHIP_BOTTOM = 110;
const HIGH_SCORE_KEY = 'spaceEscapeHighScore';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [shipX, setShipX] = useState(SCREEN_WIDTH / 2 - SHIP_WIDTH / 2);
  const [asteroidX, setAsteroidX] = useState(0);
  const [asteroidY, setAsteroidY] = useState(0);

  const loopRef = useRef(null);

  // Animated values (these live outside normal state so they animate smoothly).
  const spin = useRef(new Animated.Value(0)).current;    // Asteroid rotation
  const flame = useRef(new Animated.Value(1)).current;    // Ship flame pulse

  useEffect(() => { loadHighScore(); }, []);

  // Start the asteroid spinning forever, and pulse the flame forever.
  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 1200, easing: Easing.linear, useNativeDriver: true })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(flame, { toValue: 0.5, duration: 300, useNativeDriver: true }),
        Animated.timing(flame, { toValue: 1, duration: 300, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Convert the 0→1 spin value into a 0deg→360deg rotation string
  const spinDeg = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const loadHighScore = async () => {
    try {
      const saved = await AsyncStorage.getItem(HIGH_SCORE_KEY);
      if (saved !== null) setHighScore(Number(saved));
    } catch (e) { console.log(e); }
  };

  const saveHighScore = async (v) => {
    try { await AsyncStorage.setItem(HIGH_SCORE_KEY, String(v)); }
    catch (e) { console.log(e); }
  };

  const spawnAsteroid = () => {
    setAsteroidX(Math.random() * (SCREEN_WIDTH - ASTEROID_SIZE));
    setAsteroidY(0);
  };

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setShipX(SCREEN_WIDTH / 2 - SHIP_WIDTH / 2);
    spawnAsteroid();
    setIsPlaying(true);
  };

  const moveLeft = () => setShipX((x) => Math.max(0, x - MOVE_STEP));
  const moveRight = () => setShipX((x) => Math.min(SCREEN_WIDTH - SHIP_WIDTH, x + MOVE_STEP));

  useEffect(() => {
    if (!isPlaying) return;
    loopRef.current = setInterval(() => {
      setAsteroidY((prevY) => {
        const nextY = prevY + FALL_SPEED;
        if (nextY > SCREEN_HEIGHT) {
          setScore((s) => s + 1);
          spawnAsteroid();
          return 0;
        }
        return nextY;
      });
    }, 30);
    return () => clearInterval(loopRef.current);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    const shipTop = SCREEN_HEIGHT - SHIP_BOTTOM - SHIP_HEIGHT;
    const overlapX = asteroidX + ASTEROID_SIZE > shipX && asteroidX < shipX + SHIP_WIDTH;
    const overlapY = asteroidY + ASTEROID_SIZE > shipTop && asteroidY < SCREEN_HEIGHT - SHIP_BOTTOM;
    if (overlapX && overlapY) {
      setIsPlaying(false);
      setGameOver(true);
      if (score > highScore) { setHighScore(score); saveHighScore(score); }
    }
  }, [asteroidY, asteroidX, shipX, isPlaying]);

  return (
    <LinearGradient colors={['#0B0C2A', '#1A1A4E', '#2D1B69']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>SPACE ESCAPE RUNNER</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>BEST</Text>
          <Text style={styles.highValue}>{highScore}</Text>
        </View>
      </View>

      {/* Asteroid — now a spinning textured rock */}
      {isPlaying && (
        <Animated.View style={[
          styles.asteroid,
          { left: asteroidX, top: asteroidY, transform: [{ rotate: spinDeg }] },
        ]}>
          <View style={styles.crater1} />
          <View style={styles.crater2} />
        </Animated.View>
      )}

      {/* Spaceship with an animated pulsing flame */}
      <View style={[styles.ship, { left: shipX }]}>
        <View style={styles.shipNose} />
        <View style={styles.shipBody}>
          <View style={styles.cockpit} />
        </View>
        <View style={styles.wings}>
          <View style={styles.wingLeft} />
          <View style={styles.wingRight} />
        </View>
        <Animated.View style={[styles.flame, { opacity: flame, transform: [{ scaleY: flame }] }]} />
      </View>

      {gameOver && (
        <View style={styles.overlay}>
          <Text style={styles.gameOverText}>GAME OVER</Text>
          <Text style={styles.finalScore}>Score: {score}</Text>
          <Text style={styles.finalHigh}>Best: {highScore}</Text>
          <TouchableOpacity style={styles.button} onPress={startGame} activeOpacity={0.8}>
            <LinearGradient colors={['#7B5CF0', '#6C5CE7']} style={styles.buttonInner}>
              <Text style={styles.buttonText}>RESTART</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {!isPlaying && !gameOver && (
        <TouchableOpacity style={styles.startButton} onPress={startGame} activeOpacity={0.8}>
          <LinearGradient colors={['#7B5CF0', '#6C5CE7']} style={styles.buttonInner}>
            <Text style={styles.buttonText}>START GAME</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {isPlaying && (
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={moveLeft} activeOpacity={0.7}>
            <Text style={styles.controlText}>◀</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={moveRight} activeOpacity={0.7}>
            <Text style={styles.controlText}>▶</Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 80 },
  title: {
    fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', letterSpacing: 3,
    marginBottom: 24, textShadowColor: '#6C5CE7', textShadowRadius: 12,
  },

  statsRow: { flexDirection: 'row', gap: 16 },
  statBox: {
    backgroundColor: 'rgba(255,255,255,0.08)', paddingVertical: 14, paddingHorizontal: 30,
    borderRadius: 18, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  statLabel: { fontSize: 12, color: '#A0A3D0', letterSpacing: 2, marginBottom: 4 },
  scoreValue: { fontSize: 34, fontWeight: 'bold', color: '#4ADE80' },
  highValue: { fontSize: 34, fontWeight: 'bold', color: '#FFD700' },

  asteroid: {
    position: 'absolute', width: ASTEROID_SIZE, height: ASTEROID_SIZE,
    backgroundColor: '#7A6A5A', borderRadius: ASTEROID_SIZE / 2,
    borderWidth: 2, borderColor: '#9B8778',
    shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 6, shadowOffset: { width: 2, height: 2 },
  },
  crater1: {
    position: 'absolute', top: 10, left: 12, width: 12, height: 12,
    borderRadius: 6, backgroundColor: '#5C4E42',
  },
  crater2: {
    position: 'absolute', bottom: 12, right: 10, width: 8, height: 8,
    borderRadius: 4, backgroundColor: '#5C4E42',
  },

  ship: { position: 'absolute', bottom: SHIP_BOTTOM, width: SHIP_WIDTH, alignItems: 'center' },
  shipNose: {
    width: 0, height: 0, borderLeftWidth: 18, borderRightWidth: 18, borderBottomWidth: 24,
    borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#00E5FF',
  },
  shipBody: {
    width: 40, height: 28, backgroundColor: '#00B8D4', alignItems: 'center', justifyContent: 'center',
    borderBottomLeftRadius: 6, borderBottomRightRadius: 6,
    shadowColor: '#00E5FF', shadowOpacity: 0.8, shadowRadius: 8,
  },
  cockpit: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#B3F0FF' },
  wings: { flexDirection: 'row', width: 56, justifyContent: 'space-between', marginTop: -8 },
  wingLeft: {
    width: 0, height: 0, borderTopWidth: 16, borderRightWidth: 12,
    borderTopColor: '#0088A3', borderRightColor: 'transparent',
  },
  wingRight: {
    width: 0, height: 0, borderTopWidth: 16, borderLeftWidth: 12,
    borderTopColor: '#0088A3', borderLeftColor: 'transparent',
  },
  flame: {
    width: 14, height: 20, backgroundColor: '#FF6B35', borderRadius: 7, marginTop: 2,
    shadowColor: '#FF6B35', shadowOpacity: 1, shadowRadius: 10,
  },

  startButton: { position: 'absolute', bottom: 60, borderRadius: 30, overflow: 'hidden' },
  button: { borderRadius: 30, overflow: 'hidden', marginTop: 24 },
  buttonInner: { paddingVertical: 15, paddingHorizontal: 55 },
  buttonText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', letterSpacing: 2 },

  controls: {
    position: 'absolute', bottom: 30, flexDirection: 'row',
    justifyContent: 'space-between', width: '100%', paddingHorizontal: 30,
  },
  controlButton: {
    backgroundColor: 'rgba(255,255,255,0.1)', width: 80, height: 60,
    borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  controlText: { fontSize: 26, fontWeight: '600', color: '#FFFFFF' },

  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(11,12,42,0.94)', alignItems: 'center', justifyContent: 'center',
  },
  gameOverText: {
    fontSize: 46, fontWeight: 'bold', color: '#FF6B35', letterSpacing: 3,
    textShadowColor: '#FF6B35', textShadowRadius: 16,
  },
  finalScore: { fontSize: 24, color: '#FFFFFF', marginTop: 14 },
  finalHigh: { fontSize: 20, color: '#FFD700', marginTop: 6 },
});