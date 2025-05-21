import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';

import { GetReviewById, addReview, editReview, deleteReview } from './service/api';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function Page({ route }) {
  const { university } = route.params;
  const universityId = university.U_id;
  const [loading, setLoading] = React.useState(true);
  const [rData, setRData] = React.useState([]); // Stores review data
  const [newReview, setNewReview] = useState(''); // Input for new review
  const [newUser, setNewUser] = useState(''); // Input for new user name
  const [newRaiting, setNewRaiting] = useState(''); // Input for new rating

  useEffect(() => {
    setLoading(true);
    
    GetReviewById(universityId)
      .then((data) => {
        setRating(data);
        setReviews(data);
        setLoading(false);
        console.log("oooo",data);
        
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleAddReview = () => {
    console.log("zzzzz");
    if (!newUser || !newReview ) {
    addReview(universityId,newReview, newUser, newRaiting)
      .then(() => {
        setReviews([...reviews, { U_id: universityId, user: newUser, comment: newReview, rating: newRaiting },]);
        console.log(reviews);
        
        setNewRaiting(0);
        setNewReview('');
        setNewUser('');
      })
      .catch(error => Alert.alert('Error', error.message));
    }
    else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  const [reviews, setReviews] = useState([]); // Stores reviews
  const [displayName, setDisplayName] = useState(''); // Input for display name
  const [rating, setRating] = useState(0); // Star rating input
  const [reviewText, setReviewText] = useState(''); // Input for review text

  const ddReview = () => {
    if (displayName && reviewText) {
      setReviews([
        ...reviews,
        { displayName, rating, reviewText, id: Date.now().toString() },
      ]);
      setDisplayName('');
      setRating(0);
      setReviewText('');
    }
  };

  const renderStarsForRatingInput = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setNewRaiting(newRaiting === i ? 0 : i)} // Toggle-to-zero logic
        >
          <Image
            source={{
              uri: i <= newRaiting
                ? 'https://static-00.iconduck.com/assets.00/white-medium-star-emoji-512x490-tzpa5swk.png' // Filled star URL
                : 'https://static-00.iconduck.com/assets.00/white-medium-star-emoji-512x490-x9kfixtm.png', // Empty star URL
            }}
            style={styles.starInput}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const renderStarsForReviewDisplay = (count) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Image
          key={i}
          source={{
            uri: i <= count
              ? 'https://static-00.iconduck.com/assets.00/white-medium-star-emoji-512x490-tzpa5swk.png'
              : 'https://static-00.iconduck.com/assets.00/white-medium-star-emoji-512x490-x9kfixtm.png',
          }}
          style={styles.starDisplay}
        />
      );
    }
    return stars;
  };

  return (
    <View style={[styles.container, { backgroundColor: university.color }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* University Details */}
        <View style={styles.logoContainer}>
          <Image source={{ uri: university.image }} style={styles.logo} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{university.name}</Text>
          <Text style={styles.description}>{university.detail}</Text>
        </View>

        {/* Review Section */}
        <View style={styles.reviewMenu}>
          <Text style={styles.sectionTitle}>Leave a Review</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={newUser}
            onChangeText={(text) => setNewUser(text.slice(0, 20))} // Limit to 20 characters
          />

          <TextInput
            style={[styles.input, styles.reviewInput]}
            placeholder="Your Review"
            value={newReview}
            onChangeText={(text) => setNewReview(text.slice(0, 200))} // Limit to 200 characters
          />
          <View style={styles.starInputContainer}>{renderStarsForRatingInput()}</View>
          <TouchableOpacity style={styles.submitButton} onPress={handleAddReview}>
            <Text style={styles.submitButtonText}>Submit Review</Text>
          </TouchableOpacity>
        </View>

        {/* Reviews Display */}
        <View style={styles.reviewDisplay}>
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.reviewItem}>
                <Text style={styles.reviewName}>{item.user}</Text>
                <View style={styles.reviewRating}>{renderStarsForReviewDisplay(item.rating)}</View>
                <Text style={styles.reviewText}>{item.comment}</Text>
              </View>
            )}
            scrollEnabled={false} // Prevent nested scrolling within ScrollView
          />
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 75,

  },
  logoContainer: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 20,
    marginTop: 20,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode: 'contain',
  },
  textContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'justify',
  },
  reviewMenu: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  reviewInput: {
    marginBottom: 10,
    maxWidth: '100%',
  },
  submitButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  reviewDisplay: {
    width: '90%',
    marginVertical: 20,
  },
  reviewItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  reviewName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewRating: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  reviewText: {
    fontSize: 14,
    color: '#555',
  },
  starInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  starInput: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
  },
  starDisplay: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
});