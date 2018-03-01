import omit from 'lodash/omit';
import firebase from './firebase';

const initialState = {};

export const TypeKeys = {
  CONFIRMING_NEW_EXERCISE: 'CONFIRMING_NEW_EXERCISE',
  RECEIVE_NEW_EXERCISES: 'RECEIVE_NEW_EXERCISES',
  REMOVE_NEW_EXERCISE: 'REMOVE_NEW_EXERCISE',
  REQUEST_NEW_EXERCISES: 'REQUEST_NEW_EXERCISES'
};

const requestNewExercises = user => ({
  type: TypeKeys.REQUEST_NEW_EXERCISES,
  user
});

const receiveNewExercises = data => ({
  data,
  type: TypeKeys.RECEIVE_NEW_EXERCISES
});

const removeConfirmedExercise = id => ({
  id,
  type: TypeKeys.REMOVE_NEW_EXERCISE
});

const confirmingNewExercise = id => ({
  id,
  type: TypeKeys.CONFIRMING_NEW_EXERCISE
});

export const createNewExercise = (type, reps) => () =>
  firebase
    .database()
    .ref('new_exercises/SAMPLE_USER/')
    .push({
      reps,
      timeStamp: Date.now(),
      type
    });

export const fetchNewExercises = user => dispatch => {
  dispatch(requestNewExercises(user));
  return firebase
    .database()
    .ref(`new_exercises/${user}`)
    .once('value', data => {
      dispatch(receiveNewExercises(data.val() || {}));
    });
};

export const listenForNewExercises = user => dispatch =>
  firebase
    .database()
    .ref(`new_exercises/${user}`)
    .orderByChild('timeStamp')
    .startAt(Date.now())
    .on('child_added', data => {
      dispatch(
        receiveNewExercises({
          [data.key]: data.val()
        })
      );
    });

export const deleteNewExercise = ({
  user,
  timeStamp,
  id,
  type,
  reps,
  weight
}) => dispatch => {
  dispatch(confirmingNewExercise(id));
  firebase
    .database()
    .ref(`exercises/${user}/${id}`)
    .set({
      reps,
      timeStamp,
      type,
      weight
    })
    .then(dispatch(removeConfirmedExercise(id)));
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TypeKeys.RECEIVE_NEW_EXERCISES:
      return {
        ...state,
        ...action.data
      };
    case TypeKeys.REMOVE_NEW_EXERCISE:
      return omit(state, action.id);
    default:
      return state;
  }
};
