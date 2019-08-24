import * as firebase from 'firebase/app';
import 'firebase/firestore';

export const addRestaurant = data => {
  const collection = firebase.firestore().collection('restaurants');
  return collection.add(data);

  /*
    TODO: Implement adding a document
  */
};

export const getAllRestaurants = () => {
  /*
    TODO: Retrieve list of restaurants
  */
  const query = firebase
    .firestore()
    .collection('restaurants')
    .orderBy('avgRating', 'desc')
    .limit(50);

  return query;
};

export const getDocumentsInQuery = (query, renderer) => {
  /*
    TODO: Render all documents in the provided query
  */
  return query.onSnapshot(snapshot => {
    if (!snapshot.size) return renderer.empty();

    snapshot.docChanges().forEach(change => {
      if (change.type === 'removed') {
        renderer.remove(change.doc);
      } else {
        renderer.display(change.doc);
      }
    });
  });
};

export const getRestaurant = id => {
  /*
    TODO: Retrieve a single restaurant
  */
  return firebase
    .firestore()
    .collection('restaurants')
    .doc(id)
    .get();
};

export const getFilteredRestaurants = filters => {
  /*
    TODO: Retrieve filtered list of restaurants
  */
  let query = firebase.firestore().collection('restaurants');

  if (filters.category !== 'Any') {
    query = query.where('category', '==', filters.category);
  }

  if (filters.city !== 'Any') {
    query = query.where('city', '==', filters.city);
  }

  if (filters.price !== 'Any') {
    query = query.where('price', '==', filters.price.length);
  }

  if (filters.sort === 'Rating') {
    query = query.orderBy('avgRating', 'desc');
  } else if (filters.sort === 'Reviews') {
    query = query.orderBy('numRatings', 'desc');
  }
  return query;
};

export const addRating = (restaurantID, rating) => {
  /*
    TODO: Retrieve add a rating to a restaurant
  */
  const collection = firebase.firestore().collection('restaurants');
  const document = collection.doc(restaurantID);
  const newRatingDocument = document.collection('ratings').doc();

  return firebase.firestore().runTransaction(function(transaction) {
    return transaction.get(document).then(function(doc) {
      const data = doc.data();

      const newAverage =
        (data.numRatings * data.avgRating + rating.rating) /
        (data.numRatings + 1);

      transaction.update(document, {
        numRatings: data.numRatings + 1,
        avgRating: newAverage
      });
      return transaction.set(newRatingDocument, rating);
    });
  });
};

export const getRating = id => {
  return firebase
    .firestore()
    .collection('restaurants')
    .doc(id)
    .collection('ratings')
    .orderBy('timestamp', 'desc');
};
