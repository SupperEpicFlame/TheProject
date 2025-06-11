import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';

import { GetReviewById, addReview, editReview, deleteReview } from './service/api';

export default function Page({ route }) {
  const { university } = route.params;
  const universityId = university.U_id;
  const [loading, setLoading] = React.useState(true);
  const [newReview, setNewReview] = useState(''); // Input for new review
  const [newUser, setNewUser] = useState(''); // Input for new user name
  const [newRaiting, setNewRaiting] = useState(''); // Input for new rating
  const [editingReviewId, setEditingReviewId] = useState(null);
const [editedUser, setEditedUser] = useState('');
const [editedComment, setEditedComment] = useState('');
const [editedRating, setEditedRating] = useState(0);

  useEffect(() => {
    setLoading(true);

    GetReviewById(universityId)
      .then((data) => {
        setReviews(data);
        setLoading(false);
        console.log("GetData", data);

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleAddReview = () => {
    if (newUser !== '') {
      addReview(universityId, newUser, newReview, newRaiting)
      GetReviewById(universityId)
      .then((data) => {
        setReviews(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }
    else {
      console.log("Please enter your name");

    }
  };

const handleEditStart = (item) => {
  setEditingReviewId(item.R_id);
  setEditedUser(item.user);
  setEditedComment(item.comment);
  setEditedRating(item.rating);
  console.log("Editing Review", item.R_id, item.user, item.comment, item.rating);
  
};

const handleCancelEdit = () => {
  setEditingReviewId(null); // Exit edit mode without saving changes
  console.log("Edit cancelled");
  
};

const handleEditSubmit = (reviewId) => {
  console.log("Submit Edit Review", reviewId, editedUser, editedComment, editedRating);
  editReview(reviewId, editedUser, editedComment, editedRating)
    .then(() => {
      const updatedReviews = reviews.map((review) =>
        review.R_id === reviewId
          ? { ...review, user: editedUser, comment: editedComment, rating: editedRating }
          : review
      );
      setReviews(updatedReviews);
      setEditingReviewId(null); // Exit edit mode
      console.log("Review edited successfully", reviewId, editedUser, editedComment, editedRating);
      
    })
    .catch((error) => console.error('Error editing review:', error));
};

const handleDeleteReview = (reviewId) => {
  console.log("Delete Review", reviewId);
  
  deleteReview(reviewId)
    .then(() => {
      GetReviewById(universityId)
      .then((data) => {
        setReviews(data);
      })
    })
    .catch((error) => console.error('Error deleting review:', error));
};

  const [reviews, setReviews] = useState([{"user": "No Comment","comment": "Some Thing Went Wrong","rating": 0}]); // Stores reviews
  const [raiting, setRaiting] = useState(0); // Star rating input

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
  const renderStarsForRatingEdit = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setEditedRating(editedRating === i ? 0 : i)} // Toggle-to-zero logic
        >
          <Image
            source={{
              uri: i <= editedRating
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

      {/* Review Input Section */}
      <View style={styles.reviewMenu}>
        <Text style={styles.sectionTitle}>Leave a Review</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={newUser}
          onChangeText={(text) => setNewUser(text.slice(0, 18))} // Limit to 20 characters
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
          keyExtractor={(item) => item.R_id}
          renderItem={({ item }) => (
            <View style={styles.reviewItem}>
              {/* Edit/Delete Button Section */}
              <View style={styles.buttonContainer}>
                {editingReviewId === item.R_id ? (
                  <>
                    {/* Cancel Button (Used to be Edit) */}
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                      <Text style={[styles.buttonText, { color: "white" }]}>Cancel</Text>
                    </TouchableOpacity>

                    {/* Save Button (Used to be Delete) */}
                    <TouchableOpacity style={styles.saveButton} onPress={() => handleEditSubmit(item.R_id)}>
                      <Text style={[styles.buttonText, { color: "white" }]}>Save</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {/* Edit Button */}
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEditStart(item)}>
                      <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>

                    {/* Delete Button */}
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteReview(item.R_id)}>
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {/* Review Editing Mode */}
              {editingReviewId === item.R_id ? (
                <>
                <Text style={[styles.sectionTitle,{ marginBottom: 17.5 }]}>Edit Review</Text>
                  <TextInput style={styles.input} value={editedUser} onChangeText={setEditedUser} />
                  <TextInput style={styles.input} value={editedComment} onChangeText={setEditedComment} />
                  <View style={styles.starInputContainer}>{renderStarsForRatingEdit()}</View>
                </>
              ) : (
                <>
                  <Text style={styles.reviewName}>{item.user}</Text>
                  <View style={styles.reviewRating}>{renderStarsForReviewDisplay(item.rating)}</View>
                  <Text style={styles.reviewText}>{item.comment}</Text>
                </>
              )}
            </View>
          )}
          scrollEnabled={false}
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
  buttonContainer: {
  position: 'absolute',
  top: 5,
  right: 5,
  flexDirection: 'row',
  gap: 5, // Ensure spacing between buttons
  alignItems: 'center', // Keep buttons aligned
  justifyContent: 'space-between', // Ensure even distribution
},
  editButton: {
    backgroundColor: 'lightgray',
    borderColor: 'black',
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginTop: 5,
    marginRight: 2.5,
    borderRadius: 3,
    height: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: 'lightgray',
    borderColor: 'black',
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginTop: 5,
    marginRight: 5,
    borderRadius: 3,
    height: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 5,
    marginRight: 2.5,
    borderRadius: 3,
    height: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 12, // Make text smaller
    fontWeight: 'bold',
  },
    saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 5,
    marginTop: 5,
    height: "100%",
    alignItems: 'center',
    justifyContent: 'center',
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