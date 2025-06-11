import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { GetU } from './service/api';

export default function MainPage({ navigation }) {
  const [universityData, setUniversityData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    GetU()
      .then((data) => {
        setUniversityData(data);
        setLoading(false);

        // Prefetch images after data is set
        data.forEach((university) => {
          Image.prefetch(university.image);
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>เลือกมหาวิทยาลัย</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {universityData.map((university, index) => (
          <TouchableOpacity
            key={university.U_id || index} // Ensure unique keys
            style={[styles.rectangleButton, { borderColor: university.color }]} // Use university color for border and background
            onPress={() => navigation.navigate('Page', { university })}
          >
            <Image source={{ uri: university.image }} style={styles.logo} />
            <Text style={styles.buttonText}>{university.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#d',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 25,
  },
  rectangleButton: {
    width: '90%',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    borderColor: 'black',
    borderWidth: 2.5,
    backgroundColor: 'white',
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 50,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});